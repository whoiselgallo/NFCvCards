const fs = require('fs');

let code = fs.readFileSync('app/page.jsx', 'utf8');

// 1. Add Script import if not exists
if (!code.includes("import Script from 'next/script'")) {
  code = code.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport Script from 'next/script';");
}

// 2. Add PayPalButton component definition
const payPalComponent = `
function PayPalButton({ planId }) {
  const [isReady, setIsReady] = React.useState(false);
  const containerId = 'paypal-container-' + planId;

  React.useEffect(() => {
    let interval;
    const renderBtn = () => {
      if (window.paypal && document.getElementById(containerId) && !document.getElementById(containerId).hasChildNodes()) {
        window.paypal.Buttons({
          style: { shape: 'pill', color: 'silver', layout: 'horizontal', label: 'subscribe' },
          createSubscription: function(data, actions) {
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: function(data, actions) {
            alert('¡Suscripción exitosa! Redirigiendo...');
            window.location.href = '/login?payment=success&plan=' + planId;
          }
        }).render('#' + containerId);
      }
    };

    if (window.paypal) {
      renderBtn();
    } else {
      interval = setInterval(() => {
        if (window.paypal) {
          clearInterval(interval);
          renderBtn();
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [planId, containerId]);

  return <div id={containerId} className="w-full mt-3 min-h-[45px] z-20 relative"></div>;
}
`;

if (!code.includes("function PayPalButton")) {
  // Insert before the default export
  code = code.replace("export default function LandingPage() {", payPalComponent + "\nexport default function LandingPage() {");
}

// 3. Add Script tag inside the render
if (!code.includes("src=\"https://www.paypal.com/sdk/js?client-id=")) {
  const scriptTag = `<Script src="https://www.paypal.com/sdk/js?client-id=BAAVBTkbyfhfvSv-LwMOAjKhD4cWmr2himsyOcDfmT_oBblFqSZ5LdvTLDibQfmSi6mSrgCtYcA0YsoMoI&vault=true&intent=subscription" strategy="lazyOnload" />`;
  // Insert right after the opening tag of the main return
  code = code.replace("return (\n    <div", "return (\n    <div\n      " + scriptTag);
}

// 4. Replace the old <a> links with the new components, mapped correctly
const oldPaypalAnchorRegex = /<a href="https:\/\/www\.paypal\.com\/ncp\/payment\/ZU527K9TX56YL"[\s\S]*?<\/a>/g;

let matchCount = 0;
const planIds = [
  'P-2PW08512L5046373DNKQI2EY', // Meet Me
  'P-1VJ73284XP012835MNKQJDLI', // Pro
  'P-9HE59487TV546734SNKQJEMQ', // Business
  'P-73J83679GV554154TNKQJFMQ', // Elite
  'P-9KP25231PY224692PNKQJG6Q'  // Marca Blanca
];

code = code.replace(oldPaypalAnchorRegex, () => {
  const replacement = `<PayPalButton planId="${planIds[matchCount]}" />`;
  matchCount++;
  return replacement;
});

fs.writeFileSync('app/page.jsx', code);
console.log('Successfully replaced ' + matchCount + ' paypal links with smart buttons.');
