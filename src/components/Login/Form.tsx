import { useForm, SubmitHandler } from 'react-hook-form';
import Input from '../Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../Button';
import Link from 'next/link';
import TwitterIcon from '@/assets/icons/twitter';

const validationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z.string().min(1, 'Password is required field'),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = data => console.log(data);
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
        />
      ))}
      <Button label="Login" uppercase size="full" rounded="xl" disabled />
      <Link
        href="forgot-password"
        className="underline text-base text-grey mb-11"
      >
        Forgot password?
      </Link>
      <Button
        label="TWITTER"
        size="full"
        rounded="xl"
        weight="bold"
        StartIcon={TwitterIcon}
      />
    </form>
  );
};

export default Form;
