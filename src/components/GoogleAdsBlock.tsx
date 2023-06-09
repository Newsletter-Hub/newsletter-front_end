import Script from 'next/script';

const GoogleAds = () => {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_DATA_AD_CLIENT}
        data-ad-slot={process.env.NEXT_PUBLIC_DATA_AD_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

      <Script id="adsbygoogle-init" strategy="afterInteractive">{`
        (adsbygoogle = window.adsbygoogle || []).push({});
      `}</Script>
    </>
  );
};

export default GoogleAds;
