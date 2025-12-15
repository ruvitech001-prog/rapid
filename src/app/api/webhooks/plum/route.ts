import { NextRequest, NextResponse } from 'next/server'
import { plumService, type PlumWebhookPayload } from '@/lib/services/plum.service'

/**
 * Plum Health Insurance Webhook Handler
 *
 * Receives insurance status updates:
 * - Member enrolled
 * - Policy activated
 * - Policy renewed
 * - Claim submitted/processed
 *
 * @route POST /api/webhooks/plum
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify webhook signature
    if (!process.env.PLUM_WEBHOOK_SECRET) {
      console.error('[Plum Webhook] Webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const signature = request.headers.get('x-plum-signature') ||
      request.headers.get('x-webhook-signature') || ''

    const isValid = plumService.verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[Plum Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload: PlumWebhookPayload = JSON.parse(rawBody)

    console.log('[Plum Webhook] Received event:', payload.event, {
      member_id: payload.member_id,
      policy_id: payload.policy_id,
    })

    // Process the webhook
    await plumService.processWebhook(payload)

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Plum Webhook] Error processing webhook:', error)

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
    service: 'plum-webhook',
    timestamp: new Date().toISOString(),
  })
}
