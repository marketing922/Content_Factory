
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const nodesToAdd = [
  {
    parameters: {
      httpMethod: "POST",
      path: "article/modify-article",
      responseMode: "responseNode",
      options: {}
    },
    id: "webhook-modify-article",
    name: "Webhook Modify Article",
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position: [14144, 5000],
    webhookId: "modify-article"
  },
  {
    parameters: {
      jsCode: "const body = $input.item.json.body;\n\nreturn {\n  json: {\n    article_id: body.article_id,\n    instructions: body.instructions,\n    selection: body.selection,\n    timestamp: new Date().toISOString()\n  }\n};"
    },
    id: "parse-modify-article",
    name: "Parse Modify Article",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [14368, 5000]
  },
  {
    parameters: {
      operation: "get",
      tableId: "articles",
      filters: {
        conditions: [
          {
            keyName: "id",
            keyValue: "={{ $json.article_id }}"
          }
        ]
      }
    },
    id: "read-article-modify-content",
    name: "Read Article Modify Content",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [14592, 5000],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
  },
  {
    parameters: {
      promptType: "define",
      text: "=Tu es un rédacteur expert.\n\n## MISSION\nRéécris des parties de l'article suivant selon les instructions.\n\n## INSTRUCTIONS\n{{ $('Parse Modify Article').item.json.instructions }}\n\n## SELECTION DES SECTIONS À RÉÉCRIRE\n{{ JSON.stringify($('Parse Modify Article').item.json.selection) }}\n\n## ARTICLE ACTUEL\n{{ $json.content }}\n\n## FORMAT ATTENDU\nOptimise et réécris DIRECTEMENT l'article complet au format Markdown.\n",
      options: {
        systemMessage: "Tu es un rédacteur talentueux qui améliore le contenu en restant fidèle au style initial sauf indication contraire."
      }
    },
    id: "ai-modifier-article",
    name: "AI Agent Modifier Article",
    type: "@n8n/n8n-nodes-langchain.agent",
    typeVersion: 1.7,
    position: [14816, 5000]
  },
  {
    parameters: {
      options: {}
    },
    type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
    typeVersion: 1,
    position: [14816, 5200],
    id: "gemini-modify-article",
    name: "Gemini Modify Article",
    credentials: {
      googlePalmApi: {
        id: "2NfiMV7vGBhhdclG",
        name: "Google Gemini(PaLM) Api account"
      }
    }
  },
  {
    parameters: {
      jsCode: "const input = $input.item.json;\nconst newContent = input.output || JSON.stringify(input);\n\nreturn [{\n  json: {\n    article_id: $('Parse Modify Article').item.json.article_id,\n    new_content: newContent\n  }\n}];"
    },
    id: "parse-new-content",
    name: "Parse New Content",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [15040, 5000]
  },
  {
    parameters: {
      operation: "update",
      tableId: "articles",
      matchType: "allFilters",
      filters: {
        conditions: [
          {
            keyName: "id",
            condition: "eq",
            keyValue: "={{ $json.article_id }}"
          }
        ]
      },
      fieldsUi: {
        fieldValues: [
          {
            fieldId: "content",
            fieldValue: "={{ $json.new_content }}"
          },
          {
            fieldId: "status",
            fieldValue: "completed"
          }
        ]
      }
    },
    id: "update-modified-content",
    name: "Update Modified Content",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [15264, 5000],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
  },
  {
    parameters: {
      respondWith: "json",
      responseBody: "={{ { status: 'completed', article_id: $json.id, message: 'Article modifié avec succès' } }}",
      options: { responseCode: 200 }
    },
    id: "response-modify-article",
    name: "Response Modify Article",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1,
    position: [15488, 5000]
  }
];

nodesToAdd.forEach(newNode => {
    if (!data.nodes.some(n => n.name === newNode.name)) {
        data.nodes.push(newNode);
    }
});

const conn = data.connections;
const addConn = (src, target, type = "main") => {
  if (!conn[src]) conn[src] = {};
  if (!conn[src][type]) conn[src][type] = [[]];
  if (!conn[src][type][0].some(c => c.node === target)) {
      conn[src][type][0].push({ node: target, type: type, index: 0 });
  }
};

addConn("Webhook Modify Article", "Parse Modify Article");
addConn("Parse Modify Article", "Read Article Modify Content");
addConn("Read Article Modify Content", "AI Agent Modifier Article");
addConn("AI Agent Modifier Article", "Parse New Content");
addConn("Parse New Content", "Update Modified Content");
addConn("Update Modified Content", "Response Modify Article");
addConn("Gemini Modify Article", "AI Agent Modifier Article", "ai_languageModel");

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Workflow updated with article modification branch');
