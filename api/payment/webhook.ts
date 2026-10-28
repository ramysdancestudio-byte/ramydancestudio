import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const signature = (req.headers['x-razorpay-signature'] as string) || '';
    const rawSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET ||
      process.env.RAZORPAYWEBHOOKSECRET ||
      process.env.RAZOR_PAY_WEBHOOK_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAYKEYSECRET ||
      'v3L6U47RsNRqf06PJr3fh0a5';
    const secret = rawSecret.trim().replace(/^["']|["']$/g, '');

    // Read stream body
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf-8');

    let isValid = false;
    if (signature && secret) {
      try {
        const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
        isValid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
      } catch {
        isValid = false;
      }
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {}

    const eventName = payload?.event || 'payment.authorized';

    return res.status(200).json({
      status: 'ok',
      signatureValid: isValid,
      event: eventName,
    });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: err?.message || 'Internal Server Error' });
  }
}
