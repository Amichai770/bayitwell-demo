/* Builds dist/mishmeret-artifact.html: the same page without the document skeleton, for publishing as a claude.ai artifact. */
const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const body = html.split('<!--APP-START-->')[1].split('<!--APP-END-->')[0];
const out = '<title>Mishmeret</title>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Frank+Ruhl+Libre:wght@300;400;500;700&display=swap">\n<link rel="stylesheet" href="styles.css">\n' + body;
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'mishmeret-artifact.html'), out);
console.log('wrote dist/mishmeret-artifact.html', out.length, 'bytes');
