import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Database seed endpoint
 * The database was seeded directly via SQL through the Supabase MCP.
 * This endpoint is kept for reference and future use.
 */
export async function POST() {
  try {
    const supabase = await createClient()

    // Check current data counts
    const { count: userCount } = await supabase
      .from('users_user')
      .select('*', { count: 'exact', head: true })

    const { count: employeeCount } = await supabase
      .from('employee_employee')
      .select('*', { count: 'exact', head: true })

    const { count: contractorCount } = await supabase
      .from('contractor_contractor')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      message: 'Database status',
      data: {
        users: userCount || 0,
        employees: employeeCount || 0,
        contractors: contractorCount || 0,
        note: 'Database was seeded via SQL. Use Supabase MCP tools to manage data.',
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Clear database endpoint (disabled for safety)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Database clear is disabled. Use Supabase dashboard to manage data.' },
    { status: 403 }
  )
}
