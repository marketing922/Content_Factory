
const fs = require('fs');

console.log("=== Checking Environment Variables logic inside scripts ===");

// We can't see .env.local content directly, but we can check if process.env gets it if we load dotenv
try {
    require('dotenv').config({ path: '.env.local' });
} catch (e) {
    console.log("Could not load dotenv, checking standard env if passed.");
}

const varsToCheck = [
    'N8N_WEBHOOK_START_URL',
    'N8N_WEBHOOK_MODIFY_PLAN_URL'
];

varsToCheck.forEach(key => {
    const value = process.env[key];
    console.log(`${key}: ${value ? 'SET (Length: ' + value.length + ')' : 'MISSING'}`);
    if (value) {
        console.log(`   -> Value starts with: ${value.substring(0, 15)}...`);
        // Check if they are identical
        if (key === 'N8N_WEBHOOK_MODIFY_PLAN_URL') {
            const startUrl = process.env['N8N_WEBHOOK_START_URL'];
            if (value === startUrl) {
                console.error("   !!! CRITICAL WARNING: MODIFY_PLAN_URL is identical to START_URL !!!");
                console.error("   This effectively routes modification requests to the creation logic.");
            }
        }
    }
});
