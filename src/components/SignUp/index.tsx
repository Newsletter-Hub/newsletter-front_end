import { useContext, Dispatch, SetStateAction } from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserContext } from '@/pages/sign-up';
import { Payload } from '@/assets/types/signup-types';

import Button from '../Button';
import Input from '../Input';

interface SignUpFormProps {
  payload: object;
  setPayload: Dispatch<SetStateAction<Payload>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

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

const SignUpForm = ({
  setPage,
  setPayload,
  page,
  payload,
}: SignUpFormProps) => {
  const user = useContext(UserContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: user.email,
      password: user.password,
      confirm_password: user.confirm_password,
      username: user.username,
    },
  });
  const onSubmit: SubmitHandler<Payload> = data => {
    setPayload({
      ...payload,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      username: data.username,
    });
    setPage(page + 1);
  };
  const isErrors = Boolean(Object.keys(errors).length);
  return (
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
          isPassword={field.isPassword}
        />
      ))}
      <Button
        label="Next"
        uppercase
        size="full"
        rounded="xl"
        disabled={isErrors}
        type="submit"
      />
    </form>
  );
};

export default SignUpForm;
