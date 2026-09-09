const fs = require('fs');

let code = fs.readFileSync('app/page.jsx', 'utf8');

// Find the malformed part
// return (
//     <div
//       <Script src="https://www.paypal.com/sdk/js?client-id=...&vault=true&intent=subscription" strategy="lazyOnload" />
//       
//       {/* HEADER / NAVBAR */}

const oldBadString = `return (
    <div
      <Script src="https://www.paypal.com/sdk/js?client-id=BAAVBTkbyfhfvSv-LwMOAjKhD4cWmr2himsyOcDfmT_oBblFqSZ5LdvTLDibQfmSi6mSrgCtYcA0YsoMoI&vault=true&intent=subscription" strategy="lazyOnload" />`;

const newGoodString = `return (
    <>
      <Script src="https://www.paypal.com/sdk/js?client-id=BAAVBTkbyfhfvSv-LwMOAjKhD4cWmr2himsyOcDfmT_oBblFqSZ5LdvTLDibQfmSi6mSrgCtYcA0YsoMoI&vault=true&intent=subscription" strategy="lazyOnload" />
    <div`;

code = code.replace(oldBadString, newGoodString);

// Also need to wrap the whole return in a fragment, so close the fragment at the end.
// Wait, `return ( <>\n <Script... />\n <div ...> \n ... \n </div> \n </>\n );`
// Let's just find the closing </div> of the main container and add </> after it.
// The main container ends just before the last line.

if (!code.includes("</>")) {
  const lastDivIndex = code.lastIndexOf("</div>");
  if (lastDivIndex !== -1) {
    code = code.substring(0, lastDivIndex + 6) + "\n    </>\n" + code.substring(lastDivIndex + 6);
  }
}

fs.writeFileSync('app/page.jsx', code);
console.log('Fixed syntax error in app/page.jsx');
