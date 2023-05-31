import { changeEmail } from '@/actions/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { Alegreya } from 'next/font/google';

import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';

import { ModalProps } from './propsType';

const alegreya = Alegreya({ subsets: ['latin'] });

const validationSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required field')
    .max(30, 'Maximum length of password 30 symbols')
    .min(8, 'Minimum length of password 8 symbols'),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface VerifyEmailModalProps extends ModalProps {
  email: string;
}

const VerifyEmailModal = ({
  open,
  handleClose,
  email,
}: VerifyEmailModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit = async (data: ValidationSchema) => {
    await changeEmail({
      password: data.password,
      newEmail: email,
    }).then(res => {
      if (res?.ok) {
        setStep(2);
      }
    });
  };

  const modalTitleStyles = clsx(
    'text-lightBlack text-5xl mb-9 text-center font-medium',
    alegreya.className
  );
  const [step, setStep] = useState(1);
  return (
    <Modal open={open} handleClose={handleClose} size="sm">
      <div>
        {step === 1 ? (
          <>
            <h4 className={modalTitleStyles}>Confirm your password</h4>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <Input
                label="Your password"
                register={{ ...register('password') }}
                customStyles="w-full"
                variant="filled"
                isPassword
                error={Boolean(errors.password)}
                errorText={errors.password?.message}
              />
              <Button
                label="Send verification email"
                size="full"
                rounded="xl"
                height="sm"
                fontSize="base"
                type="submit"
              />
            </form>
          </>
        ) : (
          <>
            <h4 className={modalTitleStyles}>Verify your Email</h4>
            <p className="text-dark-blue text-base">
              You have requested to change your email. To confirm your email
              address, tap the button in the email we sent to{' '}
              <span className="font-medium">{email}</span>
            </p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default VerifyEmailModal;
