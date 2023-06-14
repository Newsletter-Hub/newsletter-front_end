import Script from 'next/script';
import { Adsense } from '@ctrl/react-adsense';

const GoogleAds = () => {
  return (
    <>
      <Adsense
        client="ca-pub-8804004591913052"
        slot="5662242139"
        style={{ display: 'block' }}
        layout="in-article"
        format="fluid"
      />
    </>
  );
};

export default GoogleAds;
