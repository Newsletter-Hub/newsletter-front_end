import { NewsletterData, Review } from '@/types/newsletters';
import Modal from '../Modal';
import Image from 'next/image';
import StarRating from '../StarRating';
import Input from '../Input';
import Button from '../Button';
import { FormEventHandler } from 'react';
import { UseFormRegister, FieldPath } from 'react-hook-form';

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
  onDelete: () => void;
}

const EditReviewModal = ({
  review,
  open,
  handleClose,
  onSubmit,
  errors,
  loading,
  register,
  setValue,
  newsletter,
  onDelete
}: ReviewModalProps) => {
  const data = review?.newsletter || newsletter;
  if (!data) {
    return null;
  }
  return (
    <Modal open={open} handleClose={handleClose} spacing="sm">
      <div className="pt-10 md:pt-0">
        <div className="flex flex-col md:flex-row gap-6 border-b border-b-light-grey md:pb-6 pb-3 md:mb-6 mb-3">
          <Image
            src={data.image || 'https://i.imgur.com/kZMNj7Q.jpeg'}
            alt="avatar"
            width={96}
            height={96}
            className="rounded-[5px] md:h-[96px] md:w-[96px] object-cover object-center w-full"
          />
          <div className="flex flex-col">
            <span className="font-medium text-lightBlack text-xl mb-3">
              {data.title}
            </span>
            <div className="flex md:items-center mb-3 flex-col md:flex-row">
              <div className="flex items-center mb-2 md:mb-0">
                <StarRating
                  readonly
                  value={data.averageRating}
                  customStyles="mr-2"
                />
                <span className="font-inter text-dark-grey text-sm mr-6">
                  {data.amountFollowers}
                </span>
              </div>
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
          <div className="flex gap-4 items-center md:mb-14 mb-5 flex-col md:flex-row">
            <span className="text-lightBlack font-semibold text-lg font-inter">
              Your rating
            </span>
            <StarRating
              error={Boolean(errors.rating)}
              errorText={errors.rating?.message}
              setValue={(index: number) => setValue('rating', index)}
              value={review?.rating}
            />
          </div>
          <Input
            variant="filled"
            placeholder={
              review?.comment !== '' ? '' : 'Go ahead, we are listening...'
            }
            defaultValue={
              review?.comment ? review.comment : 'Go ahead, we are listening...'
            }
            customStyles="mb-9 !w-full"
            register={{ ...register('comment') }}
          />
          <div className="flex justify-around">
            <Button
              label="Edit"
              type="submit"
              size="full"
              customStyles="max-w-[200px]"
              rounded="xl"
              height="sm"
              loading={loading}
            />
            <Button
              label="Delete"
              type="button"
              onClick={onDelete}
              size="full"
              customStyles="max-w-[200px]"
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

export default EditReviewModal;
