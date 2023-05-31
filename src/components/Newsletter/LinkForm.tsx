import { newsletterVerifyOwnership } from '@/actions/newsletters';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchema> = async data => {
    setLoading(true);
    try {
      const response = await newsletterVerifyOwnership({ link: data.link });
      if (response && response.id) {
        setStep(step + 1);
        setPayload({
          ...payload,
          id: response.id,
          link: response.link,
          title: response.title,
          description: response.description,
          image: response.image,
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
        To add a newsletter, you should include a link to the homepage of the
        newsletter. Remember to insert the full URL with &quot;https://&quot;
        and &quot;.com&quot; in order to properly add your newsletters. Please
        ensure the grammar and formatting are correct when adding the URLs.
      </p>
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
      <Button
        label={loading ? 'Loading...' : 'Add'}
        size="full"
        rounded="xl"
        fontSize="md"
        type="submit"
        disabled={loading}
      />
    </form>
  );
};

export default LinkForm;
