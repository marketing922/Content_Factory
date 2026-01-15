
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log("=== Auditing Duplicate Nodes ===");

const modAgent = data.nodes.find(n => n.name === "AI Agent Planificateur Modif");
const modParse = data.nodes.find(n => n.name === "Parse New TOC Modif");

if (modAgent) {
    console.log("AI Agent Planificateur Modif found.");
} else {
    console.error("ERROR: AI Agent Planificateur Modif MISSING.");
}

if (modParse) {
    console.log("Parse New TOC Modif found.");
    console.log("JS Code Snippet:");
    console.log(modParse.parameters.jsCode.substring(0, 500)); 
    
    // Check for correct ID reference
    if (modParse.parameters.jsCode.includes("Parse Webhook")) {
        console.error("WARNING: modParse still references 'Parse Webhook' (Creation Flow)!");
    }
    if (modParse.parameters.jsCode.includes("Parse Modify Plan")) {
        console.log("SUCCESS: modParse references 'Parse Modify Plan'.");
    } else {
        console.error("WARNING: modParse does NOT reference 'Parse Modify Plan' explicitly. Check ID lookup logic.");
    }
} else {
    console.error("ERROR: Parse New TOC Modif MISSING.");
}

console.log("=== Checking Connections ===");
const modAgentInput = data.connections[modAgent.name];
const modParseInput = data.connections[modParse.name];

console.log("Agent Modif Output:", JSON.stringify(modAgentInput, null, 2));
console.log("Parse Modif Output:", JSON.stringify(modParseInput, null, 2));

// Check who feeds into Mod Agent
let feedsIntoModAgent = [];
for (const [source, output] of Object.entries(data.connections)) {
    if (output.main) {
        output.main.forEach(grp => grp.forEach(conn => {
            if (conn.node === modAgent.name) feedsIntoModAgent.push(source);
        }));
    }
}
console.log("Feeds into Agent Modif:", feedsIntoModAgent);
