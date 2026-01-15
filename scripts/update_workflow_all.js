
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Update "Set Translating Status" to update translation_status instead of status
const setTranslatingStatusNode = {
    parameters: {
      operation: "update",
      tableId: "articles",
      matchType: "allFilters",
      filters: {
        conditions: [
            { keyName: "id", condition: "eq", keyValue: "={{ $('Parse Translate Request').item.json.article_id }}" }
        ]
      },
      fieldsUi: {
        fieldValues: [
          {
            fieldId: "translation_status",
            fieldValue: "translating"
          }
        ]
      }
    },
    name: "Set Translating Status",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [14480, 6000]
};

// 2. Update "Update Translated Article" to reset translation_status and NOT touch status
const updateTranslatedArticleNode = {
    parameters: {
      operation: "update",
      tableId: "articles",
      matchType: "allFilters",
      filters: {
        conditions: [
            { keyName: "id", condition: "eq", keyValue: "={{ $('Parse Translate Request').item.json.article_id }}" }
        ]
      },
      fieldsUi: {
        fieldValues: [
          { fieldId: "topic", fieldValue: "={{ $json.translated_topic }}" },
          { fieldId: "content", fieldValue: "={{ $json.translated_content }}" },
          { fieldId: "table_of_contents", fieldValue: "={{ $json.translated_toc }}" },
          { fieldId: "plan_options", fieldValue: "={{ $json.translated_plan_options }}" },
          { fieldId: "search_synthesis", fieldValue: "={{ $json.translated_search_synthesis }}" },
          { fieldId: "evaluation_details", fieldValue: "={{ $json.translated_evaluation_details }}" },
          { fieldId: "score", fieldValue: "={{ $('Read Article Translate').item.json.score }}" },
          { fieldId: "drive_link", fieldValue: "={{ $('Read Article Translate').item.json.drive_link }}" },
          // Reset translation status to null or 'completed'
          { fieldId: "translation_status", fieldValue: "completed" }, 
          // DO NOT TOUCH "status" anymore. It stays "published" or whatever it was.
          { fieldId: "parameters", fieldValue: "={{ { ...$('Read Article Translate').item.json.parameters, language: $json.new_language } }}" }
        ]
      }
    },
    name: "Update Translated Article",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [15650, 6000],
    credentials: {
      supabaseApi: { id: "wsR97aCnWHDWGEIK", name: "Supabase account" }
    }
};

// 3. Update "Handle Failure" node to reset translation_status
const handleFailureNode = {
     parameters: {
        operation: "update",
        tableId: "articles",
        matchType: "allFilters",
        filters: {
          conditions: [
             { keyName: "id", condition: "eq", keyValue: "={{ $('Parse Translate Request').item.json.article_id }}" }
          ]
        },
        fieldsUi: {
           fieldValues: [
              {
                 fieldId: "translation_status",
                 fieldValue: "error"
              }
           ]
        }
     },
     id: "handle-translation-failure",
     name: "Handle Failure",
     type: "n8n-nodes-base.supabase",
     typeVersion: 1,
     position: [15100, 6200],
     credentials: {
        supabaseApi: { id: "wsR97aCnWHDWGEIK", name: "Supabase account" }
     }
};

// Apply updates
const nodesToUpdate = [setTranslatingStatusNode, updateTranslatedArticleNode, handleFailureNode];

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
console.log('Workflow refactoring: translation_status implemented.');
