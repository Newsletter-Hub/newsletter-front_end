import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    (window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-8804004591913052"
      data-ad-slot="2040931016"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdComponent;
