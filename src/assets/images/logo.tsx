import Image from 'next/image';
import Link from 'next/link';

import logo from './Logo.svg';

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/">
      <Image src={logo} alt="logo" width={150} className={className} />
    </Link>
  );
};
export default Logo;
