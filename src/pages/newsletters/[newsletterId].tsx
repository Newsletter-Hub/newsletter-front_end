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
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import StarRating from '@/components/StarRating';

import ArrowLeft from '@/assets/icons/arrowLeft';
import BookmarkIcon from '@/assets/icons/bookmark';
// import ListIcon from '@/assets/icons/list';
import PlusIcon from '@/assets/icons/plus';

import {
  addToBookmark,
  deleteBookmark,
  getBookmarkById,
} from '../../actions/newsletters/bookmarks';
import {
  GetNewsletterResponse,
  follow,
  getNewsletter,
  unfollow,
} from '../../actions/newsletters/index';
import { createReview, getReviews } from '../../actions/newsletters/reviews';

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

const NewsletterPage = ({
  newsletterData,
  reviews,
  isBookmark,
}: NewsletterPageProps) => {
  const [newsletter, setNewsletter] = useState(newsletterData);
  const [reviewsData, setReviewsData] = useState(reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmarkState, setBookmarkState] = useState(isBookmark);
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
      const response = await createReview({
        rating,
        comment,
        newsletterId: +router.query.newsletterId,
      });

      if (response.error) {
        console.error(response?.error);
      } else if (!response?.error) {
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
      }
    }
  };

  const handleAddBookmark = async () => {
    if (router.query.newsletterId) {
      const response = await addToBookmark({
        newsletterId: router.query.newsletterId as string,
      });
      if (response.error) {
        console.error(response?.error);
      } else if (!response.error) {
        setBookmarkState('added');
      }
    }
  };

  const handleDeleteBookmark = async () => {
    if (router.query.newsletterId) {
      const response = await deleteBookmark({
        newsletterId: router.query.newsletterId as string,
      });
      if (response.error) {
        console.error(response?.error);
      } else if (!response.error) {
        setBookmarkState('none');
      }
    }
  };

  const handleBookmarkClick = () => {
    if (user) {
      bookmarkState === 'none' ? handleAddBookmark() : handleDeleteBookmark();
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
    <div className="flex justify-center items-center flex-col pt-20 px-[320px]">
      <div className="!max-w-[1280px]">
        <Link
          href="/newsletters/categories/all"
          className="flex items-center gap-[18px] mb-[52px]"
        >
          <ArrowLeft />
          <span className="font-inter border-b-2 border-primary text-lightBlack font-semibold text-lg">
            Back to all newsletters
          </span>
        </Link>
        <h1 className="text-lightBlack text-7xl font-medium mb-10">
          {newsletter?.title}
        </h1>
        {newsletter?.addedByUser && (
          <div className="flex gap-6 mb-10">
            <Avatar
              src={newsletter?.addedByUser?.avatar as string}
              alt="avatar"
              width={112}
              height={112}
              className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
              customStyles="max-h-[112px] min-w-[112px]"
              username={newsletter.addedByUser.username}
            />
            <div>
              <div className="flex gap-4 items-center mb-4">
                <span className="font-medium text-lightBlack text-xl">
                  {newsletter?.newsletterAuthor}
                </span>
              </div>
              <div className="flex items-center mb-3">
                <StarRating
                  readonly
                  value={newsletter.addedByUser.averageUserRating}
                  customStyles="mr-2"
                />
                <span className="font-inter text-dark-grey text-sm mr-6">
                  {newsletter.addedByUser.amountUserRatings}
                </span>
                <span className="font-inter text-sm text-dark-grey">
                  <span className="font-bold">207</span> Followers
                </span>
              </div>
              <span className="font-inter text-sm text-dark-grey mb-10">
                I create and curate content for both the blog and our training
                courses. He also directs the market research and strategic
                planning the site.
              </span>
            </div>
          </div>
        )}
        {newsletter?.image && (
          <Image
            src={newsletter.image || ''}
            width={1280}
            height={678}
            alt="banner"
            className="w-full h-auto mb-6"
            placeholder="blur"
            blurDataURL={newsletter.image as string}
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
            <Link href={newsletter.link}>
              <Button
                label="Read newsletter"
                rounded="xl"
                height="sm"
                fontSize="md"
              />
            </Link>
          )}
          <Button
            rounded="xl"
            fontSize="md"
            height="sm"
            onClick={() =>
              handleFollow({
                entityId: newsletter.id,
                followed: newsletter.followed,
              })
            }
            variant={newsletter.followed ? 'outlined-secondary' : 'primary'}
            label={
              newsletter.followed ? (
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
              onClick={handleBookmarkClick}
            >
              <BookmarkIcon
                className={`${bookmarkState === 'added' && 'fill-dark-blue'}`}
              />
              <span className="font-inter text-sm text-dark-grey">
                {bookmarkState === 'added' ? 'Bookmarked' : 'Add to bookmarks'}
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
        <Modal open={isModalOpen} handleClose={handleModalClose}>
          <div>
            <div className="flex gap-6 border-b border-b-light-grey pb-6 mb-6">
              <Avatar
                src={newsletter?.addedByUser?.avatar as string}
                alt="avatar"
                width={112}
                height={112}
                className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
                customStyles="max-h-[112px] min-w-[112px]"
                username={newsletter?.addedByUser?.username}
              />
              <div className="flex flex-col">
                <span className="font-medium text-lightBlack text-xl mb-3">
                  {newsletter?.newsletterAuthor}
                </span>
                <div className="flex items-center mb-3">
                  <StarRating
                    readonly
                    value={newsletter?.addedByUser?.averageUserRating}
                    customStyles="mr-2"
                  />
                  <span className="font-inter text-dark-grey text-sm mr-6">
                    {newsletter?.addedByUser?.amountUserRatings}
                  </span>
                  <span className="font-inter text-sm text-dark-grey">
                    <span className="font-bold">207</span> Followers
                  </span>
                </div>
                <span className="font-inter text-sm text-dark-grey">
                  I create and curate content for both the blog and our training
                  courses. He also directs the market research and strategic
                  planning the site.
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
                  setValue={(index: number) => setValue('rating', index)}
                />
              </div>
              <Input
                variant="filled"
                placeholder="Go ahead, we are listening..."
                customStyles="w-full mb-9"
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
        <div className="mb-8">
          {Boolean(reviewsData.reviews.length) &&
            reviewsData.reviews.map((review, index) => (
              <div
                className={`flex w-full py-6 ${
                  index + 1 < reviewsData.reviews.length && 'border-b'
                } border-light-grey`}
                key={review.id}
              >
                <Avatar
                  src={review.reviewer.avatar as string}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-full max-h-[80px] max-w-full object-cover min-w-[80px] mr-[18px]"
                  username={review.reviewer.username}
                  customStyles="max-h-[80px] min-w-[80px] mr-[18px]"
                />
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
  const user: UserMe = context.req.cookies.user
    ? JSON.parse(context.req.cookies.user as string)
    : undefined;
  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
    myId: user && user.id ? +user.id : undefined,
  });

  const reviewsResponse: GetReviewResponse = await getReviews({
    newsletterId: parseInt(newsletterId),
    page: 1,
    pageSize: 5,
  });

  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;

  let isBookmark = 'none';

  if (!token) {
    isBookmark = 'unauthorized';
  } else {
    const bookmarkResponse = await getBookmarkById({ newsletterId, token });
    if (bookmarkResponse.bookmark) {
      isBookmark = 'added';
    }
  }
  if (response.error || reviewsResponse.error) {
    return {
      props: {
        newsletterData: null,
        reviewsData: null,
      },
    };
  }

  return {
    props: {
      newsletterData: response.newsletterData,
      reviews: reviewsResponse.reviews,
      isBookmark: isBookmark,
    },
  };
};

export default NewsletterPage;
