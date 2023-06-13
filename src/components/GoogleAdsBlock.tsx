import Script from 'next/script';

const GoogleAds = () => {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        strategy="afterInteractive"
      />

      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8804004591913052"
        data-ad-slot="2040931016"
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
