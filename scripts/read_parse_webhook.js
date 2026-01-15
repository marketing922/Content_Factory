
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const node = data.nodes.find(n => n.name === 'Parse Webhook');
if (node) {
    console.log("=== Parse Webhook Code ===");
    console.log(node.parameters.jsCode);
} else {
    console.log("Parse Webhook node not found.");
}
