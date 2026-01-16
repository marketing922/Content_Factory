# 🌿 Content Factory Calebasse

![Status](https://img.shields.io/badge/Status-Production-success)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)
![N8N](https://img.shields.io/badge/N8N-Workflow_Automation-ff6d5a)

**Content Factory** est une plateforme SaaS interne avancée conçue pour automatiser et assister la rédaction d'articles de blog optimisés SEO pour le Laboratoire Calebasse. Elle combine la puissance de l'IA (via des workflows n8n) avec une interface éditoriale premium, fluide et entièrement multilingue.

---

## 🏗 Architecture & Stack Technique

Le système repose sur une architecture moderne séparant l'interface utilisateur de la logique d'IA complexe.

### 🎨 Frontend
- **Framework** : [Next.js 16](https://nextjs.org/) (App Router)
- **Langage** : TypeScript + React 19
- **Style** : Tailwind CSS v4 + Shadcn/UI
- **Éditeur** : Tiptap (Headless rich text editor)
- **Animations** : Framer Motion
- **Sécruité** : Middleware de routage intelligent via Supabase SSR.

### 🧠 Backend AI & Logique
- **Orchestration** : **n8n** (Workflows & AI Agents)
- **Fonction** : Le frontend communique avec n8n via des webhooks sécurisés pour :
    - Générer des plans (TOC) hautement structurés.
    - Rédiger des sections complètes avec streaming simulé.
    - Traduire des contenus en Français, Anglais et Chinois.
    - Valider la qualité SEO et la conformité scientifique (MTC).
- **Proxy Webhook** : Une route API interne (`/api/n8n`) agit comme passerelle sécurisée pour masquer les URL n8n.

### 💾 Base de Données
- **Provider** : **Supabase** (PostgreSQL)
- **Temps Réel** : Utilisation de **Supabase Realtime** pour synchroniser l'état de la génération (ex: passage de "En cours" à "Terminé") instantanément sur l'interface.
- **Sécurité** : Politiques RLS (Row Level Security) pour garantir que chaque utilisateur ne voit que ses propres articles.

---

## ✨ Fonctionnalités Clés

1.  **Génération Intelligente** : Création d'articles basés sur des mots-clés, avec sélection de la tonalité, langue et longueur.
2.  **Internationalisation Globale (i18n)** :
    - Interface et génération disponibles en **Français**, **Anglais** et **Chinois**.
    - Système géré via un dictionnaire centralisé (`src/lib/translations.ts`).
3.  **Plan Modifiable (TOC)** :
    - Génération automatique d'un plan structuré.
    - **Édition Directe** : Modification des titres et sections à la volée avant la rédaction finale.
    - **Régénération par Axe** : Possibilité de demander à l'IA de revoir le plan selon un angle spécifique.
4.  **Éditeur Temps Réel** :
    - Visualisation du contenu généré phrase par phrase.
    - Édition riche (gras, titres, listes) et nettoyage automatique du HTML.
5.  **Routage & UX** :
    - Landing page premium pour les visiteurs.
    - Redirection automatique des utilisateurs connectés vers le Dashboard.
    - Export aux formats **DOCX** et **PDF**.

---

## 🚀 Guide de Démarrage

### Prérequis
- Node.js 18+
- Compte Supabase (avec tables `articles` et `profiles` configurées)
- Instance n8n opérationnelle avec les workflows importés (voir `/backend n8n`)

### Installation & Lancement

```bash
# Installez les dépendances
npm install

# Mode développement
npm run dev
# L'app sera accessible sur http://localhost:3000
```

### Configuration (.env.local)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-cle-anon
SUPABASE_SERVICE_ROLE_KEY=la-cle-service-role

# N8N Webhooks (Gateways)
N8N_WEBHOOK_START_URL=...
N8N_WEBHOOK_MODIFY_PLAN_URL=...
N8N_WEBHOOK_MODIFY_ARTICLE_URL=...
N8N_WEBHOOK_TRANSLATE_URL=...
N8N_WEBHOOK_REGEN_AXIS_URL=...
```

---

## 📂 Organisation du Projet

- `src/app/` : Routes Next.js (Groupe `(app)` protégé, Groupe `(auth)` public).
- `src/components/` : Bibliothèque de composants UI et modules spécifiques (Article, TOC).
- `src/middleware.ts` : Sentinelle de sécurité et gestion intelligente des redirections.
- `src/lib/translations.ts` : Cœur de l'internationalisation multilingue.
- `backend n8n/` : Fichiers d'exportation pour les agents AI.

---

*Développé par Franck F. pour Le Laboratoire Calebasse.*