
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Create a dedicated "Update TOC Modification" node
// This node will handle updates specifically for the modification flow
// avoiding dependencies on "Parse Research Output" which doesn't exist here.
const updateTocModificationNode = {
    parameters: {
      operation: "update",
      tableId: "articles",
      matchType: "allFilters",
      filters: {
        conditions: [
            { keyName: "id", condition: "eq", keyValue: "={{ $('Parse Modify Plan').first().json.article_id }}" }
        ]
      },
      fieldsUi: {
        fieldValues: [
          {
            fieldId: "table_of_contents",
            fieldValue: "={{ $('Parse New TOC').first().json.new_toc }}"
          },
          // We don't update sources or plan_options here unless AI regenerates them completely.
          // For a simple restructure, usually we keep existing options or AI returns new ones.
          // Let's assume AI returns a new TOC structure.
          
          // IMPORTANT: Reset status to 'waiting_validation' if it wasn't already
          {
            fieldId: "status",
            fieldValue: "waiting_validation"
          }
        ]
      }
    },
    id: "update-toc-modification",
    name: "Update TOC Modification",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [31300, 23736], // Position after Parse New TOC
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
};

// 2. Connect Parse New TOC -> Update TOC Modification
if (!data.connections["Parse New TOC"]) {
    data.connections["Parse New TOC"] = {
        main: [[{ node: "Update TOC Modification", type: "main", index: 0 }]]
    };
} else {
    // If it was connected to something else (like the old Update Supabase TOC), replace it
    data.connections["Parse New TOC"].main = [[{ node: "Update TOC Modification", type: "main", index: 0 }]];
}

// 3. Connect Update TOC Modification -> Response (if needed) or End
// We can connect it to a Response node to confirm completion
const responseModifyNode = {
    parameters: {
        respondWith: "json",
        responseBody: "={{ { message: 'Plan updated successfully', new_toc: $('Parse New TOC').first().json.new_toc } }}",
        options: {}
    },
    id: "response-modify-plan",
    name: "Response Modify Plan",
    type: "n8n-nodes-base.respondToWebhook",
    typeVersion: 1,
    position: [31550, 23736]
};

if (!data.connections["Update TOC Modification"]) {
     data.connections["Update TOC Modification"] = {
        main: [[{ node: "Response Modify Plan", type: "main", index: 0 }]]
    };
}


// Apply updates
const nodesToUpdate = [updateTocModificationNode, responseModifyNode];

nodesToUpdate.forEach(newNode => {
    const nodeIndex = data.nodes.findIndex(n => n.name === newNode.name);
    if (nodeIndex !== -1) {
        data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...newNode };
        console.log(`Updated node: ${newNode.name}`);
    } else {
        console.log(`Added node: ${newNode.name}`);
        data.nodes.push(newNode);
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Workflow updated: Separated Modification Update Logic.');
