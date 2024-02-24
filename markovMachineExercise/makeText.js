const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { MarkovMachine } = require('./markov');

const args  = process.argv.slice(2);
const fileTypeFlag = args[0];
const fileName = args[1];

let filePath;

if (fileTypeFlag === 'file') {
    filePath = path.join(__dirname, fileName);
} else if (fileTypeFlag === 'url') {
    filePath = fileName;
} else {
    console.error('Invalid file type flag. Please use "file" or "url"');
    process.exit(1);
}



async function cat(filePath){
    try {
        let data = await fs.readFile(filePath, 'utf8');
        let mm = new MarkovMachine(data);
        let text = mm.makeText();
        console.log(text);
    }
    catch (err) {
        console.error(`Error reading the ${filePath} file`, err);
        process.exit(1);
    }
}

async function catWrite(filePath, writePath) {
    try {
        let data = await fs.readFile(filePath, 'utf8');
        let mm = new MarkovMachine(data);
        let text = mm.makeText();
        await fs.writeFile(writePath, text, 'utf8');
    }
    catch (err) {
        console.error(`Error reading the ${filePath} file`, err);
        process.exit(1);
    }
}

async function webCat(url){
    try {
        let response = await axios.get(url);
        let mm = new MarkovMachine(response.data);
        let text = mm.makeText();
        console.log(text);
    }
    catch (error) {
        console.error(`Error fetching ${url}`, error);
        process.exit(1);
    }
}

async function main(){
    console.log('fileTypeFlag:', fileTypeFlag, 'fileName:', fileName, 'filePath:', filePath);
    if(fileTypeFlag === 'file'){
        await cat(filePath);
    } else {
        await webCat(filePath);
    }
}

main().catch(error => console.error('An unexpected error occurred:', error));