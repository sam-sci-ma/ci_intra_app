import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const tables = ['events','communications','internships','campaigns','milestones','admissions_metrics'];
    const results: Record<string, number|null> = {};

    const supabaseAdmin = getSupabaseAdmin();
    for (const t of tables) {
      const { count, error } = await supabaseAdmin.from(t).select('id', { count: 'exact', head: true });
      if (error) {
        results[t] = null;
      } else {
        results[t] = count ?? 0;
      }
    }

    return NextResponse.json({ ok: true, counts: results });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || err }, { status: 500 });
  }
}
