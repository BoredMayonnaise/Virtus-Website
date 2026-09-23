import { neon } from "@neondatabase/serverless";

export function isNeonConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && (url.startsWith("postgres://") || url.startsWith("postgresql://")));
}

export function getNeonSql() {
  if (!isNeonConfigured()) {
    return null;
  }
  return neon(process.env.DATABASE_URL!);
}

/**
 * Initializes the full agency database schema in Neon PostgreSQL
 */
export async function initNeonSchema() {
  const sql = getNeonSql();
  if (!sql) {
    return { success: false, message: "DATABASE_URL not configured. Running in local fallback mode." };
  }

  try {
    // 1. Clients
    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        company VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(64) DEFAULT 'Active',
        total_revenue NUMERIC DEFAULT 0,
        active_projects_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 2. Opportunities (GHL Pipeline)
    await sql`
      CREATE TABLE IF NOT EXISTS opportunities (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        stage VARCHAR(64) NOT NULL,
        deal_value NUMERIC NOT NULL,
        recommended_tier VARCHAR(64) NOT NULL,
        needs JSONB DEFAULT '[]'::jsonb,
        timeline VARCHAR(128),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 3. Projects
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(64) PRIMARY KEY,
        client_id VARCHAR(64),
        client_name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        phase VARCHAR(64) NOT NULL,
        progress INT DEFAULT 0,
        risk_level VARCHAR(64) DEFAULT 'On Track',
        budget NUMERIC DEFAULT 0,
        start_date DATE,
        target_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 4. Tasks (Delivery Floor)
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(64) PRIMARY KEY,
        project_id VARCHAR(64),
        project_title VARCHAR(255),
        title TEXT NOT NULL,
        assignee VARCHAR(255) NOT NULL,
        status VARCHAR(64) DEFAULT 'todo',
        priority VARCHAR(64) DEFAULT 'medium',
        due_date VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 5. Invoices
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(64) PRIMARY KEY,
        client_id VARCHAR(64),
        client_name VARCHAR(255) NOT NULL,
        invoice_number VARCHAR(64) NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(64) DEFAULT 'Pending',
        due_date DATE,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 6. Bookings (Calendar)
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(64) PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        booking_type VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        time VARCHAR(128) NOT NULL,
        host VARCHAR(255) NOT NULL,
        meeting_url TEXT NOT NULL,
        status VARCHAR(64) DEFAULT 'Confirmed',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 7. Proposals
    await sql`
      CREATE TABLE IF NOT EXISTS proposals (
        id VARCHAR(64) PRIMARY KEY,
        proposal_number VARCHAR(64) NOT NULL,
        client_id VARCHAR(64),
        client_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(64) DEFAULT 'Sent',
        valid_until DATE,
        scope_summary JSONB DEFAULT '[]'::jsonb,
        timeline VARCHAR(128),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 8. Contracts
    await sql`
      CREATE TABLE IF NOT EXISTS contracts (
        id VARCHAR(64) PRIMARY KEY,
        contract_number VARCHAR(64) NOT NULL,
        client_id VARCHAR(64),
        client_name VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        contract_type VARCHAR(128) NOT NULL,
        value NUMERIC DEFAULT 0,
        status VARCHAR(64) DEFAULT 'Draft',
        signed_at TIMESTAMPTZ,
        signer_name VARCHAR(255),
        signer_email VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // 9. Activity Logs
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(64) PRIMARY KEY,
        description TEXT NOT NULL,
        category VARCHAR(64) NOT NULL,
        timestamp VARCHAR(64) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Seed default records if empty
    await seedNeonIfEmpty(sql);

    return {
      success: true,
      message: "Neon PostgreSQL tables verified & ready.",
    };
  } catch (error: any) {
    console.error("Neon initSchema error:", error);
    return {
      success: false,
      message: error?.message || "Failed to initialize Neon schema.",
    };
  }
}

/**
 * Seeds initial demo data if clients table is empty
 */
async function seedNeonIfEmpty(sql: any) {
  try {
    const existing = await sql`SELECT COUNT(*)::int as count FROM clients`;
    if (existing && existing[0]?.count > 0) {
      return; // Already has data
    }

    // Seed Clients
    await sql`
      INSERT INTO clients (id, name, contact_name, company, email, status, total_revenue, active_projects_count)
      VALUES 
        ('cli-1', 'Arthur Pendelton', 'Arthur Pendelton', 'Tidewater Coffee', 'arthur@tidewater.coffee', 'Active', 5500, 1),
        ('cli-2', 'Elena Vance', 'Dr. Elena Vance', 'Meridian Clinic', 'elena@meridianhealth.org', 'Onboarding', 3600, 1)
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed Opportunities
    await sql`
      INSERT INTO opportunities (id, name, company, email, stage, deal_value, recommended_tier, needs, timeline)
      VALUES
        ('opp-1', 'Arthur Pendelton', 'Tidewater Roast Co.', 'arthur@tidewater.coffee', 'won', 5500, 'Growth', '["Brand & Creative", "Web & Digital"]'::jsonb, 'In a few weeks'),
        ('opp-2', 'Dr. Elena Vance', 'Meridian Clinic', 'elena@meridianhealth.org', 'proposal_sent', 3600, 'Focused', '["AI & Automation", "Web & Digital"]'::jsonb, 'Urgent (< 2 weeks)'),
        ('opp-3', 'Marcus Brody', 'Harbor Freight Logistics', 'marcus@harborfreight.coop', 'qualified', 8400, 'Integrated', '["AI & Automation", "Web & Digital", "Content & Video"]'::jsonb, 'Next quarter')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed Projects
    await sql`
      INSERT INTO projects (id, client_id, client_name, title, phase, progress, risk_level, budget, start_date, target_date)
      VALUES
        ('proj-1', 'cli-1', 'Tidewater Coffee', 'Coastal Brand & E-Commerce Flagship', 'Build', 65, 'On Track', 5500, '2026-09-15', '2026-10-15'),
        ('proj-2', 'cli-2', 'Meridian Clinic', 'Patient Experience & Intake Portal', 'Design', 35, 'On Track', 7200, '2026-09-22', '2026-11-01')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed Invoices
    await sql`
      INSERT INTO invoices (id, client_id, client_name, invoice_number, amount, status, due_date)
      VALUES
        ('inv-1', 'cli-1', 'Tidewater Coffee', 'INV-2026-001', 2750, 'Paid', '2026-09-21'),
        ('inv-2', 'cli-2', 'Meridian Clinic', 'INV-2026-002', 3600, 'Paid', '2026-09-22'),
        ('inv-3', 'cli-1', 'Tidewater Coffee', 'INV-2026-003', 2750, 'Pending', '2026-10-15')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed Bookings
    await sql`
      INSERT INTO bookings (id, client_name, company, email, booking_type, date, time, host, meeting_url, status, notes)
      VALUES
        ('book-1', 'Arthur Pendelton', 'Tidewater Coffee', 'arthur@tidewater.coffee', 'Strategy & Scope (45 min)', '2026-09-24', '10:00 AM - 10:45 AM', 'Paks (Studio Director)', 'https://meet.google.com/tvl-disc-7641', 'Confirmed', 'Review packaging mockups and finalize Shopify milestone 1.'),
        ('book-2', 'Dr. Elena Vance', 'Meridian Clinic', 'elena@meridianhealth.org', 'Discovery Call (30 min)', '2026-09-25', '02:00 PM - 02:30 PM', 'Kai (Brand Lead)', 'https://meet.google.com/tvl-disc-8922', 'Confirmed', 'Review AI automation and intake patient journey map.')
      ON CONFLICT (id) DO NOTHING;
    `;
  } catch (err) {
    console.warn("Neon seed error (non-fatal):", err);
  }
}
