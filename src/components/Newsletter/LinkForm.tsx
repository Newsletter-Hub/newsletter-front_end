import { parseNewsletter } from '@/actions/newsletters';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutation } from 'react-query';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const mutation = useMutation(parseNewsletter);
  const onSubmit: SubmitHandler<ValidationSchema> = async data => {
    const response = await mutation.mutateAsync({ link: data.link });
    if (response) {
      setStep(step + 1);
      setPayload({
        ...payload,
        link: response.link,
        title: response.title,
        description: response.description,
        image: response.image,
      });
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
          placeholder="https://thehustle.co/"
          variant="filled"
          register={{ ...register('link') }}
          error={Boolean(errors.link)}
          errorText={errors.link?.message}
          defaultValue={payload.link}
        />
      </div>
      <Button
        label="Add"
        size="full"
        rounded="xl"
        fontSize="md"
        type="submit"
        loading={mutation.isLoading}
      />
    </form>
  );
};

export default LinkForm;
