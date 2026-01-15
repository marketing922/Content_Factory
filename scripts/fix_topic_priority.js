
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update "Parse Article Data" to prioritize webhook data
// Logic:
// 1. Get DB data (from direct input, assuming it comes from Read Supabase)
// 2. Get Webhook data (from 'Parse Webhook' node)
// 3. Merge, with Webhook taking precedence for topic, language, etc.

const jsCode = `
const dbData = $input.item.json;
const webhookData = $('Parse Webhook').first().json;

// Prioritize Webhook topic/prompt if it exists and is different from default
// Especially for regeneration where 'topic' is the new prompt.
const finalTopic = webhookData.topic || dbData.topic;
const finalLanguage = webhookData.language || dbData.target_language || 'french';

// Merge parameters if needed, or overwrite
const finalParams = { ...dbData.parameters, ...(webhookData.parameters || {}) };

return {
  json: {
    ...dbData, // Keep ID, created_at, status etc.
    topic: finalTopic, // OVERRIDE
    target_language: finalLanguage, // OVERRIDE
    parameters: finalParams
  }
};
`;

const parseArticleNode = data.nodes.find(n => n.name === 'Parse Article Data');
if (parseArticleNode) {
    parseArticleNode.parameters.jsCode = jsCode;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Updated Parse Article Data to prioritize Webhook topic.');
} else {
    console.error('Node not found');
}
