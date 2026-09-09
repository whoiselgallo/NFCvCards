const fs = require('fs');

// 1. Update API route
let apiCode = fs.readFileSync('app/api/checkout/route.js', 'utf8');
apiCode = apiCode.replace(/currency: 'mxn'/g, "currency: 'usd'");
apiCode = apiCode.replace(/unit_amount: 5900/g, "unit_amount: 4900");
apiCode = apiCode.replace(/unit_amount: 129900/g, "unit_amount: 59900");
fs.writeFileSync('app/api/checkout/route.js', apiCode);
console.log('API Updated');

// 2. Update Landing Page
let pageCode = fs.readFileSync('app/page.jsx', 'utf8');

// Add " USD" to the big prices
pageCode = pageCode.replace(/<span className="text-4xl font-extrabold text-white">\$49<\/span>/g, '<span className="text-4xl font-extrabold text-white">$49</span><span className="text-slate-400 ml-1 text-sm">USD</span>');
pageCode = pageCode.replace(/<span className="text-4xl font-extrabold text-white">\$199<\/span>/g, '<span className="text-4xl font-extrabold text-white">$199</span><span className="text-slate-400 ml-1 text-sm">USD</span>');
pageCode = pageCode.replace(/<span className="text-4xl font-extrabold text-white">\$249<\/span>/g, '<span className="text-4xl font-extrabold text-white">$249</span><span className="text-slate-400 ml-1 text-sm">USD</span>');
pageCode = pageCode.replace(/<span className="text-4xl font-extrabold text-white">\$599<\/span>/g, '<span className="text-4xl font-extrabold text-white">$599</span><span className="text-slate-400 ml-1 text-sm">USD</span>');
pageCode = pageCode.replace(/<span className="text-4xl font-extrabold text-white">\$1,499<\/span>/g, '<span className="text-4xl font-extrabold text-white">$1,499</span><span className="text-slate-400 ml-1 text-sm">USD</span>');

// Add PayPal Button to the cards
// They provided one specific link: https://www.paypal.com/ncp/payment/ZU527K9TX56YL
// We will add it below the Stripe button.

const paypalBtn = `
                <a href="https://www.paypal.com/ncp/payment/ZU527K9TX56YL" target="_blank" rel="noopener noreferrer" className="w-full mt-3 py-3 flex items-center justify-center gap-2 rounded-xl bg-[#003087] text-white font-bold hover:bg-[#001C64] transition-colors shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                  Pagar con PayPal
                </a>
`;

// Replace closing </button> with </button> + paypalBtn for all buttons that call handleCheckout
pageCode = pageCode.replace(/(<button onClick=\{\(\) => handleCheckout\('.*?'\)\}.*?<\/button>)/g, `$1\n${paypalBtn}`);

fs.writeFileSync('app/page.jsx', pageCode);
console.log('Page Updated');
