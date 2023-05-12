import { HTTPError } from 'ky';
import ky from 'ky-universal';

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const backendResponse = await ky.post(
        'https://newsletter-back-quzx.onrender.com/auth/sign-in',
        {
          json: req.body,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      // Extract the 'Set-Cookie' header from the backend response
      const setCookieHeader = backendResponse.headers.get('Set-Cookie');

      if (setCookieHeader) {
        console.log(setCookieHeader);
        res.setHeader('Set-Cookie', [
          `accessToken=${setCookieHeader}; Path=/; HttpOnly; SameSite=None; Secure`,
        ]);
      } else {
        throw new Error('JWT cookie not found in backend response');
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      const httpError = error as HTTPError; // assert type here
      const statusCode = httpError.response?.status || 500;
      res.status(statusCode).json({
        success: false,
        message: 'An error occurred while processing the request.',
        statusCode,
      });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed.' });
  }
};

export default handler;
