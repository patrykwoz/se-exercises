const fs = require('fs');
const path = require('path');
const axios = require('axios');

const args  = process.argv.slice(2);
const fileName = args[0];
const filePath = path.join(__dirname, fileName);

function cat (filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading the ${fileName} file`,err);
        process.exit(1);
    }
    console.log(data);
});

}

function webCat(url) {
    axios.get(url)
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error(`Error fetching ${url}`,error);
        process.exit(1);
});

}

if (args.toString().slice(0,4) === 'http') {
    webCat(args);
} else {
    cat(filePath);
}