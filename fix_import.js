const fs = require('fs');

let code = fs.readFileSync('app/api/auth/register/route.js', 'utf8');
code = code.replace("import { getPool } from '../../../lib/db';", "import { getPool } from '../../../../lib/db';");
fs.writeFileSync('app/api/auth/register/route.js', code);
console.log('Fixed import path');
