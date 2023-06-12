import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterReport } from '@/actions/newsletters';
import { useRouter } from 'next/router';

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
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          variant="filled"
          size="full"
          label="Your report message"
          register={{ ...register('report') }}
          error={Boolean(errors.report)}
          errorText={errors.report?.message}
        />
        <Button label="Send" size="full" rounded="xl" type="submit" />
      </form>
    </Modal>
  );
};

export default ReportModal;
