
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const node = data.nodes.find(n => n.name === 'Parse Webhook');
if (node) {
    fs.writeFileSync('scripts/parse_webhook_code.txt', node.parameters.jsCode);
    console.log("Code saved to scripts/parse_webhook_code.txt");
} else {
    console.log("Node not found");
}
