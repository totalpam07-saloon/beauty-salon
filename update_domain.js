const fs = require('fs');
const path = require('path');

const filesToUpdateLocalhost = [
  "src/app/(main)/login/page.tsx",
  "src/app/(main)/page.tsx",
  "src/app/(main)/signup/page.tsx",
  "src/app/[domain]/admin/layout.tsx",
  "src/app/auth/callback/route.ts",
  "src/proxy.ts"
];

for (const file of filesToUpdateLocalhost) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/process\.env\.NEXT_PUBLIC_ROOT_DOMAIN \|\| "localhost:3000"/g, 'process.env.NEXT_PUBLIC_ROOT_DOMAIN || "crochetri.store"');
  fs.writeFileSync(filePath, content);
}

const filesToUpdateCookies = [
  "src/lib/supabase/client.ts",
  "src/lib/supabase/middleware.ts",
  "src/lib/supabase/server.ts"
];

for (const file of filesToUpdateCookies) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/domain: `\.\$\{process\.env\.NEXT_PUBLIC_ROOT_DOMAIN\}`/g, 'domain: `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || "crochetri.store"}`');
  fs.writeFileSync(filePath, content);
}

console.log("Replaced successfully!");
