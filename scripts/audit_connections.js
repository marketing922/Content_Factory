
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log("Analyzing connections interactions...");

// Check Parse New TOC connections
const parseTocNode = data.nodes.find(n => n.name === "Parse New TOC");
if (parseTocNode) {
    const outputs = data.connections["Parse New TOC"]?.main || [];
    console.log(`"Parse New TOC" outputs to:`, JSON.stringify(outputs, null, 2));
}

// Check what connects TO Parse New TOC
// We have to iterate all connections
let inputsToParseToc = [];
for (const [sourceName, outputData] of Object.entries(data.connections)) {
    if (outputData.main) {
        outputData.main.forEach(subOut => {
            subOut.forEach(conn => {
                if (conn.node === "Parse New TOC") {
                    inputsToParseToc.push(sourceName);
                }
            });
        });
    }
}
console.log(`"Parse New TOC" receives input from:`, inputsToParseToc);

// Check AI Agent Planificateur
const plannerNode = data.nodes.find(n => n.name === "AI Agent Planificateur");
let inputsToPlanner = [];
for (const [sourceName, outputData] of Object.entries(data.connections)) {
    if (outputData.main) {
        outputData.main.forEach(subOut => {
            subOut.forEach(conn => {
                if (conn.node === "AI Agent Planificateur") {
                    inputsToPlanner.push(sourceName);
                }
            });
        });
    }
}
console.log(`"AI Agent Planificateur" receives input from:`, inputsToPlanner);
