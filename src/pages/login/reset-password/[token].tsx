import { resetPassword } from '@/actions/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@/components/Button';
import Input from '@/components/Input';

const validationSchema = z
  .object({
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

const ResetPassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = ({ password }) => {
    resetPassword({
      newPassword: password,
      resetPasswordToken: router.query.token,
      router,
    });
  };
  return (
    <div className="flex justify-center items-center">
      <div className="md:shadow-md rounded-3xl md:p-12 pt-6">
        <p className="text-lightBlack text-5xl font-medium text-center mb-16">
          Reset password
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-8">
            <div className="mb-8">
              <Input
                register={{ ...register('password') }}
                variant="filled"
                placeholder="Enter password"
                error={Boolean(errors.password)}
                errorText={errors.password?.message}
                label="Enter your new password"
                isPassword
              />
            </div>
            <Input
              register={{ ...register('confirm_password') }}
              variant="filled"
              placeholder="Repeat password"
              error={Boolean(errors.confirm_password)}
              errorText={errors.confirm_password?.message}
              label="Repeat your new password"
              isPassword
            />
          </div>
          <Button
            label="Save"
            type="submit"
            size="full"
            rounded="xl"
            fontSize="md"
          />
        </form>
      </div>
    </div>
  );
};

ResetPassword.layout = 'entry';

export default ResetPassword;
