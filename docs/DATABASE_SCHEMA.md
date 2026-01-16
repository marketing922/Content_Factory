# 🗄 Schéma de la Base de Données

L'application utilise une base de données PostgreSQL gérée par **Supabase** (Base de Données managée et distribuée).

## 1. Table `articles`

C'est la table centrale stockant les contenus et leur état.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Clé primaire (Générée par défaut). |
| `created_at` | TIMESTAMPTZ | Date de création. |
| `user_id` | UUID | Lien vers `auth.users(id)`. Identifie le propriétaire. |
| `title` | TEXT | Titre principal de l'article. |
| `content` | TEXT | Corps de l'article (format HTML). |
| `status` | TEXT | État : `draft`, `researching`, `writing`, `validation_required`, `completed`, `error`. |
| `score` | INTEGER | Note de qualité globale (0-100). |
| `language` | TEXT | Langue de l'article (fr, en, cn). |
| `table_of_contents` | JSONB | Structure du plan (sections, sous-sections). |
| `research_data` | JSONB | Données brutes issues de la phase de recherche IA. |
| `quality_evaluation` | JSONB | Détails des critères SEO et scientifiques évalués. |
| `sources` | JSONB | Liste des URL et références utilisées par l'IA. |

## 2. Table `profiles`

Stocke les informations utilisateur étendues.

| Colonne | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Clé primaire (Lien direct vers `auth.users(id)`). |
| `full_name` | TEXT | Nom de l'utilisateur. |
| `avatar_url` | TEXT | URL de la photo de profil. |
| `language` | TEXT | Langue préférée pour l'interface (`fr`, `en`, `zh`). |
| `updated_at` | TIMESTAMPTZ | Date de dernière mise à jour. |

## 3. Realtime Configuration

La table `articles` a le mode **Realtime** activé. Cela permet la synchronisation bi-directionnelle entre n8n (qui écrit) et le frontend (qui lit).

Pour vérifier l'état ou activer manuellement :
```sql
ALTER TABLE articles REPLICA IDENTITY FULL;
-- Ajoutez la table au canal de publication
ALTER PUBLICATION supabase_realtime ADD TABLE articles;
```

## 4. Politique de Nettoyage

Il est recommandé de ne pas supprimer physiquement les articles de la table `articles` immédiatement, ou d'utiliser un flag `is_deleted` pour permettre une récupération si nécessaire (non implémenté pour le moment, les suppressions sont physiques via l'UI).
