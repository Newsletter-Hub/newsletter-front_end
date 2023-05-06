import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/Button';
import EntryLayout from '@/components/EntryLayout';
import Input from '@/components/Input';

import { forgotPassword } from '../api/auth';

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const onSubmit: SubmitHandler<ValidationSchema> = ({ email }) => {
    forgotPassword({ email });
  };
  return (
    <EntryLayout type="login">
      <div className="flex justify-center items-center">
        <div className="shadow-md rounded-3xl p-12">
          <p className="text-lightBlack text-5xl font-medium text-center mb-16">
            Forgot password
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8">
              <Input
                register={{ ...register('email') }}
                variant="filled"
                placeholder="Enter your email address"
                error={Boolean(errors.email)}
                errorText={errors.email?.message}
              />
            </div>
            <Button
              label="Send reset link"
              type="submit"
              size="full"
              rounded="xl"
              fontSize="md"
              customStyles="mb-8"
            />
            <span className="flex justify-center gap-3 font-inter text-base">
              Remembered password?{' '}
              <Link href="/login" className="font-semibold underline">
                Back to Login
              </Link>
            </span>
          </form>
        </div>
      </div>
    </EntryLayout>
  );
};

export default ForgotPassword;
