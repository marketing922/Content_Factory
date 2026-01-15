
const fs = require('fs');
const path = 'Content Factory - AI Agents.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Optimized "Parse New TOC" with FAST ID Lookup
const parseNewTocNode = {
    parameters: {
      jsCode: `const input = $input.item.json;
const output = input.output || (typeof input === 'string' ? input : JSON.stringify(input));

let newToc = null;

try {
  let cleanJson = output.trim();
  
  if (cleanJson.startsWith('\`\`\`')) {
    cleanJson = cleanJson.replace(/^\`\`\`(?:json)?\\n?/, '').replace(/\\n?\`\`\`$/, '').trim();
  }

  const startIdx = cleanJson.indexOf('{');
  const endIdx = cleanJson.lastIndexOf('}');
  
  if (startIdx !== -1 && endIdx !== -1) {
    newToc = JSON.parse(cleanJson.substring(startIdx, endIdx + 1));
  } else {
    newToc = JSON.parse(cleanJson);
  }
} catch (e) {
  console.error("Parse Error:", e);
}

// OPTIMIZATION: Use .first() instead of .item to avoid expensive history traversal
const articleId = $('Parse Modify Plan').first().json.article_id;

return [{
  json: {
    article_id: articleId,
    new_toc: newToc
  }
}];`
    },
    name: "Parse New TOC",
    type: "n8n-nodes-base.code",
    typeVersion: 2
};

// 2. Optimized "Parse New Content" with FAST ID Lookup
const parseNewContentNode = {
    parameters: {
      jsCode: `const input = $input.item.json;
let newContent = input.output || (typeof input === 'string' ? input : JSON.stringify(input));

if (typeof newContent === 'string') {
    const trimmed = newContent.trim();
    if (trimmed.startsWith('\`\`\`') && trimmed.endsWith('\`\`\`')) {
         newContent = trimmed.replace(/^^\`\`\`[a-z]*\\n?/, '').replace(/\\n?\`\`\`$/, '');
    }
}

// OPTIMIZATION: Use .first() instead of .item to avoid expensive history traversal
const articleId = $('Parse Modify Article').first().json.article_id;

return [{
  json: {
    article_id: articleId,
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
        data.nodes[nodeIndex] = { ...data.nodes[nodeIndex], ...newNode };
        console.log(`Updated node strategy: ${newNode.name}`);
    } else {
        console.log(`Node not found: ${newNode.name}`);
    }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Fixed n8n ID lookup performance.');
