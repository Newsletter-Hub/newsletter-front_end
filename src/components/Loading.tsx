import Image from 'next/image';

import logo from '@/assets/images/Logo.svg';

const Loading = () => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="animate-pulse">
        <Image src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Loading;
