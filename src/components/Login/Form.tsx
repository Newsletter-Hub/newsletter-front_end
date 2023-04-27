import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import Link from 'next/link';
import { login, googleAuth } from '@/pages/api/auth';
import { useRouter } from 'next/router';
import { useGoogleLogin } from '@react-oauth/google';

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
  const googleLogin = useGoogleLogin({
    onSuccess: ({ access_token }) => googleAuth({ token: access_token }),
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const router = useRouter();
  const onSubmit: SubmitHandler<ValidationSchema> = ({ email, password }) => {
    login({ email, password, router });
  };
  const isErrors = Boolean(Object.keys(errors).length);
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-7 items-center"
      >
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
        <Button
          label="Login"
          uppercase
          size="full"
          rounded="xl"
          disabled={isErrors}
          type="submit"
        />
        <Link
          href="forgot-password"
          className="underline text-base text-grey mb-2"
        >
          Forgot password?
        </Link>
      </form>
      <Button
        label="Google"
        size="full"
        rounded="xl"
        weight="bold"
        uppercase
        socialMedia="google"
        onClick={() => googleLogin()}
      />
    </>
  );
};

export default Form;
