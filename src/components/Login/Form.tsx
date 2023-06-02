import { googleAuth, login } from '@/actions/auth';
import { useUser } from '@/contexts/UserContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import { GoogleLogin } from '@react-oauth/google';

import Button from '../Button';
import Input from '../Input';
import { useWindowSize } from 'usehooks-ts';

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(1, 'Password is required field')
    .max(30, 'Maximum length of password 30 symbols')
    .min(8, 'Minimum length of password 8 symbols'),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type Field = {
  placeholder: string;
  name: 'email' | 'password';
};

type Fields = Field[];

const fields: Fields = [
  { placeholder: 'Enter your email address', name: 'email' },
  { placeholder: 'Enter your password', name: 'password' },
];

const Form = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    email,
    password,
  }) => {
    await login({ email, password, router, setUser });
  };
  const onGoogleLogin = (token: string) => {
    googleAuth({ token, router, setUser });
  };
  const { width } = useWindowSize();
  const googleButtonWidth = () => {
    if (width) {
      if (width >= 320 && width < 375) {
        return '300';
      } else if (width >= 375 && width < 768) {
        return '360';
      }
      return '400';
    }
    return '400';
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="mb-8 gap-12 flex flex-col w-full">
          {fields.map(field => (
            <Input
              register={{ ...register(field.name) }}
              variant="filled"
              placeholder={field.placeholder}
              key={field.name}
              error={Boolean(errors[field.name])}
              errorText={errors[field.name]?.message}
              isPassword={Boolean(field.name === 'password')}
            />
          ))}
        </div>
        <Link
          href="login/forgot-password"
          className="underline text-base mb-8 font-inter text-lightBlack font-semibold"
        >
          Forgot password?
        </Link>
        <p className="font-inter text-sm text-dark-blue lg:hidden mb-4">
          Don’t have an account?{' '}
          <Link href="/sign-up" className="font-semibold">
            Signup
          </Link>
        </p>
        <Button
          label="Login"
          size="full"
          rounded="xl"
          type="submit"
          customStyles="mb-4"
        />
      </form>
      <div>
        <GoogleLogin
          onSuccess={({ credential }) => onGoogleLogin(credential as string)}
          theme="filled_black"
          locale="en"
          auto_select={false}
          shape="circle"
          size="large"
          width={googleButtonWidth()}
        />
      </div>
    </>
  );
};

export default Form;
