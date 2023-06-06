import { NewsletterData, Review } from '@/types/newsletters';
import Modal from '../Modal';
import Image from 'next/image';
import StarRating from '../StarRating';
import Input from '../Input';
import Button from '../Button';
import { FormEventHandler } from 'react';
import { FieldValues, UseFormRegister, FieldPath } from 'react-hook-form';

interface ReviewErrors {
  rating?: {
    message?: string;
  };
}

interface FormValues {
  comment: string;
  rating: number;
}

interface ReviewModalProps {
  review?: Review;
  newsletter?: NewsletterData;
  open: boolean;
  handleClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  errors: ReviewErrors;
  loading: boolean;
  register: UseFormRegister<FormValues>;
  setValue: (
    name: FieldPath<FormValues>,
    value: FormValues[keyof FormValues],
    options?: Partial<{ shouldValidate: boolean; shouldDirty: boolean }>
  ) => void;
}

const ReviewModal = ({
  review,
  open,
  handleClose,
  onSubmit,
  errors,
  loading,
  register,
  setValue,
  newsletter,
}: ReviewModalProps) => {
  const data = review?.newsletter || newsletter;
  if (!data) {
    return null;
  }
  return (
    <Modal open={open} handleClose={handleClose}>
      <div>
        <div className="flex gap-6 border-b border-b-light-grey pb-6 mb-6">
          <Image
            src={data.image || 'https://i.imgur.com/kZMNj7Q.jpeg'}
            alt="avatar"
            width={96}
            height={96}
            className="rounded-[5px] h-[96px] w-[96px] object-cover object-center"
          />
          <div className="flex flex-col">
            <span className="font-medium text-lightBlack text-xl mb-3">
              {data.title}
            </span>
            <div className="flex items-center mb-3">
              <StarRating
                readonly
                value={data.averageRating}
                customStyles="mr-2"
              />
              <span className="font-inter text-dark-grey text-sm mr-6">
                {data.amountFollowers}
              </span>
              <span className="font-inter text-sm text-dark-grey">
                <span className="font-bold">{data.amountFollowers}</span>{' '}
                Followers
              </span>
            </div>
            <span className="font-inter text-sm text-dark-grey">
              {data.description}
            </span>
          </div>
        </div>
        <form onSubmit={onSubmit}>
          <div className="flex gap-4 items-center mb-14">
            <span className="text-lightBlack font-semibold text-lg font-inter">
              Your rating
            </span>
            <StarRating
              error={Boolean(errors.rating)}
              errorText={errors.rating?.message}
              setValue={(index: number) => setValue('rating', index)}
            />
          </div>
          <Input
            variant="filled"
            placeholder="Go ahead, we are listening..."
            customStyles="mb-9 !w-full"
            register={{ ...register('comment') }}
          />
          <div className="flex justify-center">
            <Button
              label="Add"
              type="submit"
              size="full"
              customStyles="max-w-[400px]"
              rounded="xl"
              height="sm"
              loading={loading}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewModal;
