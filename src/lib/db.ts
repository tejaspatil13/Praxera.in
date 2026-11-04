import { neon } from "@neondatabase/serverless";
import type { RequirementAnswers, RequirementStatus } from "@/lib/requirements";

export type RequirementRecord = {
  id: string;
  createdAt: Date;
  status: RequirementStatus;
  notes: string;
  answers: RequirementAnswers;
};

type Row = { id: string; created_at: Date; status: RequirementStatus; notes: string; answers: RequirementAnswers };

const connectionString = () => process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const dbConfigured = () => !!connectionString();

let schemaReady: Promise<unknown> | undefined;

/** Answers stay in one JSON column so the form can change without a database migration. */
async function db() {
  const sql = neon(connectionString()!);
  schemaReady ??= sql`
    CREATE TABLE IF NOT EXISTS requirements (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at timestamptz NOT NULL DEFAULT now(),
      status text NOT NULL DEFAULT 'new',
      notes text NOT NULL DEFAULT '',
      answers jsonb NOT NULL
    )`.catch((err) => {
    schemaReady = undefined;
    throw err;
  });
  await schemaReady;
  return sql;
}

const toRecord = (r: Row): RequirementRecord => ({
  id: r.id,
  createdAt: new Date(r.created_at),
  status: r.status,
  notes: r.notes,
  answers: r.answers,
});

export async function saveRequirement(answers: RequirementAnswers) {
  const sql = await db();
  await sql`INSERT INTO requirements (answers) VALUES (${JSON.stringify(answers)}::jsonb)`;
}

export async function listRequirements() {
  const sql = await db();
  const rows = await sql`SELECT * FROM requirements ORDER BY created_at DESC LIMIT 500`;
  return (rows as Row[]).map(toRecord);
}

export async function getRequirement(id: string) {
  const sql = await db();
  const rows = await sql`SELECT * FROM requirements WHERE id = ${id}::uuid`;
  return rows[0] ? toRecord(rows[0] as Row) : null;
}

export async function setRequirementStatus(id: string, status: RequirementStatus) {
  const sql = await db();
  await sql`UPDATE requirements SET status = ${status} WHERE id = ${id}::uuid`;
}

export async function setRequirementNotes(id: string, notes: string) {
  const sql = await db();
  await sql`UPDATE requirements SET notes = ${notes} WHERE id = ${id}::uuid`;
}

export async function deleteRequirement(id: string) {
  const sql = await db();
  await sql`DELETE FROM requirements WHERE id = ${id}::uuid`;
}
