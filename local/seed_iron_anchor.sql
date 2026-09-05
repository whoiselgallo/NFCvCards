-- =====================================================================
-- PERFILES DE MUESTRA: IRON & ANCHOR BARBER CO. (5 HOMBRES, 1 MUJER)
-- =====================================================================

INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto,
  telefono, whatsapp, correo, url, linkedin, instagram, facebook,
  calle, ciudad, estado, cp, pais, nota, google_maps_url,
  theme, font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  tags, status
) VALUES 
(
  'marcos-thorne-iron-anchor', 'vcard', 'Marcos', 'Thorne', 'Iron & Anchor Barber Co.', 'Master Barber & Co-Founder',
  '+34 612 345 678', '34612345678', 'marcos@ironandanchor.com', 'https://ironandanchor.com', 'marcos-thorne-barber', 'thorne_barber', 'marcosthornebarber',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Cortes clásicos a navaja libre, degradados Skin Fade y rituales de toalla caliente con aceites esenciales.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'modern', 'Bruno Ace SC', 'Bruno Ace SC', 'Space Grotesk', '#D97706', '#E5E7EB', '#D97706',
  'Fundador, Master Barber, Fade, Clásico', 'active'
),
(
  'mateo-rivas-iron-anchor', 'vcard', 'Mateo', 'Rivas', 'Iron & Anchor Barber Co.', 'Senior Hair & Beard Stylist',
  '+34 623 456 789', '34623456789', 'mateo@ironandanchor.com', 'https://ironandanchor.com', 'mateo-rivas-barber', 'mateorivas_cuts', 'mateorivasbarber',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Especialista en degradados milimétricos, perfilado de barba nórdica y tratamientos de keratina masculina.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'modern', 'Bebas Neue', 'Bebas Neue', 'Inter', '#C2410C', '#38BDF8', '#C2410C',
  'Senior Barber, Beard Stylist, Barba, Textura', 'active'
),
(
  'elena-salcedo-iron-anchor', 'vcard', 'Elena', 'Salcedo', 'Iron & Anchor Barber Co.', 'Lead Colorist & Grooming Specialist',
  '+34 634 567 890', '34634567890', 'elena@ironandanchor.com', 'https://ironandanchor.com', 'elena-salcedo-grooming', 'elena_salcedo_barber', 'elenasalcedobarber',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Colorimetría avanzada para hombre (platinados, grises y matices naturales), visagismo y cuidado facial premium.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'modern', 'Playfair Display', 'Playfair Display', 'Inter', '#E11D48', '#FBBF24', '#E11D48',
  'Colorimetría, Grooming, Platinados, Facial', 'active'
),
(
  'alex-vega-iron-anchor', 'vcard', 'Alejandro', 'Vega', 'Iron & Anchor Barber Co.', 'Traditional Shaving & Hot Towel Master',
  '+34 645 678 901', '34645678901', 'alex@ironandanchor.com', 'https://ironandanchor.com', 'alex-vega-shaving', 'alexvega_barber', 'alexvegabarber',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Afeitado tradicional a navaja libre con técnica inglesa, toalla caliente al vapor y arreglo de bigote Handlebar.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'classic', 'Cinzel', 'Cinzel', 'Inter', '#2563EB', '#94A3B8', '#2563EB',
  'Afeitado Clásico, Hot Towel, Navaja, Bigote', 'active'
),
(
  'david-castillo-iron-anchor', 'vcard', 'David', 'Castillo', 'Iron & Anchor Barber Co.', 'Freestyle Hair Artist & Trends Barber',
  '+34 656 789 012', '34656789012', 'david@ironandanchor.com', 'https://ironandanchor.com', 'david-castillo-freestyle', 'david_slick_cuts', 'davidslickcuts',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Freestyle hair designs, textura french crop, mullets modernos y acabados pompadour con fijación mate.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'modern', 'Space Grotesk', 'Space Grotesk', 'Outfit', '#10B981', '#F3F4F6', '#10B981',
  'Freestyle, French Crop, Mullet, Tendencias', 'active'
),
(
  'lucas-mendoza-iron-anchor', 'vcard', 'Lucas', 'Mendoza', 'Iron & Anchor Barber Co.', 'Junior Barber & Customer Experience',
  '+34 667 890 123', '34667890123', 'lucas@ironandanchor.com', 'https://ironandanchor.com', 'lucas-mendoza-craft', 'lucasmendoza_cuts', 'lucasmendozacuts',
  'Avinguda del Port, 45', 'Valencia', 'Comunidad Valenciana', '46021', 'España',
  'Mantenimiento de corte, lavado y masaje capilar estimulante, asesoría de productos y barra de cortesía.',
  'https://maps.google.com/?q=Iron+and+Anchor+Valencia',
  'minimal', 'Outfit', 'Outfit', 'Inter', '#EA580C', '#00E5FF', '#EA580C',
  'Junior Barber, Lavado, Hospitality, Mantenimiento', 'active'
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
  updated_at = CURRENT_TIMESTAMP;
