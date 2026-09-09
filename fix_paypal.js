const fs = require('fs');

let pageCode = fs.readFileSync('app/page.jsx', 'utf8');

const paypalBtn = `
                <a href="https://www.paypal.com/ncp/payment/ZU527K9TX56YL" target="_blank" rel="noopener noreferrer" className="w-full mt-3 py-3 flex items-center justify-center gap-2 rounded-xl bg-[#003087] text-white font-bold hover:bg-[#001C64] transition-colors shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                  Pagar con PayPal
                </a>`;

pageCode = pageCode.replace(/(<button onClick=\{\(\) => handleCheckout\('.*?'\)\}[\s\S]*?<\/button>)/g, `$1${paypalBtn}`);

fs.writeFileSync('app/page.jsx', pageCode);
console.log('PayPal Added');
