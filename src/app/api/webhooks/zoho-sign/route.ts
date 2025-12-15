import { NextRequest, NextResponse } from 'next/server'
import { zohoSignService, type ZohoWebhookPayload } from '@/lib/services/zoho-sign.service'

/**
 * Zoho Sign Webhook Handler
 *
 * Receives signature status updates:
 * - Document viewed
 * - Document signed
 * - Signature completed
 * - Signature declined
 * - Signature expired
 *
 * @route POST /api/webhooks/zoho-sign
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text()

    // SECURITY: Verify webhook signature (fail closed)
    const signature = request.headers.get('x-zoho-signature') ||
      request.headers.get('x-webhook-signature') || ''

    if (!process.env.ZOHO_SIGN_WEBHOOK_SECRET) {
      console.error('[Zoho Sign Webhook] Webhook secret not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const isValid = zohoSignService.verifyWebhookSignature(rawBody, signature)
    if (!isValid) {
      console.error('[Zoho Sign Webhook] Invalid signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Parse payload
    const payload: ZohoWebhookPayload = JSON.parse(rawBody)

    console.log('[Zoho Sign Webhook] Received event:', {
      request_id: payload.requests?.request_id,
      status: payload.requests?.request_status,
      operation: payload.notifications?.operation_type,
    })

    // Process the webhook
    await zohoSignService.processWebhook(payload)

    // Return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Zoho Sign Webhook] Error processing webhook:', error)

    // Return 200 even on error to prevent retries for parsing errors
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
    service: 'zoho-sign-webhook',
    timestamp: new Date().toISOString(),
  })
}
