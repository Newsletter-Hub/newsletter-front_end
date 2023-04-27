import Logo from '@/assets/images/logo';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import loginImage from '@/assets/images/loginImage.svg';
import signupImage from '@/assets/images/signupImage.svg';

interface EntryLayoutProps {
  children: JSX.Element;
  type: 'signup' | 'login';
}

const EntryLayout = ({ children, type }: EntryLayoutProps) => {
  return (
    <div className="flex h-[100vh]">
      <div className="w-[50%] bg-light-blue h-full flex flex-col items-center justify-center">
        {type === 'login' ? (
          <>
            <p className="font-bold text-3xl mb-3">Hello, Friend!</p>
            <p className="max-w-xs text-center mb-12">
              Enter your personal details and start journey with us
            </p>
            <Link href="sign-up" className="mb-20">
              <Button
                label="Sign up"
                variant="outlined"
                fontSize="sm"
                uppercase
              />
            </Link>
            <Image src={loginImage} width={450} alt="login" priority />
          </>
        ) : (
          <>
            <p className="font-bold text-3xl mb-3">Create Profile</p>
            <p className="max-w-xs text-center mb-28">
              Enter your personal details and start journey with us
            </p>
            <Image src={signupImage} width={450} alt="login" priority />
          </>
        )}
      </div>
      <div className="w-full justify-center flex">
        <div className="flex items-center">{children}</div>
        <div className="ml-3 mt-7">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default EntryLayout;