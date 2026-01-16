# 📖 Guide du Développeur - Content Factory

Bienvenue dans la documentation développeur de **Content Factory Calebasse**. Ce guide est conçu pour vous aider à comprendre, maintenir et faire évoluer la plateforme.

## 🚀 Navigation Rapide

- [**Architecture Globale**](./ARCHITECTURE.md) : Comprendre comment les briques (Next.js, Supabase, n8n) communiquent.
- [**Authentification & Sécurité**](./AUTH_AND_SECURITY.md) : Middleware, politiques RLS et protection des routes.
- [**Internationalisation (i18n)**](./I18N.md) : Comment ajouter des langues ou modifier les textes de l'interface.
- [**Workflows Backend (n8n)**](./BACKEND_WORKFLOWS.md) : Orchestration de l'IA et synchronisation temps réel.
- [**Schéma de Base de Données**](./DATABASE_SCHEMA.md) : Structure des tables PostgreSQL.

---

## 🛠 Installation Locale

### 1. Cloner le repo & Dépendances
```bash
git clone https://github.com/marketing922/Content_Factory.git
cd Content_Factory
npm install
```

### 2. Environnement
Copiez `.env.example` (ou créez `.env.local`) et remplissez les valeurs Supabase et n8n.

### 3. Lancement
```bash
npm run dev
```

---

## 💡 Concepts de Développement

### Développer de nouveaux composants
L'application utilise **Tailwind CSS v4**.
- Privilégiez l'utilisation des variables de thème (`var(--primary)`, `var(--background)`).
- Utilisez les composants de `src/components/ui/` pour maintenir une cohérence visuelle.

### Modifier la logique d'IA
Si vous souhaitez changer la manière dont l'IA rédige :
1.  Ouvrez l'instance **n8n**.
2.  Importez ou modifiez le workflow correspondant (voir `/backend n8n`).
3.  Modifiez le noeud "AI Agent" directement dans n8n.
4.  Aucun changement de code frontend n'est nécessaire si les noms des webhooks restent identiques.

### Débogage
- **Logs Frontend** : Les erreurs d'API n8n apparaissent dans les toasts (Sonner) et dans la console via le proxy.
- **Logs Backend** : Consultez l'onglet "Executions" dans n8n pour suivre le cheminement de l'IA.
- **Supabase Logs** : Utilizez l'interface de Supabase pour vérifier les requêtes SQL et les erreurs de politiques RLS.

---

## 📦 Déploiement

L'application est optimisée pour **Netlify** ou **Vercel**.
- Assurez-vous que toutes les variables d'environnement du `.env.local` sont renseignées dans les paramètres de la plateforme de déploiement (variable d'environnement).
- Le build se fait via `npm run build`.

---

*Bon code ! Pour toute question, hésitez pas à me contacter.*
