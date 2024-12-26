import { useForm, SubmitHandler } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { cancelSubscription } from '@/actions/paymentSubscription/index';

import Modal from '../Modal';
import Input from '../Input';
import Button from '../Button';

interface ReviewModalProps {
  open: boolean;
  handleClose: () => void;
  token: null | string;
}

const validationSchema = z.object({
  comment: z.string().min(10, { message: 'Min. length 10 chars' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const CancelSubscriptionModal = ({
  open,
  handleClose,
  token,
}: ReviewModalProps) => {
  const reviewMutation = useMutation(cancelSubscription);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = async data => {
    const response = await reviewMutation.mutateAsync({
      reason: data.comment,
      token,
    });

    const isSuccess = response.response?.isSuccess;

    if (isSuccess) {
      toast.success('Subscription successfully canceled!');
    } else {
      toast.error('Subscription was not canceled! Please, tty again!');
    }

    handleClose();
  };

  return (
    <Modal open={open} handleClose={handleClose} spacing="sm">
      <div className="pt-10 md:pt-0">
        <p>
          Are you certain you wish to cancel your subscription to Newsletters
          Hub Pro? Once confirmed, your subscription will be automatically
          terminated at the end of the paid period.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-7">
            <Input
              variant="filled"
              placeholder="Enter reason, please"
              customStyles="!w-full"
              register={{ ...register('comment') }}
              error={Boolean(errors.comment)}
              errorText={errors.comment?.message}
            />

            <div className="flex gap-x-4">
              <Button
                label="Cancel"
                size="full"
                rounded="xl"
                height="sm"
                onClick={handleClose}
              />
              <Button
                label="Confirm"
                type="submit"
                size="full"
                rounded="xl"
                height="sm"
                // loading={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModal;
