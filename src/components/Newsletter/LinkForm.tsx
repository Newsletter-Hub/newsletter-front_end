import { parseNewsletter } from '@/actions/newsletters';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMutation } from 'react-query';

import { zodResolver } from '@hookform/resolvers/zod';

import { NewsletterFormProps } from '@/types/newsletters';

import Button from '../Button';
import Input from '../Input';
import Link from 'next/link';

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
        author: response.newsletterAuthor,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
        Include a link to the homepage of the newsletter. Follow the format in
        the example below; prepend the full URL with &quot;https://&quot;.
        <br />
        <br />
        If you are the owner of the newsletter you are adding, you will be to
        claim the newsletter after it is added. Just locate the &quot;Claim
        Newsletter&quot; button on the newsletter page or find your newsletter
        on&nbsp;
        <Link href="/newsletters/claim" legacyBehavior passHref>
          <a target="_blank" rel="noopener noreferrer">
            this page.
          </a>
        </Link>
        <br />
        <br />
        In the event of an error, rest assured our team will be alerted. We will
        attempt to manually add the newsletter, and update you via email with
        the result. For any further inquiries, please don&apos;t hesitate to
        reach out to us at&nbsp;
        <Link href="mailto: team@newsletterhub.co">team@newsletterhub.co</Link>.
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
