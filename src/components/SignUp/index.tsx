import { googleAuth } from '@/actions/auth';
import { signup } from '@/actions/auth';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import { GoogleLogin } from '@react-oauth/google';

import Button from '../Button';
import Input from '../Input';
import { useWindowSize } from 'usehooks-ts';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { useUser } from '@/contexts/UserContext';

const validationSchema = z
  .object({
    username: z.string().min(1, { message: 'Username is required field' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Must be a valid email' }),
    password: z
      .string()
      .min(1, 'Password is required field')
      .max(30, 'Maximum length of password 30 symbols')
      .min(8, 'Minimum length of password 8 symbols'),
    confirm_password: z
      .string()
      .min(1, 'Password confirmation is required field'),
  })
  .refine(data => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type ValidationSchema = z.infer<typeof validationSchema>;

type Field = {
  placeholder: string;
  name: 'email' | 'password' | 'confirm_password' | 'username';
  isPassword?: boolean;
};

type SignUpProps = {
  setEmail: Dispatch<SetStateAction<string>>;
};

type Fields = Field[];

const fields: Fields = [
  { placeholder: 'Enter your username', name: 'username' },
  { placeholder: 'Enter your email address', name: 'email' },
  { placeholder: 'Enter your password', name: 'password', isPassword: true },
  {
    placeholder: 'Confirm password',
    name: 'confirm_password',
    isPassword: true,
  },
];

const SignUpForm = ({ setEmail }: SignUpProps) => {
  const router = useRouter();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const signUpMutation = useMutation(signup);
  const googleAuthMutation = useMutation(googleAuth);
  const onGoogleLogin = (token: string) => {
    googleAuthMutation.mutate({ token, router, setUser });
  };
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    email,
    password,
    username,
  }) => {
    const response = await signUpMutation.mutateAsync({
      email,
      password,
      username,
      router,
    });
    if (response) {
      setEmail(email);
    }
  };
  const { width } = useWindowSize();
  const googleButtonWidth = () => {
    if (width) {
      if (width >= 320 && width < 375) {
        return 300;
      } else if (width >= 375 && width < 768) {
        return 360;
      }
      return 400;
    }
    return 400;
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-7 items-center w-full"
    >
      {fields.map(field => (
        <Input
          register={{ ...register(field.name) }}
          variant="filled"
          placeholder={field.placeholder}
          key={field.name}
          error={Boolean(errors[field.name])}
          errorText={errors[field.name]?.message}
          isPassword={field.isPassword}
        />
      ))}
      <p className="font-inter text-sm text-dark-blue lg:hidden">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold">
          Login
        </Link>
      </p>
      <p className="font-inter text-sm text-start max-w-[395px] text-dark-blue">
        Creating an account means you agree to our{' '}
        <Link href="/terms" legacyBehavior passHref>
          <a
            target="_blank"
            className="font-semibold"
            rel="noopener noreferrer"
          >
            Terms & Conditions{' '}
          </a>
        </Link>
        and{' '}
        <Link href="/privacy" legacyBehavior passHref>
          <a
            target="_blank"
            className="font-semibold"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </Link>
      </p>
      <Button
        label="Signup"
        size="full"
        rounded="xl"
        type="submit"
        loading={signUpMutation.isLoading || googleAuthMutation.isLoading}
      />
      <GoogleLogin
        onSuccess={({ credential }) => onGoogleLogin(credential as string)}
        theme="filled_black"
        locale="en"
        auto_select={false}
        shape="circle"
        size="large"
        width={googleButtonWidth()}
      />
    </form>
  );
};

export default SignUpForm;
