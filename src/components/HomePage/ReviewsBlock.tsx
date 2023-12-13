import { createReview, getReviews } from '@/actions/newsletters/reviews';
import timeAgo from '@/helpers/timeAgo';
import { useState } from 'react';

import Link from 'next/link';

import { ReviewResponse } from '@/types/newsletters';

import Button from '../Button';
import StarRating from '../StarRating';
import { addToBookmark } from '@/actions/newsletters/bookmarks';
import BookmarkPlusIcon from '@/assets/icons/bookmarkPlus';
import { useUser } from '@/contexts/UserContext';
import StarIcon from '@/assets/icons/star';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useMutation } from 'react-query';
import ReviewModal from '../Modals/ReviewModal';
import SkeletonImage from '../SkeletonImage';

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
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const loadMore = async () => {
    setLoading(true);
    setPage(prevPage => prevPage + 1);

    const response = await getReviews({
      page: 1,
      pageSize: 5 * (page + 1),
    });

    if (response.reviews) {
      setReviewsInfo(response.reviews);
      setLoading(false);
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
    reset,
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const reviewMutation = useMutation(createReview);
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rating,
    comment,
  }) => {
    if (isOpenReviewModal) {
      const response = await reviewMutation.mutateAsync({
        rating,
        comment,
        newsletterId: isOpenReviewModal as number,
      });
      if (!response.error) {
        const response = await getReviews({
          page: 1,
          pageSize: 5 * (page + 1),
        });

        if (response.reviews) {
          setReviewsInfo(response.reviews);
          setIsOpenReviewModal(false);
          reset();
        }
      } else {
        setIsOpenReviewModal(false);
        reset();
      }
    }
  };
  if (!reviewsInfo) {
    return <span>Failed to get reviews</span>;
  }
  return (
    <div className="mb-24">
      <div className="flex flex-col">
        <h4 className="md:text-5xl text-dark-blue text-2xl">Latest Reviews</h4>
        <div className="mb-10">
          {reviewsInfo.reviews.map((review, index) => (
            <div
              className={`${
                index + 1 !== reviewsInfo.reviews.length && 'border-b'
              } border-light-grey py-8 w-full`}
              key={review.id}
            >
              <div className="flex items-center">
                <SkeletonImage
                  src={
                    review.newsletter.image ||
                    'https://i.imgur.com/kZMNj7Q.jpeg'
                  }
                  alt="latest"
                  style={{ width: 96, height: 96 }}
                  width={96}
                  height={96}
                  className="rounded-[5px] h-[96px] w-[96px] object-cover object-center"
                />
                <div className="flex md:items-start flex-col md:flex-row ml-8">
                  <div className="mr-4 md:w-[250px]">
                    <Link
                      href={`/newsletters/${review.newsletter.id}`}
                      className="block max-w-[650px] whitespace-nowrap text-ellipsis overflow-hidden text-lightBlack font-medium text-xl mb-2 cursor-pointer"
                    >
                      {review.newsletter.title}
                    </Link>
                    <p className="text-base text-dark-grey font-inter mb-2 max-w-[150px] xs:max-w-[300px] overflow-hidden text-ellipsis">
                      reviewed by&nbsp;
                      <Link
                        href={`/users/${review.reviewer.id}`}
                        className="text-base text-dark-grey font-inter"
                      >
                        {review.reviewer.username}
                      </Link>
                    </p>
                    <StarRating
                      readonly
                      value={review.rating}
                      customStyles="mb-2"
                    />
                    <p className="text-xs text-grey-chat font-inter">
                      {timeAgo(review.createdAt)}
                    </p>
                  </div>
                  <p className="md:text-base mb-8 pt-1 font-inter text-dark-blue text-sm block max-w-[160px] xs:max-w-[230px] sm:max-w-[280px] whitespace-nowrap md:whitespace-normal overflow-hidden text-ellipsis lg:max-w-[600px] lg:whitespace-normal lg:overflow-auto">
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
                      <ReviewModal
                        review={review}
                        register={register}
                        open={Boolean(
                          isOpenReviewModal === review.newsletter.id
                        )}
                        handleClose={() => {
                          setIsOpenReviewModal(false);
                        }}
                        setValue={setValue}
                        errors={errors}
                        loading={reviewMutation.isLoading}
                        onSubmit={handleSubmit(onSubmit)}
                      />
                    </div>
                  </div>
                )}
                <Link href={review.newsletter.link} legacyBehavior passHref>
                  <a target="_blank" rel="noopener noreferrer">
                    <Button
                      label="Read Newsletter"
                      rounded="xl"
                      fontSize="md"
                    />
                  </a>
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
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewsBlock;
