import { NextResponse } from 'next/server';
import { getPool, initDb } from '../../../../lib/db';

export async function GET(request) {
  try {
    await initDb();
    const pool = getPool();

    const query = `
      SELECT 
        o.*,
        COUNT(DISTINCT u.id)::int AS member_count,
        COUNT(DISTINCT vp.id)::int AS profile_count
      FROM organizations o
      LEFT JOIN users u ON u.organization_id = o.id
      LEFT JOIN vcard_profiles vp ON vp.organization_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;

    const result = await pool.query(query);
    return NextResponse.json({ success: true, organizations: result.rows });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, custom_domain = '', primary_color = '#ff0003', logo_url = '', enforce_branding = false, max_members = 50 } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Nombre y slug de la organización son requeridos' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    const result = await pool.query(
      `INSERT INTO organizations (name, slug, custom_domain, primary_color, logo_url, enforce_branding, max_members)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, cleanSlug, custom_domain, primary_color, logo_url, Boolean(enforce_branding), parseInt(max_members, 10) || 50]
    );

    return NextResponse.json({ success: true, organization: result.rows[0] });
  } catch (error) {
    console.error('Error creating organization:', error);
    if (error.code === '23505') {
      return NextResponse.json({ success: false, error: 'Ya existe una organización con ese slug' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, slug, custom_domain, primary_color, logo_url, enforce_branding, max_members } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de la organización requerido' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    const cleanSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') : undefined;

    const result = await pool.query(
      `UPDATE organizations SET
        name = COALESCE($1, name),
        slug = COALESCE($2, slug),
        custom_domain = COALESCE($3, custom_domain),
        primary_color = COALESCE($4, primary_color),
        logo_url = COALESCE($5, logo_url),
        enforce_branding = COALESCE($6, enforce_branding),
        max_members = COALESCE($7, max_members),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [name, cleanSlug, custom_domain, primary_color, logo_url, enforce_branding !== undefined ? Boolean(enforce_branding) : null, max_members ? parseInt(max_members, 10) : null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Organización no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, organization: result.rows[0] });
  } catch (error) {
    console.error('Error updating organization:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de la organización requerido' }, { status: 400 });
    }

    await initDb();
    const pool = getPool();

    await pool.query('DELETE FROM organizations WHERE id = $1', [id]);
    return NextResponse.json({ success: true, message: 'Organización eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
