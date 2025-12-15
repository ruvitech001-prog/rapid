import { NextRequest, NextResponse } from 'next/server'
import { kekaService, type KekaWebhookPayload } from '@/lib/services/keka.service'

/**
 * Keka HRMS Webhook Handler
 *
 * Receives HRMS status updates:
 * - Employee created/updated/terminated
 * - Leave approved/rejected
 * - Payroll processed
 *
 * @route POST /api/webhooks/keka
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify webhook signature
    if (!process.env.KEKA_WEBHOOK_SECRET) {
      console.error('[Keka Webhook] Webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const signature = request.headers.get('x-keka-signature') ||
      request.headers.get('x-webhook-signature') || ''

    const isValid = kekaService.verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[Keka Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload: KekaWebhookPayload = JSON.parse(rawBody)

    console.log('[Keka Webhook] Received event:', payload.event, {
      employeeId: payload.data?.employeeId,
      timestamp: payload.timestamp,
    })

    // Process the webhook
    await kekaService.processWebhook(payload)

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Keka Webhook] Error processing webhook:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

/**
 * Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'keka-webhook',
    timestamp: new Date().toISOString(),
  })
}
