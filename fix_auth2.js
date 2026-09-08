const fs = require('fs');

// Create lib/nextAuthOptions.js
let routeCode = fs.readFileSync('app/api/auth/[...nextauth]/route.js', 'utf8');
let libAuthCode = routeCode.replace('const handler = NextAuth(authOptions);\r\nexport { handler as GET, handler as POST };', '');
libAuthCode = libAuthCode.replace('const handler = NextAuth(authOptions);\nexport { handler as GET, handler as POST };', '');
libAuthCode = libAuthCode.replace('../../../../lib/db', './db');
fs.writeFileSync('lib/nextAuthOptions.js', libAuthCode);

// Update route.js
fs.writeFileSync('app/api/auth/[...nextauth]/route.js', `import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/nextAuthOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
`);

// Update app/admin/layout.jsx
let adminLayout = fs.readFileSync('app/admin/layout.jsx', 'utf8');
adminLayout = adminLayout.replace('import { authOptions } from "../api/auth/[...nextauth]/route";', 'import { authOptions } from "../../lib/nextAuthOptions";');
adminLayout = adminLayout.replace('import { authOptions } from "../../lib/auth";', 'import { authOptions } from "../../lib/nextAuthOptions";');
fs.writeFileSync('app/admin/layout.jsx', adminLayout);

// Update app/api/export-whitelabel/route.js
let exportRoute = fs.readFileSync('app/api/export-whitelabel/route.js', 'utf8');
exportRoute = exportRoute.replace(/import \{ authOptions \} from '\.\.\/auth\/\[\.\.\.nextauth\]\/route';/g, 'import { authOptions } from "../../../lib/nextAuthOptions";');
exportRoute = exportRoute.replace(/import \{ authOptions \} from "\.\.\/\.\.\/\.\.\/lib\/auth";/g, 'import { authOptions } from "../../../lib/nextAuthOptions";');
fs.writeFileSync('app/api/export-whitelabel/route.js', exportRoute);

// Update app/api/hack/meet-me/route.js
let hackRoute = fs.readFileSync('app/api/hack/meet-me/route.js', 'utf8');
hackRoute = hackRoute.replace(/import \{ authOptions \} from "\.\.\/\.\.\/auth\/\[\.\.\.nextauth\]\/route";/g, 'import { authOptions } from "../../../../lib/nextAuthOptions";');
hackRoute = hackRoute.replace(/import \{ authOptions \} from "\.\.\/\.\.\/\.\.\/\.\.\/lib\/auth";/g, 'import { authOptions } from "../../../../lib/nextAuthOptions";');
fs.writeFileSync('app/api/hack/meet-me/route.js', hackRoute);
