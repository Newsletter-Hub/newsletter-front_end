import Image from 'next/image';

import logo from '@/assets/images/Logo.svg';

interface LoadingProps {
  fullScreen?: boolean;
}

const Loading = ({ fullScreen }: LoadingProps) => {
  return (
    <div
      className={`flex w-full h-full ${
        fullScreen && 'h-screen w-screen'
      } justify-center items-center`}
    >
      <div className="animate-pulse">
        <Image src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Loading;
