import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../Input';
import Button from '../Button';
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import { NewsletterFormProps } from '@/assets/types/newsletters';

const inter = Inter({ subsets: ['latin'] });

const validationSchema = z.object({
  link: z
    .string()
    .min(1, { message: 'Please entry link' })
    .url({ message: 'Prease write valid url' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const LinkForm = ({
  setPayload,
  payload,
  setStep,
  step,
}: NewsletterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    console.log(data);
  };
  const onAdd: SubmitHandler<ValidationSchema> = data => {
    console.log(data);
    setStep(step + 1);
    setPayload({ ...payload, link: data.link });
  };
  const labelStyles = clsx(
    'text-xs font-semibold text-cornflower-blue mb-2',
    inter.className
  );
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className={labelStyles}>Link a Newsletter</p>
      <div className="mb-8">
        <Input
          placeholder="http://"
          variant="filled"
          register={{ ...register('link') }}
          error={Boolean(errors.link)}
          errorText={errors.link?.message}
        />
      </div>
      <div className="flex w-full gap-4 mb-8">
        <Button
          label="Verify Ownership"
          size="full"
          rounded="xl"
          type="submit"
          variant="outlined-primary"
          fontSize="md"
        />
        <Button
          label="Add"
          size="full"
          rounded="xl"
          fontSize="md"
          onClick={handleSubmit(onAdd)}
        />
      </div>
    </form>
  );
};

export default LinkForm;
