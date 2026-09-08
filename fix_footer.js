const fs = require('fs');
let content = fs.readFileSync('app/p/[slug]/PublicProfileClient.jsx', 'utf8');

const footer = `
        {/* POWERED BY LINK */}
        <div className="pt-12 pb-6 text-center">
          <a href="https://tsolutionsipidd.com/nfc-vcards" target="_blank" rel="noopener noreferrer" className="inline-flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-medium tracking-widest uppercase text-white/50">Tecnología por</span>
            <span className="text-sm font-bruno font-bold tracking-widest text-white flex items-center gap-1">
              TSolutions <span style={{ color: color_primario }}>ROSE</span>
            </span>
            <span className="text-[9px] text-white/40 mt-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">Crea tu ROSE vCard Gratis</span>
          </a>
        </div>
`;

content = content.replace('      </div>\n    </div>\n  );\n}', footer + '      </div>\n    </div>\n  );\n}');
content = content.replace('      </div>\r\n    </div>\r\n  );\r\n}', footer + '      </div>\r\n    </div>\r\n  );\r\n}');

fs.writeFileSync('app/p/[slug]/PublicProfileClient.jsx', content);
