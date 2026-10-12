export default function handler(req: any, res: any) {
  // Global CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawKeyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.RAZOR_PAYKEYID ||
    process.env.RAZORPAYKEYID ||
    process.env.RAZOR_PAY_KEY_ID ||
    process.env.VITE_RAZORPAY_KEY_ID ||
    'rzp_test_TmGhxLupa7Bm8z';
  const keyId = (
    rawKeyId.match(/rzp_(?:live|test)_[a-zA-Z0-9]+/i)?.[0] ||
    rawKeyId.replace(/^(?:api[\s_]*key|key[\s_]*id|key)[\s:=]*/i, '')
  ).trim().replace(/^["']|["']$/g, '');

  return res.status(200).json({
    keyId,
    currency: 'INR',
    merchantName: "Ramy's Dance Studio",
    themeColor: '#0066FF',
  });
}
