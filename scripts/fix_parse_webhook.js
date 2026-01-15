
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update "Parse Webhook" code to include topic/prompt
const jsCode = `
const input = $input.item.json;
const body = input.body || input;

console.log('=== DEBUG WEBHOOK ===');
console.log('Input:', JSON.stringify(input, null, 2));

const article_id = body.article_id;

if (!article_id) {
  throw new Error('❌ article_id is REQUIRED. Received: ' + JSON.stringify(input));
}

// Validation UUID
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
if (!uuidRegex.test(article_id)) {
  throw new Error('❌ article_id must be a valid UUID. Got: ' + article_id);
}

// Extract topic/prompt for regeneration
// The frontend sends "topic" as the regeneration instruction
const topic = body.topic || body.prompt;

console.log('✅ Valid article_id:', article_id);
if (topic) console.log('✅ Found topic/prompt override');

return {
  json: {
    article_id: article_id,
    user_id: body.user_id || null,
    topic: topic, // PASS THROUGH THE TOPIC
    language: body.language || body.target_language || 'french',
    parameters: body.parameters || {},
    retry_count: 0,
    timestamp: new Date().toISOString()
  }
};
`;

const parseWebhookNode = data.nodes.find(n => n.name === 'Parse Webhook');
if (parseWebhookNode) {
    parseWebhookNode.parameters.jsCode = jsCode;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log('Updated Parse Webhook to extract and return topic.');
} else {
    console.error('Node Parse Webhook not found');
}
