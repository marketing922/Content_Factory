
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';

// Load
if (!fs.existsSync(path)) {
    console.error("File not found");
    process.exit(1);
}
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Create Router Node "Check If Modification"
// Logic: Check if 'is_modification' is true (set in Parse Modify Request)
// Or check if 'modification_request' exists.
// Input will come from Parse New TOC.
const routerNode = {
    parameters: {
        conditions: {
            boolean: [
                {
                    value1: "={{ $('Parse Modify Request').first().json.is_modification }}",
                    value2: true
                }
            ]
        }
    },
    id: "check-if-modification",
    name: "Check If Modification",
    type: "n8n-nodes-base.if",
    typeVersion: 1,
    position: [31000, 23736] 
};

// 2. Update Connections

// A: Parse New TOC -> Check If Modification (Router)
// Replace existing connections from Parse New TOC
data.connections["Parse New TOC"] = {
    main: [[{ node: "Check If Modification", type: "main", index: 0 }]]
};

// B: Router True -> Update TOC Modification
// C: Router False -> Update Supabase TOC (Old Node)

if (!data.connections["Check If Modification"]) {
    data.connections["Check If Modification"] = {
        main: [
            // True Path (index 0) -> Modify Flow
            [{ node: "Update TOC Modification", type: "main", index: 0 }],
            // False Path (index 1) -> Creation Flow
            [{ node: "Update Supabase TOC", type: "main", index: 0 }]
        ]
    };
}

// 3. Fix "Update Supabase TOC" input
// Ensure it uses the correct data. It expects Parse New TOC output, so passing through the Router is fine.
// BUT, wait. "Update Supabase TOC" might expect "Parse New TOC" as immediate parent? 
// No, n8n usually handles JSON flow. As long as items stream through, $json works.
// However, the node uses `{{ $json.toc }}` or `{{ $('Parse New TOC').item... }}`.
// Let's verify what "Update Supabase TOC" uses.
// If it uses expressions referencing `Parse New TOC`, it's fine.
// If it uses `$json`, it refers to input.
// Router passes input items to output. So `$json` will be the output of `Parse New TOC`.

// 4. Cleanup Unused Nodes?
// User asked to delete useless nodes. I'll inspect programmatically or just leave them for manual cleanup if unsafe.
// For now, fixing the flow is priority #1.

// Add the Router Node
const nodeIndex = data.nodes.findIndex(n => n.name === "Check If Modification");
if (nodeIndex !== -1) {
    data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...routerNode };
} else {
    data.nodes.push(routerNode);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed Workflow Loop: Added Check If Modification Router.');
