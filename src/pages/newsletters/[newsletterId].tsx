import { useUser } from '@/contexts/UserContext';
import timeAgo from '@/helpers/timeAgo';
import { FollowingPayload } from '@/types';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import { NewsletterData } from '@/types/newsletters';
import { GetReviewResponse, ReviewResponse } from '@/types/newsletters';
import { UserMe } from '@/types/user';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import StarRating from '@/components/StarRating';

import ArrowLeft from '@/assets/icons/arrowLeft';
import BookmarkIcon from '@/assets/icons/bookmark';
// import ListIcon from '@/assets/icons/list';
import PlusIcon from '@/assets/icons/plus';

import {
  addToBookmark,
  deleteBookmark,
} from '../../actions/newsletters/bookmarks';
import {
  GetNewsletterResponse,
  follow,
  getNewsletter,
  unfollow,
} from '../../actions/newsletters/index';
import { createReview, getReviews } from '../../actions/newsletters/reviews';
import { useMutation } from 'react-query';
import ReviewModal from '@/components/Modals/ReviewModal';
import SkeletonImage from '@/components/SkeletonImage';
import EmailLink from '@/components/EmailLink';

interface NewsletterPageProps {
  newsletterData?: NewsletterData;
  reviews?: ReviewResponse;
  isBookmark?: 'none' | 'unauthorized' | 'added';
}

const validationSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }),
  comment: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const NewsletterPage = ({ newsletterData, reviews }: NewsletterPageProps) => {
  const [newsletter, setNewsletter] = useState(newsletterData);
  const [reviewsData, setReviewsData] = useState(reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const { user } = useUser();
  const router = useRouter();
  const handleOpenModal = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      router.push('/sign-up');
    }
  };
  const reviewMutation = useMutation(createReview);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rating,
    comment,
  }) => {
    if (router.query.newsletterId) {
      const response = await reviewMutation.mutateAsync({
        rating,
        comment,
        newsletterId: +router.query.newsletterId,
      });

      if (!response?.error) {
        const reviewsResponse: GetReviewResponse = await getReviews({
          newsletterId: parseInt(router.query.newsletterId as string),
          page: 1,
          pageSize: 5 * page,
        });

        if (reviewsResponse.error) {
          console.error(reviewsResponse.error);
        } else {
          setIsModalOpen(false);
          setReviewsData(reviewsResponse.reviews);
        }
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleAddBookmark = async () => {
    if (router.query.newsletterId) {
      const response = await addToBookmark({
        newsletterId: router.query.newsletterId as string,
      });
      if (response.bookmark) {
        const newsletterResponse = await getNewsletter({
          id: +router.query.newsletterId,
        });
        if (newsletterResponse.newsletterData) {
          setNewsletter(newsletterResponse.newsletterData);
        }
      }
    }
  };

  const handleDeleteBookmark = async () => {
    if (router.query.newsletterId) {
      const response = await deleteBookmark({
        newsletterId: router.query.newsletterId as string,
      });
      if (response.isDeleted) {
        const newsletterResponse = await getNewsletter({
          id: +router.query.newsletterId,
        });
        if (newsletterResponse.newsletterData) {
          setNewsletter(newsletterResponse.newsletterData);
        }
      }
    }
  };

  const handleBookmarkClick = ({
    isInBookmarks,
  }: {
    isInBookmarks: boolean;
  }) => {
    if (user) {
      !isInBookmarks ? handleAddBookmark() : handleDeleteBookmark();
    } else {
      router.push('/sign-up');
    }
  };

  const handleFollow = async ({ entityId, followed }: FollowingPayload) => {
    if (!user) {
      router.push('/sign-up');
    } else {
      if (followed) {
        const response = await unfollow({ entityId, entityType: 'Newsletter' });
        if (response?.ok) {
          const response = await getNewsletter({
            id: entityId,
          });
          if (response.newsletterData) {
            setNewsletter(response.newsletterData);
          }
        }
      } else {
        const response = await follow({ entityId, entityType: 'Newsletter' });
        if (response?.ok) {
          const response = await getNewsletter({ id: entityId });
          if (response.newsletterData) {
            setNewsletter(response.newsletterData);
          }
        }
      }
    }
  };

  const loadMoreReviews = async () => {
    setPage(prevPage => prevPage + 1);

    const reviewsResponse: GetReviewResponse = await getReviews({
      newsletterId: parseInt(router.query.newsletterId as string),
      page: 1,
      pageSize: 5 * (page + 1),
    });

    if (reviewsResponse.error) {
      console.error(reviewsResponse.error);
    } else {
      setReviewsData(reviewsResponse.reviews);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    reset();
  };

  if (!reviewsData || !newsletter) {
    return <Loading />;
  }
  return (
    <div className="flex justify-center items-center flex-col pt-20 px-5">
      <div className="!max-w-[1280px]">
        <div className="flex justify-between items-center mb-[52px]">
          <Link
            href="/newsletters/categories/all"
            className="flex items-center gap-[18px]"
          >
            <ArrowLeft className="stroke-dark-blue" />
            <span className="font-inter border-b-2 border-primary text-lightBlack font-semibold text-lg transition-colors duration-200 ease-in-out hover:text-primary">
              Back to all newsletters
            </span>
          </Link>
          <div className="flex gap-2">
            <Link href={user ? '/newsletters/add' : '/sign-up'}>
              <Button
                label="Add Newsletter"
                rounded="xl"
                customStyles="w-full md:w-fit"
              />
            </Link>
            <EmailLink
              email="jacky@newsletterhub.co"
              subject={newsletter.title as string}
            >
              <Button label="Report" rounded="xl" />
            </EmailLink>
          </div>
        </div>
        <h1 className="text-lightBlack text-7xl font-medium mb-10">
          {newsletter?.title}
        </h1>
        {newsletter?.image && (
          <SkeletonImage
            src={newsletter.image}
            width={1280}
            height={678}
            alt="banner"
            className="w-full h-auto mb-6"
          />
        )}
        {Boolean(newsletter?.interests?.length) && (
          <div className="flex gap-2 mb-10">
            {newsletter?.interests?.map(interest => (
              <span
                key={interest.id}
                className="bg-primary/10 text-primary rounded-lg py-2 px-3.5 font-inter text-base"
              >
                {interest.interestName}
              </span>
            ))}
          </div>
        )}
        {newsletter?.description && (
          <p className="font-inter text-dark-grey text-lg mb-10">
            {newsletter?.description}
          </p>
        )}
        <div className="flex gap-2 pb-10 border-b border-light-grey mb-10">
          {newsletter?.link && (
            <Link href={newsletter.link} legacyBehavior passHref>
              <a target="_blank" rel="noopener noreferrer">
                <Button
                  label="Read Newsletter"
                  rounded="xl"
                  fontSize="md"
                  height="sm"
                />
              </a>
            </Link>
          )}
          <Button
            rounded="xl"
            fontSize="md"
            height="sm"
            onClick={() =>
              handleFollow({
                entityId: newsletter.id,
                followed: newsletter.isFollower,
              })
            }
            variant={newsletter.isFollower ? 'outlined-secondary' : 'primary'}
            label={
              newsletter.isFollower ? (
                'Following'
              ) : (
                <span className="flex items-center gap-2">
                  <PlusIcon />
                  Follow
                </span>
              )
            }
          />
        </div>
        <div className="flex justify-between font-inter items-center mb-20">
          <div className="flex gap-6 items-center">
            {newsletter?.averageDuration && (
              <>
                <p className="text-sm text-dark-grey">
                  <span className="font-semibold">
                    {newsletter?.averageDuration} min
                  </span>{' '}
                  read
                </p>
                <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
              </>
            )}
            {newsletter?.pricing && (
              <>
                <span className="text-sm text-dark-grey font-semibold">
                  {newsletter.pricing.charAt(0).toUpperCase() +
                    newsletter.pricing.slice(1)}
                </span>
                <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
              </>
            )}
            <div className="flex gap-2 items-center">
              <StarRating readonly value={newsletter?.averageRating} />
              <span className="font-inter text-sm text-dark-grey">
                <span className="font-semibold">
                  {newsletter?.amountRatings} people
                </span>{' '}
                rated this newsletter
              </span>
            </div>
          </div>
          <div className="flex gap-10">
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() =>
                handleBookmarkClick({ isInBookmarks: newsletter.isInBookmarks })
              }
            >
              <BookmarkIcon
                className={`${newsletter.isInBookmarks && 'fill-dark-blue'}`}
              />
              <span className="font-inter text-sm text-dark-grey">
                {newsletter.isInBookmarks ? 'Bookmarked' : 'Add to bookmarks'}
              </span>
            </div>
            {/* logic on future */}
            {/* <div className="flex gap-2 cursor-pointer">
              <ListIcon />
              <span className="font-inter text-sm text-dark-grey">
                Add to list
              </span>
            </div> */}
          </div>
        </div>
        <h2 className="text-lightBlack text-5xl font-medium mb-8">
          Latest Reviews
        </h2>
        <Button
          label="Add you review"
          rounded="xl"
          height="sm"
          fontSize="md"
          customStyles="!px-8 mb-8"
          onClick={handleOpenModal}
        />
        <ReviewModal
          register={register}
          setValue={setValue}
          errors={errors}
          newsletter={newsletter}
          open={isModalOpen}
          handleClose={handleModalClose}
          loading={reviewMutation.isLoading}
          onSubmit={handleSubmit(onSubmit)}
        />
        <div className="mb-8">
          {Boolean(reviewsData.reviews.length) &&
            reviewsData.reviews.map((review, index) => (
              <div
                className={`flex w-full py-6 ${
                  index + 1 < reviewsData.reviews.length && 'border-b'
                } border-light-grey`}
                key={review.id}
              >
                <div className="mr-[18px]">
                  <Avatar
                    src={review.reviewer.avatar as string}
                    alt="avatar"
                    width={80}
                    height={80}
                    className="rounded-full max-h-[80px] max-w-full w-[80px] min-w-[80px] min-h-[80px]"
                    username={review.reviewer.username}
                    customStyles="h-[80px] w-[80px]"
                  />
                </div>
                <div className="mr-[88px] w-[150px]">
                  <p className="text-lightBlack text-xl">
                    {review.reviewer.username}
                  </p>
                  <p className="font-inter text-dark-grey text-sm">
                    {review.reviewer.country}
                  </p>
                </div>
                <div className="w-full">
                  <div className="flex mb-4">
                    <StarRating
                      readonly
                      value={review.rating}
                      customStyles="flex-1"
                    />
                    <span className="text-sm text-grey font-inter">
                      {timeAgo(review.createdAt as string)}
                    </span>
                  </div>
                  <span className="text-lightBlack text-base font-inter">
                    {review.comment}
                  </span>
                </div>
              </div>
            ))}
        </div>
        {Boolean(
          reviewsData.total &&
            reviewsData?.total > 5 &&
            reviewsData.reviews.length < reviewsData?.total
        ) && (
          <Button
            label="See more"
            variant="outlined-secondary"
            size="full"
            onClick={loadMoreReviews}
          />
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { newsletterId } = context.params as { newsletterId: string };
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : undefined;
  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
    token,
  });

  const reviewsResponse: GetReviewResponse = await getReviews({
    newsletterId: parseInt(newsletterId),
    page: 1,
    pageSize: 5,
  });
  if (response.error) {
    return {
      notFound: true,
    };
  }

  if (reviewsResponse.error) {
    return {
      props: {
        reviewsData: null,
      },
    };
  }

  return {
    props: {
      newsletterData: response.newsletterData,
      reviews: reviewsResponse.reviews,
    },
  };
};

export default NewsletterPage;
