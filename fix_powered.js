const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

// Insert the powered by link just before the final closing div
const poweredByBlock = 
          {/* POWERED BY LINK */}
          <div className="pt-8 pb-4 text-center">
            <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-medium tracking-widest uppercase text-white/50">Powered by</span>
              <span className="text-sm font-bruno font-bold tracking-widest text-white flex items-center gap-1">
                TSolutions <span style={{ color: color_primario }}>ROSE</span>
              </span>
              <span className="text-[9px] text-white/40 mt-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">Haz clic aquí para crear tu ROSE vCard gratis</span>
            </a>
          </div>
        </div>
      </div>
;

content = content.replace(/        <\/div>\n      <\/div>\n    <\/div>\n  \);\n\}\n/g, poweredByBlock + '    </div>\n  );\n}\n');

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
