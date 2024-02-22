const fs = require('fs');
const path = require('path');

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

cat(filePath);
