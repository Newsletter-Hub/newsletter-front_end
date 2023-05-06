import { Alegreya } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { GoogleOAuthProvider } from '@react-oauth/google';

import addNewsletterImage from '@/assets/images/addNewsletterImage.svg';
import loginImage from '@/assets/images/loginImage.svg';
import Logo from '@/assets/images/logo';

import Button from './Button';

interface EntryLayoutProps {
  children: JSX.Element;
  type: 'signup' | 'login' | 'newsletter';
}

const alegreya = Alegreya({ subsets: ['latin'] });

const EntryLayout = ({ children, type }: EntryLayoutProps) => {
  return (
    <GoogleOAuthProvider clientId="373284142318-di7t0hm27ac0ll9vtl93l5d5kmlkg67q.apps.googleusercontent.com">
      <div className={alegreya.className}>
        <div className="flex h-[100vh]">
          <div className="w-[55%] bg-primary-light h-full flex flex-col items-center justify-center">
            {type === 'newsletter' ? (
              <>
                <p className="font-bold text-3xl mb-3">Add Newsletter</p>
                <p className="max-w-xs text-center mb-28">
                  Enter your personal details and start journey with us
                </p>
                <Image
                  src={addNewsletterImage}
                  width={450}
                  alt="login"
                  placeholder="blur"
                  blurDataURL="src/assets/images/addNewsletterImage.svg"
                />
              </>
            ) : (
              <>
                <p className="font-medium text-3xl mb-4">Hello, Friend!</p>
                <p className="max-w-xs text-center mb-4 font-inter">
                  {type === 'login'
                    ? 'Don’t have an account?'
                    : 'Already have an account?'}
                </p>
                <Link
                  href={type === 'login' ? '/sign-up' : '/login'}
                  className="mb-20 w-[250px]"
                >
                  <Button
                    label={type === 'login' ? 'Sign up' : 'Login'}
                    variant="outlined"
                    fontSize="sm"
                    size="full"
                  />
                </Link>
                <Image
                  src={loginImage}
                  width={450}
                  alt="login"
                  placeholder="blur"
                  blurDataURL="src/assets/images/loginImage.svg"
                />
              </>
            )}
          </div>
          <div className="w-full justify-center flex">
            <div className="flex items-center">{children}</div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  console.log(baseUrl);

  return {
    props: {
      title: 'Title',
      description: 'description',
    },
  };
}

export default EntryLayout;
