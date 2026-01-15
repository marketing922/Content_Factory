
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

console.log("Checking inputs to 'Update Supabase TOC'...");

let sources = [];
for (const [sourceName, outputData] of Object.entries(data.connections)) {
    if (outputData.main) {
        outputData.main.forEach((subOut, idx) => {
             subOut.forEach(conn => {
                 if (conn.node === "Update Supabase TOC") {
                     sources.push({ source: sourceName, outputIndex: idx });
                 }
             });
        });
    }
}

console.log("Sources triggering 'Update Supabase TOC':", JSON.stringify(sources, null, 2));

console.log("Checking 'Check If Modification' connections...");
console.log(JSON.stringify(data.connections["Check If Modification"], null, 2));
