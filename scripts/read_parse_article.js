
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const parseArticleNode = data.nodes.find(n => n.name === 'Parse Article Data');
if (parseArticleNode) {
    console.log("=== Parse Article Data Code ===");
    console.log(parseArticleNode.parameters.jsCode);
} else {
    console.log("Parse Article Data node not found.");
}
