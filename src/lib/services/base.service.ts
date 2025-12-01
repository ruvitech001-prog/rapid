import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message)
    this.name = 'ServiceError'
  }
}

export abstract class BaseService {
  protected supabase: SupabaseClient<Database>

  constructor() {
    this.supabase = createClient()
  }

  protected handleError(error: unknown): never {
    console.error('[Service Error]', error)
    if (error && typeof error === 'object' && 'code' in error) {
      const err = error as { code: string; message?: string }
      throw new ServiceError(err.message || 'Database error', err.code, 400)
    }
    throw new ServiceError('An unexpected error occurred', 'UNKNOWN', 500)
  }
}
