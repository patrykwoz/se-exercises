const fs = require('fs').promises;
const path = require('path');

const filename = 'db.json';

// Append JSON data to a file in a directory
async function appendJSON(data) {
    try {
        const filePath = path.join(__dirname, filename);
        let existingData = [];
        let canParse = false;
        
        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            existingData = JSON.parse(fileContent);
            canParse = true;
        } catch (readErr) {
            if (readErr.code !== 'ENOENT') {
                console.error(`Error reading ${filename}:`, readErr);
            }
        }

        const timestamp = Date.now();
        data = { timestamp, ...data };
        
        if (!canParse) {
            existingData = [data];
        } else {
            existingData.push(data); 
        }
        
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error appending to ${filename}`, err);
        process.exit(1);
    }
}

// Just read from JSON file
async function readJSON() {
    try {
        const filePath = path.join(__dirname, filename);
        const fileContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (err) {
        console.error(`Error reading ${filename}`, err);
        process.exit(1);
    }
}

module.exports = { appendJSON, readJSON };