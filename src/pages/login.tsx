import Button from '@/components/Button';
import Link from 'next/link';
import loginImage from '@/assets/images/loginImage.svg';
import Image from 'next/image';
import Form from '@/components/Login/Form';

const Login = () => {
  return (
    <div className="flex h-[100vh]">
      <div className="w-[40%] bg-light-blue h-full flex flex-col items-center justify-center">
        <p className="font-bold text-3xl mb-3">Hello, Friend!</p>
        <p className="max-w-xs text-center mb-12">
          Enter your personal details and start journey with us
        </p>
        <Link href="sign-up" className="mb-20">
          <Button label="Sign up" variant="outlined" fontSize="sm" uppercase />
        </Link>
        <Image src={loginImage} width={450} alt="login" />
      </div>
      <div className="w-full justify-center items-center flex">
        <Form />
      </div>
    </div>
  );
};

export default Login;
