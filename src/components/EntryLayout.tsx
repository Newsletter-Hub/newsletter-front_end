import { Alegreya } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { GoogleOAuthProvider } from '@react-oauth/google';

import addNewsletterImage from '@/assets/images/addNewsletterImage.svg';
import loginImage from '@/assets/images/loginImage.svg';
import Logo from '@/assets/images/logo';

import Button from './Button';

export interface EntryLayoutProps {
  children?: React.ReactNode;
  type?: 'signup' | 'login' | 'newsletter' | 'newsletterEdit';
}

const alegreya = Alegreya({ subsets: ['latin'] });

const EntryLayout = ({ children, type = 'login' }: EntryLayoutProps) => {
  return (
    <>
      <Head>
        <title>Newsletter Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GoogleOAuthProvider clientId="373284142318-di7t0hm27ac0ll9vtl93l5d5kmlkg67q.apps.googleusercontent.com">
        <div className={alegreya.className}>
          <div className="flex h-[100vh] overflow-hidden">
            <div className="w-[55%] bg-primary-light h-full pt-[64px] xl:px-[56px] hidden lg:block lg:px-3">
              <div className="flex flex-col">
                <Logo className="mb-[108px]" />
              </div>
              <div className="flex flex-col items-center h-full">
                {type === 'newsletter' ? (
                  <>
                    <p className="font-bold text-3xl mb-3">Add Newsletter</p>
                    <p className="max-w-xs text-center mb-28">
                      Enter your personal details and start journey with us
                    </p>
                    <Image
                      src={addNewsletterImage}
                      width={450}
                      alt="newsletter"
                      placeholder="blur"
                      blurDataURL="src/assets/images/addNewsletterImage.svg"
                    />
                  </>
                ) : type === 'newsletterEdit' ? (
                  <>
                    <p className="font-bold text-3xl mb-3">Edit Newsletter</p>
                    <p className="max-w-xs text-center mb-28">
                      Update newsletter details and continue your journey with
                      us
                    </p>
                    <Image
                      src={addNewsletterImage}
                      width={450}
                      alt="newsletter"
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
            </div>
            <div className="h-full w-full">
              <div className="w-full justify-center flex flex-col h-full items-center md:gap-6 px-3">
                <Logo className="lg:hidden" />
                <div className="flex items-center w-full md:w-fit justify-center">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </>
  );
};

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const measurementId = process.env.NEXT_PUBLIC_G_MEASUREMENT_ID;

  console.log(baseUrl);

  return {
    props: {
      title: 'Title',
      description: 'description',
    },
  };
}

export default EntryLayout;
