import ky from 'ky-universal';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url: encodedUrl } = req.query;
  const imageUrl = Array.isArray(encodedUrl)
    ? encodedUrl.join('/')
    : encodedUrl;

  if (typeof imageUrl !== 'string') {
    res.status(400).send('Invalid URL');
    return;
  }

  const decodedUrl = decodeURIComponent(imageUrl);

  try {
    const imageResponse = await ky.get(decodedUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType =
      imageResponse.headers.get('content-type') || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    res.status(500).send('An error occurred while fetching the image.');
  }
}
