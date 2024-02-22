const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

async function cat(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        console.log(data);
    } catch (err) {
        console.error(`Error reading the ${filePath} file`, err);
        process.exit(1);
    }
}

async function webCat(url) {
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error(`Error fetching ${url}`, error);
        process.exit(1);
    }
}

async function webCatWrite(url, writePath) {
    try {
        const response = await axios.get(url);
        await fs.writeFile(writePath, response.data, 'utf8');
        console.log('Wrote to file:', writePath);
    } catch (error) {
        console.error(`Error fetching ${url} or writing to ${writePath}`, error);
        process.exit(1);
    }
}

async function catWrite(filePath, writePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        await fs.writeFile(writePath, data, 'utf8');
        console.log('Wrote to file:', writePath);
    } catch (err) {
        console.error(`Error reading the ${filePath} file or writing to ${writePath}`, err);
        process.exit(1);
    }
}

async function main() {
    const args = process.argv;
    let flagIndex = args.findIndex(arg => arg === '--out');

    if (flagIndex !== -1) {
        for (let i = flagIndex + 1; i < args.length - 1; i += 2) {
            const writeName = args[i];
            const fileName = args[i + 1];
            const filePath = path.join(__dirname, fileName);
            const writePath = path.join(__dirname, writeName);

            if (fileName.startsWith('http')) {
                await webCatWrite(fileName, writePath);
            } else {
                await catWrite(filePath, writePath);
            }
        }
    } else {
        for (let i = 2; i < args.length; i++) {
            const fileName = args[i];
            const filePath = path.join(__dirname, fileName);

            if (fileName.startsWith('http')) {
                await webCat(fileName);
            } else {
                await cat(filePath);
            }
        }
    }
}

main().catch(error => console.error('An unexpected error occurred:', error));
