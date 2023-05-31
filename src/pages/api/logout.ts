import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader(
    'Set-Cookie',
    `accessToken=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`
  );
  res.status(200).json({ message: 'Logged out' });
}
