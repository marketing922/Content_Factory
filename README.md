#  Content Factory Calebasse

![Status](https://img.shields.io/badge/Status-Production-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)
![N8N](https://img.shields.io/badge/N8N-Workflow_Automation-ff6d5a)

**Content Factory** est une application SaaS interne conçue pour automatiser et assister la rédaction d'articles de blog optimisés SEO pour le Laboratoire Calebasse. Elle combine la puissance de l'IA (via des workflows n8n) avec une interface éditoriale fluide et temps réel.

---

## 🏗 Architecture & Stack Technique

Le système repose sur une architecture moderne séparant l'interface utilisateur de la logique d'IA complexe.

### 🎨 Frontend (Ce Dépôt)
- **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4 + Shadcn/UI
- **Éditeur** : Tiptap (Headless rich text editor)
- **Icônes** : Lucide React
- **Animations** : Framer Motion

### 🧠 Backend AI & Logique
- **Orchestration** : **n8n** (Workflows)
- **Fonction** : Le frontend communique avec n8n via des webhooks sécurisés pour :
    - Générer des plans (TOC)
    - Rédiger des sections complètes
    - Traduire des contenus
    - Valider la qualité SEO/MTC
- **Proxy Webhook** : Une route API interne (`/api/n8n`) agit comme passerelle pour masquer les URL n8n et gérer les erreurs.

### 💾 Base de Données
- **Provider** : **Supabase**
- **Persistance** : PostgreSQL pour stocker les articles, utilisateurs et métadonnées.
- **Temps Réel** : Utilisation de **Supabase Realtime** pour synchroniser l'état de la génération (ex: passage de "En cours" à "Terminé") instantanément sur l'interface sans rechargement.

---

## ✨ Fonctionnalités Clés

1.  **Génération Intelligente** : Création d'articles basés sur des mots-clés, avec sélection de la tonalité, langue et longueur.
2.  **Plan Modifiable (TOC)** :
    - Génération automatique d'un plan structuré.
    - **Édition Directe** : Modification des titres et sections à la volée avant la rédaction.
    - **Régénération par Axe** : Possibilité de demander à l'IA de revoir le plan selon un angle spécifique (ex: "Plus scientifique").
3.  **Éditeur Temps Réel** :
    - Visualisation du contenu généré phrase par phrase (streaming simulé via Realtime DB events).
    - Édition riche (gras, titres, listes) via Tiptap.
    - Nettoyage automatique du HTML (suppression des métadonnées superflues).
4.  **Traduction** : Traduction automatique multilingue (FR, EN, CN) via workflow dédié.
5.  **Export** : Téléchargement en un clic aux formats **DOCX** et **PDF**.

---

## 🚀 Guide de Démarrage

### Prérequis
- Node.js 18+
- Compte Supabase (avec tables `articles` configurées)
- Instance n8n opérationnelle avec les workflows importés

### Installation

```bash
# Clonez le dépôt
git clone https://github.com/marketing922/Content_Factory.git

# Installez les dépendances
npm install
```

### Configuration (.env.local)

Créez un fichier `.env.local` à la racine et renseignez les clés suivantes :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=cle-anon-publique
SUPABASE_SERVICE_ROLE_KEY=cle-service-role 

# N8N Webhooks (URLs de vos workflows)
N8N_WEBHOOK_START_URL=https://n8n.instance.com/webhook/...
N8N_WEBHOOK_VALIDATE_URL=https://n8n.instance.com/webhook/...
N8N_WEBHOOK_MODIFY_PLAN_URL=https://n8n.instance.com/webhook/...
N8N_WEBHOOK_MODIFY_ARTICLE_URL=https://n8n.instance.com/webhook/...
N8N_WEBHOOK_TRANSLATE_URL=https://n8n.instance.com/webhook/...
N8N_WEBHOOK_REGEN_AXIS_URL=https://n8n.instance.com/webhook/...
```

### Lancement

```bash
# Mode développement
npm run dev
# L'app sera accessible sur http://localhost:3000
```

---

## 📂 Structure du Projet

```
src/
├── app/
│   ├── (app)/          # Routes de l'application (Dashboard, Éditeur)
│   ├── api/            # Routes API Backend (Proxy n8n)
│   └── layout.tsx      # Layout principal
├── components/
│   ├── article/        # Composants liés aux articles (TOC, Cartes)
│   ├── ui/             # Composants réutilisables (Shadcn)
│   └── editor.tsx      # Composant Éditeur Tiptap
└── lib/
    └── supabase.ts     # Client Supabase
```

---

*Développé par l'équipe 1337 pour Le Laboratoire Calebasse.*