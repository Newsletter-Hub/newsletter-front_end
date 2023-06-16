import Script from 'next/script';

const GoogleAds = () => {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8804004591913052"
        data-ad-slot="5662242139"
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
