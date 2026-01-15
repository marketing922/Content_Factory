
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const nodesToAdd = [
  {
    parameters: {
      jsCode: "const body = $input.item.json.body;\n\nreturn {\n  json: {\n    article_id: body.article_id,\n    modification_request: body.request,\n    timestamp: new Date().toISOString()\n  }\n};"
    },
    id: "parse-modify-plan",
    name: "Parse Modify Plan",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [14368, 4000]
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
    id: "read-article-modify",
    name: "Read Article Modify",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [14592, 4000],
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
      text: "=Tu es un expert en édition de contenu.\n\n## MISSION\nModifie le plan de l'article (TOC) suivant en respectant les instructions de l'utilisateur.\n\n## INSTRUCTIONS DE MODIFICATION\n{{ $('Parse Modify Plan').item.json.modification_request }}\n\n## PLAN ACTUEL\n{{ JSON.stringify($json.table_of_contents, null, 2) }}\n\n## FORMAT ATTENDU (JSON STRICT)\nRetourne UNIQUEMENT le nouveau JSON complet de la TOC avec cette structure :\n{\n  \"title\": \"Nouveau titre si modifié ou actuel\",\n  \"sections\": [ ... ]\n}\n",
      options: {
        systemMessage: "Tu es un éditeur rigoureux. Tu ne modifies que ce qui est nécessaire selon les instructions."
      }
    },
    id: "ai-modifier-plan",
    name: "AI Agent Modifier Plan",
    type: "@n8n/n8n-nodes-langchain.agent",
    typeVersion: 1.7,
    position: [14816, 4000]
  },
  {
    parameters: {
      options: {}
    },
    type: "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
    typeVersion: 1,
    position: [14816, 4200],
    id: "gemini-modify-plan",
    name: "Gemini Modify Plan",
    credentials: {
      googlePalmApi: {
        id: "2NfiMV7vGBhhdclG",
        name: "Google Gemini(PaLM) Api account"
      }
    }
  },
  {
    parameters: {
      jsCode: "const input = $input.item.json;\nconst output = input.output || JSON.stringify(input);\nconst match = output.match(/\\{[\\s\\S]*\\}/);\nconst newToc = match ? JSON.parse(match[0]) : null;\n\nreturn [{\n  json: {\n    article_id: $('Parse Modify Plan').item.json.article_id,\n    new_toc: newToc\n  }\n}];"
    },
    id: "parse-new-toc",
    name: "Parse New TOC",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [15040, 4000]
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
            fieldId: "table_of_contents",
            fieldValue: "={{ $json.new_toc }}"
          }
        ]
      }
    },
    id: "update-modified-toc",
    name: "Update Modified TOC",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [15264, 4000],
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
      responseBody: "={{ {\n  status: 'modified',\n  article_id: $json.id,\n  new_toc: $json.table_of_contents,\n  message: 'Plan modifié avec succès'\n} }}",
      options: {
        responseCode: 200
      }
    },
    id: "response-modify-plan",
    name: "Response Modify Plan",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1,
    position: [15488, 4000]
  }
];

// Avoid duplicates if script is re-run
nodesToAdd.forEach(newNode => {
    if (!data.nodes.some(n => n.name === newNode.name)) {
        data.nodes.push(newNode);
    }
});

const conn = data.connections;
const addConn = (src, target, type = "main") => {
  if (!conn[src]) conn[src] = {};
  if (!conn[src][type]) conn[src][type] = [[]];
  // Avoid duplicate connections
  if (!conn[src][type][0].some(c => c.node === target)) {
      conn[src][type][0].push({ node: target, type: type, index: 0 });
  }
};

addConn("Webhook Modify Plan", "Parse Modify Plan");
addConn("Parse Modify Plan", "Read Article Modify");
addConn("Read Article Modify", "AI Agent Modifier Plan");
addConn("AI Agent Modifier Plan", "Parse New TOC");
addConn("Parse New TOC", "Update Modified TOC");
addConn("Update Modified TOC", "Response Modify Plan");
addConn("Gemini Modify Plan", "AI Agent Modifier Plan", "ai_languageModel");

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Workflow updated successfully');
