const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://nfcards:_*p0C:dBr}h^(KaZ@35.238.255.28:5432/postgres';

const profiles = [
  {
    slug: 'marcos-thorne-iron-anchor',
    mode: 'vcard',
    nombre: 'Marcos',
    apellido: 'Thorne',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Master Barber & Co-Founder',
    telefono: '+34 612 345 678',
    whatsapp: '34612345678',
    correo: 'marcos@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'marcos-thorne-barber',
    instagram: 'thorne_barber',
    facebook: 'marcosthornebarber',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Cortes clásicos a navaja libre, degradados Skin Fade y rituales de toalla caliente con aceites esenciales.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'modern',
    font_family: 'Bruno Ace SC',
    font_primary: 'Bruno Ace SC',
    font_secondary: 'Space Grotesk',
    color_primario: '#D97706',
    color_secundario: '#E5E7EB',
    color_cta: '#D97706',
    tags: 'Fundador, Master Barber, Fade, Clásico',
    status: 'active'
  },
  {
    slug: 'mateo-rivas-iron-anchor',
    mode: 'vcard',
    nombre: 'Mateo',
    apellido: 'Rivas',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Senior Hair & Beard Stylist',
    telefono: '+34 623 456 789',
    whatsapp: '34623456789',
    correo: 'mateo@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'mateo-rivas-barber',
    instagram: 'mateorivas_cuts',
    facebook: 'mateorivasbarber',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Especialista en degradados milimétricos, perfilado de barba nórdica y tratamientos de keratina masculina.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'modern',
    font_family: 'Bebas Neue',
    font_primary: 'Bebas Neue',
    font_secondary: 'Inter',
    color_primario: '#C2410C',
    color_secundario: '#38BDF8',
    color_cta: '#C2410C',
    tags: 'Senior Barber, Beard Stylist, Barba, Textura',
    status: 'active'
  },
  {
    slug: 'elena-salcedo-iron-anchor',
    mode: 'vcard',
    nombre: 'Elena',
    apellido: 'Salcedo',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Lead Colorist & Grooming Specialist',
    telefono: '+34 634 567 890',
    whatsapp: '34634567890',
    correo: 'elena@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'elena-salcedo-grooming',
    instagram: 'elena_salcedo_barber',
    facebook: 'elenasalcedobarber',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Colorimetría avanzada para hombre (platinados, grises y matices naturales), visagismo y cuidado facial premium.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'modern',
    font_family: 'Playfair Display',
    font_primary: 'Playfair Display',
    font_secondary: 'Inter',
    color_primario: '#E11D48',
    color_secundario: '#FBBF24',
    color_cta: '#E11D48',
    tags: 'Colorimetría, Grooming, Platinados, Facial',
    status: 'active'
  },
  {
    slug: 'alex-vega-iron-anchor',
    mode: 'vcard',
    nombre: 'Alejandro',
    apellido: 'Vega',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Traditional Shaving & Hot Towel Master',
    telefono: '+34 645 678 901',
    whatsapp: '34645678901',
    correo: 'alex@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'alex-vega-shaving',
    instagram: 'alexvega_barber',
    facebook: 'alexvegabarber',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Afeitado tradicional a navaja libre con técnica inglesa, toalla caliente al vapor y arreglo de bigote Handlebar.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'classic',
    font_family: 'Cinzel',
    font_primary: 'Cinzel',
    font_secondary: 'Inter',
    color_primario: '#2563EB',
    color_secundario: '#94A3B8',
    color_cta: '#2563EB',
    tags: 'Afeitado Clásico, Hot Towel, Navaja, Bigote',
    status: 'active'
  },
  {
    slug: 'david-castillo-iron-anchor',
    mode: 'vcard',
    nombre: 'David',
    apellido: 'Castillo',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Freestyle Hair Artist & Trends Barber',
    telefono: '+34 656 789 012',
    whatsapp: '34656789012',
    correo: 'david@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'david-castillo-freestyle',
    instagram: 'david_slick_cuts',
    facebook: 'davidslickcuts',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Freestyle hair designs, textura french crop, mullets modernos y acabados pompadour con fijación mate.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'modern',
    font_family: 'Space Grotesk',
    font_primary: 'Space Grotesk',
    font_secondary: 'Outfit',
    color_primario: '#10B981',
    color_secundario: '#F3F4F6',
    color_cta: '#10B981',
    tags: 'Freestyle, French Crop, Mullet, Tendencias',
    status: 'active'
  },
  {
    slug: 'lucas-mendoza-iron-anchor',
    mode: 'vcard',
    nombre: 'Lucas',
    apellido: 'Mendoza',
    empresa: 'Iron & Anchor Barber Co.',
    puesto: 'Junior Barber & Customer Experience',
    telefono: '+34 667 890 123',
    whatsapp: '34667890123',
    correo: 'lucas@ironandanchor.com',
    url: 'https://ironandanchor.com',
    linkedin: 'lucas-mendoza-craft',
    instagram: 'lucasmendoza_cuts',
    facebook: 'lucasmendozacuts',
    calle: 'Avinguda del Port, 45',
    ciudad: 'Valencia',
    estado: 'Comunidad Valenciana',
    cp: '46021',
    pais: 'España',
    nota: 'Mantenimiento de corte, lavado y masaje capilar estimulante, asesoría de productos y barra de cortesía.',
    google_maps_url: 'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
    video_youtube_url: '',
    theme: 'minimal',
    font_family: 'Outfit',
    font_primary: 'Outfit',
    font_secondary: 'Inter',
    color_primario: '#EA580C',
    color_secundario: '#00E5FF',
    color_cta: '#EA580C',
    tags: 'Junior Barber, Lavado, Hospitality, Mantenimiento',
    status: 'active'
  }
];

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conectado a PostgreSQL exitosamente.');

    // Crear tabla si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS vcard_profiles (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        mode VARCHAR(20) DEFAULT 'vcard',
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        empresa VARCHAR(150),
        puesto VARCHAR(150),
        telefono VARCHAR(50),
        whatsapp VARCHAR(50),
        correo VARCHAR(150),
        url VARCHAR(255),
        linkedin VARCHAR(255),
        instagram VARCHAR(255),
        facebook VARCHAR(255),
        calle VARCHAR(255),
        ciudad VARCHAR(100),
        estado VARCHAR(100),
        cp VARCHAR(20),
        pais VARCHAR(100),
        nota TEXT,
        google_maps_url TEXT,
        video_youtube_url TEXT,
        theme VARCHAR(50) DEFAULT 'modern',
        font_family VARCHAR(100) DEFAULT 'Inter',
        font_primary VARCHAR(100) DEFAULT 'Inter',
        font_secondary VARCHAR(100) DEFAULT 'Inter',
        color_primario VARCHAR(20) DEFAULT '#F97316',
        color_secundario VARCHAR(20) DEFAULT '#00E5FF',
        color_cta VARCHAR(20) DEFAULT '#F97316',
        logo_scale INT DEFAULT 100,
        cover_position_y INT DEFAULT 50,
        cover_zoom INT DEFAULT 100,
        logo_img TEXT,
        cover_photo TEXT,
        tags TEXT DEFAULT '',
        status VARCHAR(50) DEFAULT 'active',
        views_count INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const p of profiles) {
      const query = `
        INSERT INTO vcard_profiles (
          slug, mode, nombre, apellido, empresa, puesto,
          telefono, whatsapp, correo, url, linkedin, instagram, facebook,
          calle, ciudad, estado, cp, pais, nota, google_maps_url, video_youtube_url,
          theme, font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
          tags, status
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26, $27, $28,
          $29, $30
        )
        ON CONFLICT (slug) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          apellido = EXCLUDED.apellido,
          empresa = EXCLUDED.empresa,
          puesto = EXCLUDED.puesto,
          telefono = EXCLUDED.telefono,
          whatsapp = EXCLUDED.whatsapp,
          correo = EXCLUDED.correo,
          url = EXCLUDED.url,
          linkedin = EXCLUDED.linkedin,
          instagram = EXCLUDED.instagram,
          facebook = EXCLUDED.facebook,
          calle = EXCLUDED.calle,
          ciudad = EXCLUDED.ciudad,
          estado = EXCLUDED.estado,
          cp = EXCLUDED.cp,
          pais = EXCLUDED.pais,
          nota = EXCLUDED.nota,
          google_maps_url = EXCLUDED.google_maps_url,
          theme = EXCLUDED.theme,
          font_family = EXCLUDED.font_family,
          font_primary = EXCLUDED.font_primary,
          font_secondary = EXCLUDED.font_secondary,
          color_primario = EXCLUDED.color_primario,
          color_secundario = EXCLUDED.color_secundario,
          color_cta = EXCLUDED.color_cta,
          tags = EXCLUDED.tags,
          status = EXCLUDED.status,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, slug, nombre, apellido, puesto;
      `;

      const values = [
        p.slug, p.mode, p.nombre, p.apellido, p.empresa, p.puesto,
        p.telefono, p.whatsapp, p.correo, p.url, p.linkedin, p.instagram, p.facebook,
        p.calle, p.ciudad, p.estado, p.cp, p.pais, p.nota, p.google_maps_url, p.video_youtube_url,
        p.theme, p.font_family, p.font_primary, p.font_secondary, p.color_primario, p.color_secundario, p.color_cta,
        p.tags, p.status
      ];

      const res = await client.query(query, values);
      console.log(`✅ Perfil listo: ${res.rows[0].nombre} ${res.rows[0].apellido} (${res.rows[0].puesto}) -> /p/${res.rows[0].slug}`);
    }

    console.log('\n✨ ¡Los 6 perfiles de Iron & Anchor Barber Co. se crearon con éxito en la base de datos!');
  } catch (err) {
    console.error('Error al insertar perfiles:', err);
  } finally {
    await client.end();
  }
}

seed();
