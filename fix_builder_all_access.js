const fs = require('fs');

let code = fs.readFileSync('app/builder/page.jsx', 'utf8');
code = code.replace("fetch('/api/hack/meet-me')", "fetch('/api/hack/all-access')");
code = code.replace("Activar Pase Libre (Prueba)", "Activar All Access Free Pass (Desbloqueo Total)");
code = code.replace("Activar Pase Libre", "Activar All Access Free Pass");
fs.writeFileSync('app/builder/page.jsx', code);
console.log('Fixed Builder Page');
