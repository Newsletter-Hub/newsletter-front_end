import Logo from '@/assets/images/logo';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';
import loginImage from '@/assets/images/loginImage.svg';
import signupImage from '@/assets/images/signupImage.svg';
import addNewsletterImage from '@/assets/images/addNewsletterImage.svg';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Alegreya } from 'next/font/google';

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
            ) : type === 'signup' ? (
              <>
                <p className="font-bold text-3xl mb-3">Create Profile</p>
                <p className="max-w-xs text-center mb-28">
                  Enter your personal details and start journey with us
                </p>
                <Image src={signupImage} width={450} alt="login" priority />
              </>
            ) : (
              <>
                <p className="font-bold text-3xl mb-3">Add Newsletter</p>
                <p className="max-w-xs text-center mb-28">
                  Enter your personal details and start journey with us
                </p>
                <Image
                  src={addNewsletterImage}
                  width={450}
                  alt="login"
                  priority
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
