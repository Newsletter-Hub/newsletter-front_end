import { createReview, getReviews } from '@/actions/newsletters/reviews';
import timeAgo from '@/helpers/timeAgo';
import { useState } from 'react';

import Link from 'next/link';

import { ReviewResponse } from '@/types/newsletters';

import Image from 'next/image';
import Button from '../Button';
import StarRating from '../StarRating';
import { addToBookmark } from '@/actions/newsletters/bookmarks';
import BookmarkPlusIcon from '@/assets/icons/bookmarkPlus';
import { useUser } from '@/contexts/UserContext';
import StarIcon from '@/assets/icons/star';
import Modal from '../Modal';
import Avatar from '../Avatar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import Input from '../Input';

interface ReviewsBlockProps {
  reviewData: ReviewResponse;
}

const validationSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }),
  comment: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const ReviewsBlock = ({ reviewData }: ReviewsBlockProps) => {
  const [reviewsInfo, setReviewsInfo] = useState<ReviewResponse>(reviewData);
  const [isOpenReviewModal, setIsOpenReviewModal] = useState<boolean | number>(
    false
  );
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const loadMore = async () => {
    setPage(prevPage => prevPage + 1);

    const response = await getReviews({
      page: 1,
      pageSize: 5 * (page + 1),
    });

    if (response.reviews) {
      setReviewsInfo(response.reviews);
    }
  };
  const handleAddBookmark = async (id: number) => {
    await addToBookmark({ newsletterId: id });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rating,
    comment,
  }) => {
    if (isOpenReviewModal) {
      await createReview({
        rating,
        comment,
        newsletterId: isOpenReviewModal as number,
      });
      setIsOpenReviewModal(false);
    }
  };
  if (!reviewsInfo) {
    return <span>Failed to get reviews</span>;
  }
  return (
    <div className="mb-24">
      <div className="flex flex-col">
        <h4 className="md:text-5xl text-dark-blue text-2xl">Latest reviews</h4>
        <div className="mb-10">
          {reviewsInfo.reviews.map((review, index) => (
            <div
              className={`${
                index + 1 !== reviewData.reviews.length && 'border-b'
              } border-light-grey py-8 w-full`}
              key={review.id}
            >
              <div className="flex items-center">
                <Image
                  src={
                    review.newsletter.image ||
                    'https://i.imgur.com/kZMNj7Q.jpeg'
                  }
                  alt="latest"
                  width={96}
                  height={96}
                  className="rounded-[5px] mr-8 h-[96px] w-[96px] object-cover object-center"
                />
                <div className="flex md:items-start flex-col md:flex-row">
                  <div className="mr-4 min-w-[160px]">
                    <p className="text-xl text-dark-blue">
                      {review.newsletter.title}
                    </p>
                    <Link
                      href={`/users/${review.reviewer.id}`}
                      className="text-base text-dark-grey font-inter mb-2"
                    >
                      {review.reviewer.username}
                    </Link>
                    <StarRating
                      readonly
                      value={review.rating}
                      customStyles="mb-2"
                    />
                    <p className="text-xs text-grey-chat font-inter">
                      {timeAgo(review.createdAt)}
                    </p>
                  </div>
                  <p className="md:text-base mb-8 font-inter text-dark-blue text-sm block max-w-[160px] xs:max-w-[230px] sm:max-w-[280px] whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[600px] lg:whitespace-normal lg:overflow-auto">
                    {review.comment}
                  </p>
                </div>
              </div>
              <div className="flex justify-end items-center w-full gap-10">
                {user && (
                  <div className="flex gap-6">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleAddBookmark(review.newsletter.id)}
                    >
                      <BookmarkPlusIcon />
                    </div>
                    <div
                      onClick={() => setIsOpenReviewModal(review.newsletter.id)}
                    >
                      <StarIcon className="stroke-lightBlack stroke-[1.5px] cursor-pointer" />
                      <Modal
                        open={Boolean(
                          isOpenReviewModal === review.newsletter.id
                        )}
                        handleClose={() => {
                          setIsOpenReviewModal(false);
                        }}
                      >
                        <div>
                          <div className="flex gap-6 border-b border-b-light-grey pb-6 mb-6">
                            <Avatar
                              src={
                                review.newsletter?.addedByUser?.avatar as string
                              }
                              alt="avatar"
                              width={112}
                              height={112}
                              className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
                              username={
                                review.newsletter?.addedByUser?.username
                              }
                              customStyles="max-h-[112px] min-w-[112px]"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-lightBlack text-xl mb-3">
                                {review.newsletter?.newsletterAuthor}
                              </span>
                              <div className="flex items-center mb-3">
                                <StarRating
                                  readonly
                                  value={
                                    review.newsletter?.addedByUser
                                      ?.averageUserRating
                                  }
                                  customStyles="mr-2"
                                />
                                <span className="font-inter text-dark-grey text-sm mr-6">
                                  {
                                    review.newsletter?.addedByUser
                                      ?.amountUserRatings
                                  }
                                </span>
                                <span className="font-inter text-sm text-dark-grey">
                                  <span className="font-bold">207</span>{' '}
                                  Followers
                                </span>
                              </div>
                              <span className="font-inter text-sm text-dark-grey">
                                {review.newsletter.addedByUser?.description}
                              </span>
                            </div>
                          </div>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex gap-4 items-center mb-14">
                              <span className="text-lightBlack font-semibold text-lg font-inter">
                                Your rating
                              </span>
                              <StarRating
                                error={Boolean(errors.rating)}
                                errorText={errors.rating?.message}
                                setValue={(index: number) =>
                                  setValue('rating', index)
                                }
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
                              />
                            </div>
                          </form>
                        </div>
                      </Modal>
                    </div>
                  </div>
                )}
                <Link href={`newsletters/${review.newsletter.id}`}>
                  <Button label="Read Newsletter" rounded="xl" fontSize="md" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        {reviewsInfo.nextPage && (
          <Button
            label="See More"
            variant="outlined-secondary"
            size="full"
            rounded="xl"
            bold
            onClick={loadMore}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewsBlock;
