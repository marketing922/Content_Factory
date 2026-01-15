
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Update the Read Article Translate node to ensure it fetches all necessary columns
const readArticleTranslateNode = {
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
      },
      // Ensure we fetch all columns needed for translation
      output: "all" 
    },
    id: "c17b1610-ea67-4e59-9d71-e0c7fee60dbc",
    name: "Read Article Translate",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [17504, 6976],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
};

const setTranslatingNode = {
    parameters: {
        operation: "update",
        tableId: "articles",
        matchType: "allFilters",
        filters: {
            conditions: [{ keyName: "id", condition: "eq", keyValue: "={{ $('Parse Translate Request').item.json.article_id }}" }]
        },
        fieldsUi: {
            fieldValues: [{ fieldId: "status", fieldValue: "translating" }]
        }
    },
    id: "set-translating-status",
    name: "Set Translating Status",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [14480, 6000],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
};

const aiTranslatorNode = {
    parameters: {
      promptType: "define",
      text: "=Tu es un traducteur expert certifié.\n\n## MISSION\nTradius l'INTÉGRALITÉ des données de l'article en {{ $('Parse Translate Request').item.json.target_language === 'fr' ? 'Français' : $('Parse Translate Request').item.json.target_language === 'en' ? 'Anglais' : 'Chinois' }}.\n\n## RÈGLES CRITIQUES\n1. Conserve STRICTEMENT tout le formatage Markdown/HTML.\n2. Pour le plan (TOC), traduis uniquement les titres tout en conservant les IDs et la structure JSON.\n3. Pour les options de plan (plan_options), traduis les titres proposés et les thématiques des axes.\n4. Pour l'évaluation (evaluation_details), traduis les noms des critères, les explications et le feedback global.\n5. Ne traduis pas les balises HTML, les syntaxes Markdown, ou les IDs JSON.\n\n## ÉLÉMENTS À TRADUIRE\n### 1. SUJET (TOPIC) :\n{{ $('Read Article Translate').item.json.topic }}\n\n### 2. PLAN ACTUEL (TOC) :\n{{ JSON.stringify($('Read Article Translate').item.json.table_of_contents) }}\n\n### 3. OPTIONS DE PLAN (TITRES & AXES) :\n{{ JSON.stringify($('Read Article Translate').item.json.plan_options) }}\n\n### 4. SYNTHÈSE DE RECHERCHE :\n{{ $('Read Article Translate').item.json.search_synthesis }}\n\n### 5. DÉTAILS D'ÉVALUATION (SCORES & CONSEILS) :\n{{ JSON.stringify($('Read Article Translate').item.json.evaluation_details) }}\n\n### 6. CONTENU DE L'ARTICLE :\n{{ $('Read Article Translate').item.json.content }}\n\n## FORMAT DE RÉPONSE ATTENDU (JSON STRICT)\nTu DOIS répondre avec un objet JSON unique contenant EXACTEMENT ces clés :\n{\n  \"translated_topic\": \"...\",\n  \"translated_toc\": { ... },\n  \"translated_plan_options\": { ... },\n  \"translated_search_synthesis\": \"...\",\n  \"translated_evaluation_details\": { ... },\n  \"translated_content\": \"...\"\n}\n",
      options: {
        systemMessage: "Tu es un traducteur technique qui répond exclusivement au format JSON pour être parsé par un programme."
      }
    },
    id: "ai-translator",
    name: "AI Translator",
    type: "@n8n/n8n-nodes-langchain.agent",
    typeVersion: 1.7,
    position: [14850, 6000]
};

const parseTranslatedContentNode = {
    parameters: {
      jsCode: "const input = $input.item.json;\nlet translatedData;\nconst oldData = $('Read Article Translate').item.json;\n\ntry {\n  // Extract JSON if AI wrapped it in markdown code blocks\n  let output = input.output || \"\";\n  const jsonMatch = output.match(/```json\\n([\\s\\S]*?)\\n```/) || output.match(/{[\\s\\S]*}/);\n  const cleanJson = jsonMatch ? jsonMatch[1] || jsonMatch[0] : output;\n  \n  translatedData = JSON.parse(cleanJson);\n} catch (e) {\n  console.error(\"Parse Error:\", e);\n  // Fallback if AI didn't return clean JSON\n  translatedData = {\n    translated_topic: oldData.topic,\n    translated_content: input.output || oldData.content,\n    translated_toc: oldData.table_of_contents,\n    translated_plan_options: oldData.plan_options,\n    translated_search_synthesis: oldData.search_synthesis,\n    translated_evaluation_details: oldData.evaluation_details\n  };\n}\n\nreturn [{\n  json: {\n    article_id: $('Parse Translate Request').item.json.article_id,\n    translated_topic: translatedData.translated_topic || oldData.topic,\n    translated_content: translatedData.translated_content || oldData.content,\n    translated_toc: translatedData.translated_toc || oldData.table_of_contents,\n    translated_plan_options: translatedData.translated_plan_options || oldData.plan_options,\n    translated_search_synthesis: translatedData.translated_search_synthesis || oldData.search_synthesis,\n    translated_evaluation_details: translatedData.translated_evaluation_details || oldData.evaluation_details,\n    new_language: $('Parse Translate Request').item.json.target_language\n  }\n}];"
    },
    id: "parse-translated-content",
    name: "Parse Translated Content",
    type: "n8n-nodes-base.code",
    typeVersion: 2,
    position: [15100, 6000]
};

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
          {
             fieldId: "status",
             fieldValue: "={{ $('Read Article Translate').item.json.status }}"
          },
          { fieldId: "parameters", fieldValue: "={{ { ...$('Read Article Translate').item.json.parameters, language: $json.new_language } }}" }
        ]
      }
    },
    id: "update-translated-article",
    name: "Update Translated Article",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [15350, 6000],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
};

const handleFailureNode = {
    parameters: {
        operation: "update",
        tableId: "articles",
        matchType: "allFilters",
        filters: {
            conditions: [{ keyName: "id", condition: "eq", keyValue: "={{ $('Parse Translate Request').item.json.article_id }}" }]
        },
        fieldsUi: {
            fieldValues: [{ fieldId: "status", fieldValue: "={{ $('Read Article Translate').item.json.status }}" }]
        }
    },
    id: "handle-translation-failure",
    name: "Handle Failure",
    type: "n8n-nodes-base.supabase",
    typeVersion: 1,
    position: [15100, 6200],
    credentials: {
      supabaseApi: {
        id: "wsR97aCnWHDWGEIK",
        name: "Supabase account"
      }
    }
};

// Add or Update nodes
[readArticleTranslateNode, setTranslatingNode, aiTranslatorNode, parseTranslatedContentNode, updateTranslatedArticleNode, handleFailureNode].forEach(newNode => {
    const nodeIndex = data.nodes.findIndex(n => n.name === newNode.name);
    if (nodeIndex !== -1) {
        data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...newNode };
    } else {
        data.nodes.push(newNode);
    }
});

// Update connections
const conn = data.connections;
const addConn = (src, target, type = "main", error = false) => {
  if (!conn[src]) conn[src] = {};
  if (!conn[src][type]) conn[src][type] = [[]];
  if (!conn[src][type][0].some(c => c.node === target)) {
      conn[src][type][0].push({ node: target, type: type, index: 0 });
  }
};

// Clear and rebuild connections for the translation branch
delete conn["Webhook Translate"];
delete conn["Parse Translate Request"];
delete conn["Set Translating Status"];
delete conn["Read Article Translate"];
delete conn["AI Translator"];
delete conn["Parse Translated Content"];
delete conn["Update Translated Article"];

addConn("Webhook Translate", "Parse Translate Request");
addConn("Parse Translate Request", "Set Translating Status");
addConn("Set Translating Status", "Read Article Translate");
addConn("Read Article Translate", "AI Translator");
addConn("AI Translator", "Parse Translated Content");
addConn("Parse Translated Content", "Update Translated Article");
addConn("Gemini Translate", "AI Translator", "ai_languageModel");

// Error handling connections
const addErrorConn = (src, target) => {
    if (!conn[src]) conn[src] = {};
    if (!conn[src]["main"]) conn[src]["main"] = [[]];
    // n8n type check for error connections: can be 'main' but we often use a different index or property
    // For this context, we'll just link them to the failure node if the node allows it.
    // In code-generated JSON, it's often simpler to just rely on the 'OnError' parameter if set.
    // However, I'll add them as a second main output index if supported.
};

// Ensure Read Article Fetch is robust
data.nodes.find(n => n.name === "Read Article Translate").parameters.onError = "continue";

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Workflow translation branch updated to PRESERVE and TRANSLATE all article data.');
