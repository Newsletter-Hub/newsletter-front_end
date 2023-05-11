import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import { NewsletterLinkResponse } from '@/pages/api/newsletters';
import {
  newsletterLink,
  newsletterVerifyOwnership,
} from '@/pages/api/newsletters';

import { NewsletterFormProps } from '@/types/newsletters';

import Button from '../Button';
import Input from '../Input';

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchema> = async data => {
    try {
      const response = await newsletterVerifyOwnership({ link: data.link });
      if (response && response.id) {
        console.log(response);
        router.push(`${response.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onAdd: SubmitHandler<ValidationSchema> = data => {
    newsletterLink({ link: data.link })
      .then((response: NewsletterLinkResponse | undefined) => {
        if (response) {
          setStep(step + 1);
          setPayload({ ...payload, id: response.id, link: response.link });
        }
      })
      .catch(error => console.error(error));
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
        Link a Newsletter
      </p>
      <div className="mb-8">
        <Input
          placeholder="http://"
          variant="filled"
          register={{ ...register('link') }}
          error={Boolean(errors.link)}
          errorText={errors.link?.message}
        />
      </div>
      <div className="flex w-full gap-4">
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
