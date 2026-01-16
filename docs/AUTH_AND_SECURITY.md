# 🛡 Sécurité & Authentification

Ce document explique comment les données sont protégées et l'identité des utilisateurs gérée.

## 1. Gestion de l'Identité (Supabase Auth)

L'application utilise **Supabase Auth** avec les caractéristiques suivantes :
- **Email/Password** : Méthode principale.
- **Restriction de Domaine** : Seuls les emails `@calebasse.com` sont autorisés à s'inscrire ou se connecter (vérifié côté client et potentiellement via des triggers DB).
- **Hooks de Session** : Le rafraîchissement des tokens est géré automatiquement par le client Supabase.

## 2. Protection des Routes (Middleware)

La sécurité au niveau navigation est gérée centralement dans `src/middleware.ts`.

### Logique du Middleware :
- **Routes Publiques** : `/`, `/login`, `/signup`.
- **Routes Protégées** : `/dashboard`, `/library`, `/create`, `/article`, `/settings`, `/faq`.
- **Comportement** :
  - Un utilisateur **non authentifié** tentant d'accéder à une route protégée est redirigé vers la **Landing Page (`/`)**.
  - Un utilisateur **authentifié** accédant à une route publique (`/`, `/login`, `/signup`) est automatiquement redirigé vers le `/dashboard`.

## 3. Sécurité des Données (Supabase RLS)

La protection la plus critique se fait au niveau de la base de données via les **Row Level Security (RLS)**.

### Table `articles` :
- **ENABLE RLS** : Activé.
- **SELECT / UPDATE / DELETE** : Limités à `user_id = auth.uid()`.
- **INSERT** : Autorisé uniquement pour les utilisateurs authentifiés, avec forçage du `user_id`.

```sql
-- Exemple de politique RLS
CREATE POLICY "Users can only see their own articles" 
ON public.articles 
FOR SELECT 
USING (auth.uid() = user_id);
```

### Table `profiles` :
- Contient des informations étendues (langue préférée, nom complet).
- Les utilisateurs ne peuvent lire et modifier que leur propre profil.

## 4. Webhooks & API Internes

La route `/api/n8n` sert de passerelle.
- Elle empêche l'exposition des URL de production n8n dans le code source client.
- Elle valide la présence d'une session utilisateur valide avant de transmettre la requête à n8n.
- Cela évite les appels anonymes malveillants vers les agents IA.
