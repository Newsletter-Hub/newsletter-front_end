import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

import { Alegreya } from 'next/font/google';
import Link from 'next/link';

import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';

import { ModalProps } from './propsType';

const alegreya = Alegreya({ subsets: ['latin'] });

const validationSchema = z
  .object({
    old_password: z
      .string()
      .min(1, 'Old password is required field')
      .max(30, 'Maximum length of password 30 symbols')
      .min(8, 'Minimum length of password 8 symbols'),
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

const ChangePasswordModal = ({ open, handleClose }: ModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    console.log(data);
  };
  const modalTitleStyles = clsx(
    'text-dark-blue text-5xl mb-9 font-medium',
    alegreya.className
  );
  return (
    <Modal open={open} handleClose={handleClose} size="sm">
      <div className="flex flex-col items-center">
        <h4 className={modalTitleStyles}>Change password</h4>
        <form
          className="flex flex-col items-center gap-9"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            variant="filled"
            placeholder="Enter your old password"
            register={{ ...register('old_password') }}
            error={Boolean(errors.old_password)}
            errorText={errors.old_password?.message}
          />
          <Link
            href="/login/forgot-password"
            className="text-dark-blue text-base font-semibold border-b border-b-dark-blue"
          >
            Forgot password?
          </Link>
          <Input
            variant="filled"
            label="Enter your new password"
            isPassword
            register={{ ...register('password') }}
            error={Boolean(errors.password)}
            errorText={errors.password?.message}
          />
          <Input
            variant="filled"
            label="Repeat your new password"
            isPassword
            register={{ ...register('confirm_password') }}
            error={Boolean(errors.confirm_password)}
            errorText={errors.confirm_password?.message}
          />
          <Button
            label="Change password"
            rounded="xl"
            fontSize="base"
            size="full"
            type="submit"
          />
        </form>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
