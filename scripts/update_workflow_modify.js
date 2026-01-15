
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Add "Webhook Modify Plan"
const webhookModifyPlanNode = {
    parameters: {
      httpMethod: "POST",
      path: "article/modify-plan", // Ensure this matches user's env setup
      responseMode: "responseNode",
      options: {}
    },
    id: "webhook-modify-plan",
    name: "Webhook Modify Plan",
    type: "n8n-nodes-base.webhook",
    typeVersion: 2,
    position: [29168, 23736] // Position near start
};

// 2. Add "Parse Modify Request"
const parseModifyRequestNode = {
    parameters: {
      jsCode: `const body = $input.item.json.body || $input.item.json;

// Decodage fichier si présent
let attachedFile = null;
if (body.file) {
  attachedFile = {
    name: body.file.name,
    type: body.file.type,
    // Content is extracted from base64 if needed, passed as string here
    content: Buffer.from(body.file.content, 'base64').toString('utf-8') 
  };
}

return {
  json: {
    article_id: body.article_id,
    modification_request: body.request,
    attached_file: attachedFile,
    is_modification: true,
    timestamp: new Date().toISOString()
  }
};`
    },
    id: "parse-modify-request",
    name: "Parse Modify Request",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [29392, 23736]
};

// 3. Update "AI Agent Planificateur" Prompt to handle modification
const agentPlanificateurNode = data.nodes.find(n => n.name === "AI Agent Planificateur");
let newPromptText = agentPlanificateurNode.parameters.text;

// Add modification section if not present
if (!newPromptText.includes("DEMANDE DE MODIFICATION")) {
    newPromptText = newPromptText.replace("## CONTEXTE", 
`## DEMANDE DE MODIFICATION (PRIORITAIRE)
{{ $json.is_modification ? "L'utilisateur demande une modification sur le plan existant :" : "" }}
{{ $json.modification_request ? ">>> " + $json.modification_request : "" }}
{{ $json.attached_file ? ">>> FICHIER JOINT (" + $json.attached_file.name + ") :\\n" + $json.attached_file.content : "" }}

## CONTEXTE`);
}
// Update prompt text
agentPlanificateurNode.parameters.text = newPromptText;

// 4. Update Connections
// Add Webhook -> Parse
if (!data.connections["Webhook Modify Plan"]) {
    data.connections["Webhook Modify Plan"] = {
        main: [[{ node: "Parse Modify Request", type: "main", index: 0 }]]
    };
}

// Add Parse -> AI Agent Planificateur (Merge or direct)
// We might need to fetch article data first if it's a fresh request...
// But usually modification request comes with context or we rely on memory/supabase read.
// For simplicity, let's assume we read from Supabase using ID.

// Add "Read Article for Modification"
const readArticleModNode = {
    parameters: {
        operation: "get",
        tableId: "articles",
        filters: { conditions: [{ keyName: "id", keyValue: "={{ $json.article_id }}" }] }
    },
    id: "read-article-mod",
    name: "Read Article Mod",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [29616, 23736],
    credentials: { supabaseApi: { id: "wsR97aCnWHDWGEIK", name: "Supabase account" } }
};

if (!data.connections["Parse Modify Request"]) {
    data.connections["Parse Modify Request"] = {
        main: [[{ node: "Read Article Mod", type: "main", index: 0 }]]
    };
}

// Connect Read Mod -> AI Agent Planificateur
// We need to merge this into AI Agent Planificateur input.
// Note: AI Agent Planificateur already has inputs. We can add another input connection or use a Merge node.
// But n8n nodes usually have 1 input.
// We can use the existing "Parse Article Data" or similar path if we route it there.
// For now, let's connect Read Article Mod -> AI Agent Planificateur directly (it will be another execution path).
if (!data.connections["Read Article Mod"]) {
     data.connections["Read Article Mod"] = {
        main: [[{ node: "AI Agent Planificateur", type: "main", index: 0 }]]
    };
}


// Apply updates
const nodesToUpdate = [webhookModifyPlanNode, parseModifyRequestNode, readArticleModNode, agentPlanificateurNode];

nodesToUpdate.forEach(newNode => {
    const nodeIndex = data.nodes.findIndex(n => n.name === newNode.name);
    if (nodeIndex !== -1) {
        data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...newNode };
        console.log(`Updated node: ${newNode.name}`);
    } else {
        console.log(`Node not found, adding: ${newNode.name}`);
        data.nodes.push(newNode);
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Workflow updated with Modify Plan + File Upload support.');
