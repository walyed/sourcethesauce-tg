import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    hasBotToken: !!process.env.TELEGRAM_BOT_TOKEN,
    botTokenLength: process.env.TELEGRAM_BOT_TOKEN?.length || 0,
    botTokenStart: process.env.TELEGRAM_BOT_TOKEN?.substring(0, 10) || 'not set',
    env: process.env.NODE_ENV,
  })
}
