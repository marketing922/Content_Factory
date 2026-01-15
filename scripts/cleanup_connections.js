
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// We want to ensure "Update Supabase TOC" is ONLY triggered by "Check If Modification" (Index 1 - False path)
const targetNode = "Update Supabase TOC";
const allowedSource = "Check If Modification";

let changed = false;

for (const [sourceName, outputData] of Object.entries(data.connections)) {
    if (sourceName !== allowedSource && outputData.main) {
        outputData.main.forEach((subOut, outputIdx) => {
            const newSubOut = subOut.filter(conn => conn.node !== targetNode);
            if (newSubOut.length !== subOut.length) {
                console.log(`Removing connection from '${sourceName}' to '${targetNode}'`);
                outputData.main[outputIdx] = newSubOut;
                changed = true;
            }
        });
    }
}

if (changed) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    console.log("Removed unwanted connections to Update Supabase TOC.");
} else {
    console.log("No unwanted connections found.");
}
