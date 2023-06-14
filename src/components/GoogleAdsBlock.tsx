import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

const GoogleAds: React.FC = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8804004591913052"
      data-ad-slot="5662242139"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default GoogleAds;
