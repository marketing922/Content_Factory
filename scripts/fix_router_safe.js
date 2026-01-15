
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Update Router Expression to be safe
const safeExpression = "={{ $('Parse Modify Request') && $('Parse Modify Request').first() && $('Parse Modify Request').first().json && $('Parse Modify Request').first().json.is_modification ? true : false }}";

// ACTUALLY, n8n expressions try to evaluate fully. If a node didn't run, referencing it throws.
// The best way in n8n is often checking $json flags passed down, OR using a Merge node before if we want unified context.
// BUT, simpler: Use the Run Index or check if node exists in context.
// The n8n error message suggests: {{ $if( $("nodeName").isExecuted, ... ) }}
// Let's use that pattern.

const betterExpression = "={{ $if($('Parse Modify Request').isExecuted, $('Parse Modify Request').first().json.is_modification, false) }}";

const routerNode = {
    parameters: {
        conditions: {
            boolean: [
                {
                    value1: betterExpression,
                    value2: true
                }
            ]
        }
    },
    id: "check-if-modification",
    name: "Check If Modification",
    type: "n8n-nodes-base.if",
    typeVersion: 1
};

const nodeIndex = data.nodes.findIndex(n => n.name === "Check If Modification");
if (nodeIndex !== -1) {
    // Preserve position
    routerNode.position = data.nodes[nodeIndex].position;
    data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...routerNode };
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed Router Logic: Added Safe Expression Check.');
