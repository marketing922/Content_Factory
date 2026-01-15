
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Restore Original "Parse New TOC" connections (Creation Flow)
// Remove the Router connection and connect directly to "Update Supabase TOC"
// Note: We'll remove the router node entirely later.
data.connections["Parse New TOC"] = {
    main: [[{ node: "Update Supabase TOC", type: "main", index: 0 }]]
};

// 2. Clone "AI Agent Planificateur" for Modification
const originalAgent = data.nodes.find(n => n.name === "AI Agent Planificateur");
const modAgent = JSON.parse(JSON.stringify(originalAgent));
modAgent.id = "ai-agent-planificateur-modif";
modAgent.name = "AI Agent Planificateur Modif";
modAgent.position = [31900, 23736]; // Shift position

// Ensure Prompt has modification logic
// (It likely has it from previous edits, but we want to ensure only this one has it potentially? 
// Actually, keeping mod logic in both is fine, but strictly this one is for mod).
// Let's explicitly check the prompt.
if (!modAgent.parameters.text.includes("DEMANDE DE MODIFICATION")) {
    modAgent.parameters.text = `## DEMANDE DE MODIFICATION (PRIORITAIRE)
{{ $json.is_modification ? "L'utilisateur demande une modification sur le plan existant :" : "" }}
{{ $json.modification_request ? ">>> " + $json.modification_request : "" }}
{{ $json.attached_file ? ">>> FICHIER JOINT (" + $json.attached_file.name + ") :\\n" + $json.attached_file.content : "" }}

` + modAgent.parameters.text;
}

// 3. Clone "Parse New TOC" for Modification
const originalParse = data.nodes.find(n => n.name === "Parse New TOC");
const modParse = JSON.parse(JSON.stringify(originalParse));
modParse.id = "parse-new-toc-modif";
modParse.name = "Parse New TOC Modif";
modParse.position = [32200, 23736];

// Update JS Code to look at correct Article ID source for modification (Parse Modify Plan is the root context usually)
// Wait, "Parse New TOC" code used `$('Parse Modify Plan').first().json.article_id`.
// In CREATION flow, that was wrong! Creation flow relies on "Parse Research Output" or "Parse Webhook".
// START BIG FIX:
// "Parse New TOC" (Original/Creation) should reference `$('Parse Webhook').first().json.article_id` or similar.
// "Parse New TOC Modif" should reference `$('Parse Modify Plan').first().json.article_id`.

// Fix Original Parse New TOC (Creation)
// Check what "Update Supabase TOC" uses... it uses `$('Parse Webhook').item.json.article_id` (via filter).
// So the Parse node doesn't strictly need to output article_id if the Update node gets it elsewhere,
// but it's good practice. Use `$('Parse Webhook')` for creation.
originalParse.parameters.jsCode = originalParse.parameters.jsCode.replace(
    /Parse Modify Plan/g, 
    "Parse Webhook"
);

// Fix New Parse New TOC Modif (Modification)
// Use the ID from the Modify flow
modParse.parameters.jsCode = modParse.parameters.jsCode.replace(
    /Parse Webhook/g, 
    "Parse Modify Plan" // Likely already set to this, but ensure consistency
);
// Ensure it really uses Parse Modify Plan
if (!modParse.parameters.jsCode.includes("Parse Modify Plan")) {
     // If regex replace failed or it was using something else
     // We can just hardcode the lookup line.
     const lookupLine = "const articleId = $('Parse Modify Plan').first().json.article_id;";
     modParse.parameters.jsCode = modParse.parameters.jsCode.replace(
        /const articleId = .*;/g, 
        lookupLine
     );
}


// 4. Update Connections for Modification Flow

// Read Article Mod -> AI Agent Planificateur Modif
// Remove old connection
if (data.connections["Read Article Mod"]) {
    data.connections["Read Article Mod"].main = [[{ node: "AI Agent Planificateur Modif", type: "main", index: 0 }]];
}

// AI Agent Planificateur Modif -> Parse New TOC Modif
data.connections[modAgent.name] = {
    main: [[{ node: "Parse New TOC Modif", type: "main", index: 0 }]]
};

// Parse New TOC Modif -> Update TOC Modification
data.connections[modParse.name] = {
    main: [[{ node: "Update TOC Modification", type: "main", index: 0 }]]
};

// 5. Update Connections for Creation Flow
// "AI Agent Planificateur" -> "Parse New TOC" (Ensure this exists)
data.connections["AI Agent Planificateur"] = {
    main: [[{ node: "Parse New TOC", type: "main", index: 0 }]]
};

// 6. Delete "Check If Modification" Router
const routerIndex = data.nodes.findIndex(n => n.name === "Check If Modification");
if (routerIndex !== -1) {
    data.nodes.splice(routerIndex, 1);
    delete data.connections["Check If Modification"];
}

// Add new nodes
data.nodes.push(modAgent);
data.nodes.push(modParse);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Decoupled Workflows: Duplicated Planner and Parse nodes for Modification.');
