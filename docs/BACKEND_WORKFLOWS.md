# 🧠 Intégration Backend & IA (n8n)

L'intelligence de la plateforme réside dans l'orchestration des workflows n8n.

## 1. Mécanisme des Webhooks

Le frontend interagit avec n8n quasi exclusivement via des requêtes HTTP POST envoyées à une passerelle (`src/app/api/n8n/route.ts`).

### Pourquoi un Proxy ?
- **Sécurité** : Ne pas exposer l'adresse IP ou le domaine de l'instance n8n.
- **Header Management** : Ajouter des headers d'authentification ou des logs de tracking.
- **Error Handling** : Formater les erreurs d'IA avant qu'elles n'atteignent le client.

## 2. Cycle de Vie d'un Article

### Étape 1 : Initialisation (`N8N_WEBHOOK_START_URL`)
- L'utilisateur soumet ses paramètres (sujet, ton, langue).
- n8n reçoit les données et crée une ligne dans la table `articles` avec un statut `researching`.
- n8n retourne l'ID de l'article créé au frontend.

### Étape 2 : Planification & Validation (`N8N_WEBHOOK_MODIFY_PLAN_URL`)
- Après la recherche, n8n propose un plan (TOC).
- L'UI permet à l'utilisateur de modifier ce plan.
- Le webhook de modification est appelé lorsque l'utilisateur édite un titre ou demande un changement via l'assistant.

### Étape 3 : Rédaction (`N8N_WEBHOOK_VALIDATE_URL`)
- Une fois le plan validé, n8n lance la rédaction.
- Pour chaque section, n8n met à jour la colonne `content` dans Supabase.

## 3. Synchronisation Temps Réel (Realtime)

Pour offrir une expérience "vivante", nous utilisons Supabase Realtime.

### Côté Frontend (`ArticlePage`) :
Le composant s'abonne aux changements de la ligne de l'article spécifique :
```tsx
const channel = supabase
  .channel(`article-${id}`)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'articles', filter: `id=eq.${id}` }, 
  (payload) => {
    setArticle(payload.new);
  })
  .subscribe();
```

### Côté n8n :
Pas de logique supplémentaire. n8n fait un simple `UPDATE` sur la base de données. Supabase se charge de notifier tous les clients connectés via WebSockets.

## 4. Workflows disponibles

- **Start** : Lancement initial.
- **Modify Plan** : Ajustement de la structure.
- **Modify Article** : Demande de retouche sur le texte final.
- **Translate** : Traduction de l'article existant.
- **Regen Axis** : Recréation complète du plan selon un nouvel axe.

## 5. Gestion des Erreurs

Les workflows n8n incluent généralement des branches d'erreur qui mettent à jour l'article avec un statut `error`, permettant au frontend d'afficher un message `t.common.error` et d'arrêter les loaders.
