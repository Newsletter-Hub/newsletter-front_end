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
    .min(1, { message: 'Please enter a url' })
    .url({ message: 'Please enter a valid url' }),
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
    setError,
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
    } else {
      setError('link', {
        type: 'manual',
        message: 'Newsletter will need to be manually added',
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
        Include a link to the homepage of the newsletter. Follow the format in
        the example below; insert the full URL with &quot;https://&quot; and
        &quot;.com&quot;.
        <br />
        If you get a &quot;Newsletter will need to be manually added&quot;
        error, we had an issue verifying the newsletter. Our team will try to
        manually add it, and email you on the result of the request.
      </p>
      <p className="text-xs font-semibold text-lightDark mb-2 font-inter">
        Link a Newsletter
      </p>
      <div className="mb-8">
        <Input
          placeholder="https://thehustle.co/"
          variant="filled"
          register={{ ...register('link') }}
          defaultValue={payload.link}
          error={Boolean(errors.link)}
          errorText={errors.link?.message}
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
