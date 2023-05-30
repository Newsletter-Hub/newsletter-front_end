import Image from 'next/image';

import logo from '@/assets/images/Logo.svg';

const Loading = () => {
  return (
    <div className="animate-pulse">
      <Image src={logo} alt="logo" />
    </div>
  );
};

export default Loading;
