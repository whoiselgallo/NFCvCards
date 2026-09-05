-- ====================================================================
-- SEED SCRIPT: Iron & Anchor Barber Co. (Perfiles de Muestra Oficiales)
-- TSOLUTIONS IPIDD — vCard & Review Engine
-- Con logotipo oficial en cobre: Ancla Forjada + Máquina Clipper
-- ====================================================================

-- 1. Marcos Thorne (Master Barber & Co-Founder)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'marcos-thorne-iron-anchor', 'vcard', 'Marcos', 'Thorne', 'Iron & Anchor Barber Co.',
  'Master Barber & Co-Founder', '+526861234501', '+526861234501', 'marcos@ironandanchor.com', 'https://ironandanchor.com',
  'marcos_ironanchor', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Cortes clásicos a navaja libre, Skin Fade de alta precisión, perfilado de barba y toalla caliente tradicional.',
  'modern', 'Bruno Ace SC', 'Bruno Ace SC', 'Inter', '#D97706', '#F59E0B', '#D97706',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#VIP, #Socio, #MasterBarber, #Mexicali, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- 2. Mateo Rivas (Senior Hair & Beard Stylist)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'mateo-rivas-iron-anchor', 'vcard', 'Mateo', 'Rivas', 'Iron & Anchor Barber Co.',
  'Senior Hair & Beard Stylist', '+526861234502', '+526861234502', 'mateo@ironandanchor.com', 'https://ironandanchor.com',
  'mateorivas_barber', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Especialista en degradados milimétricos (Low, Mid, High Fade) y perfilado de barba nórdica con aceites esenciales.',
  'modern', 'Bebas Neue', 'Bebas Neue', 'Inter', '#EA580C', '#00E5FF', '#EA580C',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#Senior, #Barba, #Fade, #Mexicali, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- 3. Elena Salcedo (Lead Colorist & Grooming Specialist)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'elena-salcedo-iron-anchor', 'vcard', 'Elena', 'Salcedo', 'Iron & Anchor Barber Co.',
  'Lead Colorist & Grooming Specialist', '+526861234503', '+526861234503', 'elena@ironandanchor.com', 'https://ironandanchor.com',
  'elena_grooming', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Colorimetría avanzada masculina (platinados, grises y efectos texturizados), visagismo y tratamiento facial desintoxicante.',
  'classic', 'Playfair Display', 'Playfair Display', 'Inter', '#E11D48', '#EAB308', '#E11D48',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#Colorista, #Faciales, #Visagismo, #Mexicali, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- 4. Alejandro "Alex" Vega (Traditional Shaving & Hot Towel Master)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'alex-vega-iron-anchor', 'vcard', 'Alejandro', 'Vega', 'Iron & Anchor Barber Co.',
  'Traditional Shaving & Hot Towel Master', '+526861234504', '+526861234504', 'alex@ironandanchor.com', 'https://ironandanchor.com',
  'alexvega_shave', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Ritual de afeitado tradicional a navaja libre inglesa, vapor ozono, toallas calientes aromatizadas y diseño de bigote clásico.',
  'minimal', 'Cinzel', 'Cinzel', 'Inter', '#1E3A8A', '#94A3B8', '#1E3A8A',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#AfeitadoClasico, #Navaja, #ToallaCaliente, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- 5. David Castillo (Freestyle Hair Artist & Trends Barber)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'david-castillo-iron-anchor', 'vcard', 'David', 'Castillo', 'Iron & Anchor Barber Co.',
  'Freestyle Hair Artist & Trends Barber', '+526861234505', '+526861234505', 'david@ironandanchor.com', 'https://ironandanchor.com',
  'david_freestylehair', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Diseños freestyle y grecas a navaja, French Crop, mullets vanguardistas, Pompadour y tendencias urbanas internacionales.',
  'modern', 'Space Grotesk', 'Space Grotesk', 'Inter', '#059669', '#34D399', '#059669',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#Freestyle, #Tendencias, #FrenchCrop, #Urban, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;

-- 6. Lucas Mendoza (Junior Barber & Customer Experience)
INSERT INTO vcard_profiles (
  slug, mode, nombre, apellido, empresa, puesto, telefono, whatsapp, correo, url,
  instagram, facebook, ciudad, estado, pais, nota, theme,
  font_family, font_primary, font_secondary, color_primario, color_secundario, color_cta,
  logo_img, logo_scale, cover_position_y, cover_zoom, tags, status
) VALUES (
  'lucas-mendoza-iron-anchor', 'vcard', 'Lucas', 'Mendoza', 'Iron & Anchor Barber Co.',
  'Junior Barber & Customer Experience', '+526861234506', '+526861234506', 'lucas@ironandanchor.com', 'https://ironandanchor.com',
  'lucasmendoza_barber', 'ironanchorbarber', 'Mexicali', 'Baja California', 'México',
  'Lavado y masaje capilar estimulante, perfilado básico, mantenimiento de barba y anfitrión del bar de cortesía de la casa.',
  'minimal', 'Outfit', 'Outfit', 'Inter', '#F97316', '#64748B', '#F97316',
  '/iron-anchor-copper-logo.svg', 100, 50, 100, '#Junior, #AtencionAlCliente, #Mexicali, #IronAndAnchor', 'active'
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
  instagram = EXCLUDED.instagram,
  facebook = EXCLUDED.facebook,
  ciudad = EXCLUDED.ciudad,
  estado = EXCLUDED.estado,
  pais = EXCLUDED.pais,
  nota = EXCLUDED.nota,
  theme = EXCLUDED.theme,
  font_primary = EXCLUDED.font_primary,
  font_secondary = EXCLUDED.font_secondary,
  color_primario = EXCLUDED.color_primario,
  color_secundario = EXCLUDED.color_secundario,
  color_cta = EXCLUDED.color_cta,
  logo_img = EXCLUDED.logo_img,
  tags = EXCLUDED.tags,
  status = EXCLUDED.status,
  updated_at = CURRENT_TIMESTAMP;
