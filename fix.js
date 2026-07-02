const fs = require('fs');
let f = fs.readFileSync('src/app/actions.ts', 'utf8');
f = f.replace(/revalidateTag\(, \{\}\);/g, 'revalidateTag(`tenant-${domain}`, {});');
fs.writeFileSync('src/app/actions.ts', f);
