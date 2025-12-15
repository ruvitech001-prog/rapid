import { NextRequest, NextResponse } from 'next/server'
import { springverifyService, type SpringverifyWebhookPayload } from '@/lib/services/springverify.service'

/**
 * Springverify Webhook Handler
 *
 * Receives verification status updates for:
 * - eKYC (Aadhaar, PAN, Bank verification)
 * - BGV (Identity, Address, Education, Employment, Criminal checks)
 *
 * @route POST /api/webhooks/springverify
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // Verify webhook signature
    if (!process.env.SPRINGVERIFY_WEBHOOK_SECRET) {
      console.error('[Springverify Webhook] Webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const signature = request.headers.get('x-springverify-signature') ||
      request.headers.get('x-webhook-signature') || ''

    const isValid = springverifyService.verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[Springverify Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload: SpringverifyWebhookPayload = JSON.parse(rawBody)

    console.log('[Springverify Webhook] Received event:', payload.event, {
      candidate_id: payload.candidate_id,
      verification_id: payload.verification_id,
      check_type: payload.check_type,
      status: payload.status,
    })

    // Process the webhook
    await springverifyService.processWebhook(payload)

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Springverify Webhook] Error processing webhook:', error)

    // Return 200 even on error to prevent retries for parsing errors
    // Only return error status for actual processing failures
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
    service: 'springverify-webhook',
    timestamp: new Date().toISOString(),
  })
}
