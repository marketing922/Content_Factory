
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Optimized "Parse New TOC"
const parseNewTocNode = {
    parameters: {
      jsCode: `const input = $input.item.json;
const output = input.output || (typeof input === 'string' ? input : JSON.stringify(input));

let newToc = null;

try {
  let cleanJson = output.trim();
  
  // Remove markdown wrappers if present
  if (cleanJson.startsWith('\`\`\`')) {
    cleanJson = cleanJson.replace(/^\`\`\`(?:json)?\\n?/, '').replace(/\\n?\`\`\`$/, '').trim();
  }

  // Fast extraction without regex (prevent timeout)
  const startIdx = cleanJson.indexOf('{');
  const endIdx = cleanJson.lastIndexOf('}');
  
  if (startIdx !== -1 && endIdx !== -1) {
    cleanJson = cleanJson.substring(startIdx, endIdx + 1);
    newToc = JSON.parse(cleanJson);
  } else {
    // Fallback try parse whole string
    newToc = JSON.parse(cleanJson);
  }
} catch (e) {
  console.error("Parse New TOC Error:", e);
}

return [{
  json: {
    article_id: $('Parse Modify Plan').item.json.article_id,
    new_toc: newToc
  }
}];`
    },
    name: "Parse New TOC", // Ensure this name matches exactly
    type: "n8n-nodes-base.code",
    typeVersion: 2
};

// 2. Optimized "Parse New Content"
const parseNewContentNode = {
    parameters: {
      jsCode: `const input = $input.item.json;
let newContent = input.output || (typeof input === 'string' ? input : JSON.stringify(input));

// Optional: Clean up markdown block wrappers if AI wrapped the entire content
// e.g. \`\`\`html ... \`\`\`
if (typeof newContent === 'string') {
    const trimmed = newContent.trim();
    if (trimmed.startsWith('\`\`\`') && trimmed.endsWith('\`\`\`')) {
         // Simple replacement for outer blocks
         newContent = trimmed.replace(/^^\`\`\`[a-z]*\\n?/, '').replace(/\\n?\`\`\`$/, '');
    }
}

return [{
  json: {
    article_id: $('Parse Modify Article').item.json.article_id,
    new_content: newContent
  }
}];`
    },
    name: "Parse New Content",
    type: "n8n-nodes-base.code",
    typeVersion: 2
};

// Apply updates
const nodesToUpdate = [parseNewTocNode, parseNewContentNode];

nodesToUpdate.forEach(newNode => {
    const nodeIndex = data.nodes.findIndex(n => n.name === newNode.name);
    if (nodeIndex !== -1) {
        // Merge parameters but keep other positional data/id if not provided
        data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...newNode };
        console.log(`Updated node processing logic: ${newNode.name}`);
    } else {
        console.log(`Node not found: ${newNode.name} (Skipping creation, only updating)`);
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed n8n timeout issues in parsing nodes.');
