import Modal from '../Modal';
import TextArea from '../TextArea';
import Button from '../Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterReport } from '@/actions/newsletters';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { Alegreya } from 'next/font/google';

const alegreya = Alegreya({ subsets: ['latin'] });

interface ReportModalProps {
  open: boolean;
  handleClose: () => void;
}

const validationSchema = z.object({
  report: z.string().min(1, { message: 'Report message is required' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const ReportModal = ({ open, handleClose }: ReportModalProps) => {
  const router = useRouter();
  const modalTitleStyles = clsx(
    'text-dark-blue text-4xl mb-8 font-medium',
    alegreya.className
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    const newsletterId = Number(router.query.newsletterId);
    newsletterReport({ report: data.report, newsletterId });
    handleClose();
  };
  return (
    <Modal open={open} handleClose={handleClose}>
      <>
        <div className="flex flex-col items-center">
          <h4 className={modalTitleStyles}>Report this Newsletter</h4>
          <p className="text-start max-w-[395px] font-inter text-sm mb-4 text-dark-blue">
            Please let us know if this newsletter is inappropriate, not a
            newsletter, a duplicate, or anything else that our team should take
            a look at. If our team finds that this newsletter is against our
            policies, we will remove it.
          </p>
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextArea
              variant="filled"
              label="Your report message"
              register={{ ...register('report') }}
              error={Boolean(errors.report)}
              errorText={errors.report?.message}
            />
            <Button label="Send" size="full" rounded="xl" type="submit" />
          </form>
        </div>
      </>
    </Modal>
  );
};

export default ReportModal;
