-- 1. Mettre à jour la table profiles (ajout email et username)
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists username text;

-- 2. Mettre à jour le trigger pour copier ces infos depuis auth.users vers profiles
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email, username)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    new.raw_user_meta_data->>'username'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 3. Sécuriser la table articles (Lien avec le User)
-- Assurez-vous que la table articles a bien user_id
alter table public.articles 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Activer la sécurité RLS sur articles
alter table public.articles enable row level security;

-- Politique : On ne voit que ses propres articles
drop policy if exists "Users can only see their own articles" on public.articles;
create policy "Users can only see their own articles"
on public.articles for select
using (auth.uid() = user_id);

-- Politique : On ne peut créer des articles que pour soi-même
drop policy if exists "Users can only insert their own articles" on public.articles;
create policy "Users can only insert their own articles"
on public.articles for insert
with check (auth.uid() = user_id);
