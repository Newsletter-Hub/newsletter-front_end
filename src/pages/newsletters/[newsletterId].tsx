import timeAgo from '@/helpers/timeAgo';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import { getUserMe } from '@/pages/api/user';

import { NewsletterData } from '@/types/newsletters';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import StarRating from '@/components/StarRating';
import withLayout from '@/components/withLayout';

import ArrowLeft from '@/assets/icons/arrowLeft';
import BookmarkIcon from '@/assets/icons/bookmark';
import ListIcon from '@/assets/icons/list';
import PlusIcon from '@/assets/icons/plus';
import SubscribeIcon from '@/assets/icons/subscribe';

import { GetNewsletterResponse, getNewsletter } from '../api/newsletters';
import {
  GetReviewResponse,
  ReviewResponse,
  createReview,
  getReviews,
} from '../api/newsletters/reviews';

interface NewsletterPageProps {
  newsletterData?: NewsletterData;
  reviews?: ReviewResponse;
}

const validationSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }),
  comment: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const NewsletterPage = ({ newsletterData, reviews }: NewsletterPageProps) => {
  const [reviewsData, setReviewsData] = useState(reviews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const handleOpenModal = () => {
    setIsModalOpen(true);
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

  if (!reviewsData) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex justify-center items-center flex-col pt-20 px-[320px]">
      <div className="!max-w-[1280px]">
        <Link href="/" className="flex items-center gap-[18px] mb-[52px]">
          <ArrowLeft />
          <span className="font-inter border-b-2 border-primary text-lightBlack font-semibold text-lg">
            Back to all newsletters
          </span>
        </Link>
        <h1 className="text-lightBlack text-7xl font-medium mb-10">
          {newsletterData?.title}
        </h1>
        {newsletterData?.addedByUser && (
          <div className="flex gap-6">
            <Avatar
              src={newsletterData?.addedByUser?.avatar as string}
              alt="avatar"
              width={112}
              height={112}
              className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
              customStyles="max-h-[112px] min-w-[112px]"
              username={newsletterData.addedByUser.username}
            />
            <div>
              <div className="flex gap-4 items-center mb-4">
                <span className="font-medium text-lightBlack text-xl">
                  {newsletterData?.newsletterAuthor}
                </span>
                <div className="flex gap-2">
                  <Button
                    label={
                      <div className="flex items-center justify-center gap-2">
                        <PlusIcon />
                        <span className="text-base">Follow</span>
                      </div>
                    }
                    rounded="xl"
                    height="sm"
                  />
                  <Button
                    label={
                      <div className="flex items-center justify-center gap-2">
                        <SubscribeIcon />
                        <span className="text-base">Subscribe</span>
                      </div>
                    }
                    rounded="xl"
                    height="sm"
                  />
                </div>
              </div>
              <div className="flex items-center mb-3">
                <StarRating readonly value={3} customStyles="mr-2" />
                <span className="font-inter text-dark-grey text-sm mr-6">
                  440
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
        {newsletterData?.image ? (
          <Image
            src={
              (newsletterData.image as string) ||
              'https://www.flaticon.com/free-icon/profile_3135715?term=avatar&page=1&position=4&origin=tag&related_id=3135715'
            }
            width={1280}
            height={678}
            alt="banner"
            className="w-full h-auto mb-6"
            placeholder="blur"
            blurDataURL={newsletterData.image as string}
          />
        ) : (
          <Image
            src=""
            width={1280}
            height={678}
            alt="banner"
            className="w-full h-auto mb-6"
          />
        )}
        <div className="flex gap-2 mb-10">
          {newsletterData?.interests?.map(interest => (
            <span
              key={interest.id}
              className="bg-primary/10 text-primary rounded-lg py-2 px-3.5 font-inter text-base"
            >
              {interest.interestName}
            </span>
          ))}
        </div>
        <p className="font-inter text-dark-grey text-lg pb-10 border-b border-light-grey mb-10">
          {newsletterData?.description}
        </p>
        <div className="flex">
          <div className="flex gap-2 flex-1">
            <StarRating readonly value={3} />
            <span className="font-inter text-sm text-dark-grey">
              <span className="font-semibold">177 people</span> rated this
              newsletter
            </span>
          </div>
          <div className="flex gap-10 mb-20">
            <div className="flex gap-2 cursor-pointer">
              <BookmarkIcon />
              <span className="font-inter text-sm text-dark-grey">
                Add to bookmarks
              </span>
            </div>
            <div className="flex gap-2 cursor-pointer">
              <ListIcon />
              <span className="font-inter text-sm text-dark-grey">
                Add to list
              </span>
            </div>
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
                src={newsletterData?.addedByUser?.avatar as string}
                alt="avatar"
                width={112}
                height={112}
                className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
                username={newsletterData?.addedByUser?.username}
                customStyles="max-h-[112px] min-w-[112px]"
              />
              <div className="flex flex-col">
                <span className="font-medium text-lightBlack text-xl mb-3">
                  {newsletterData?.newsletterAuthor}
                </span>
                <div className="flex items-center mb-3">
                  <StarRating readonly value={3} customStyles="mr-2" />
                  <span className="font-inter text-dark-grey text-sm mr-6">
                    440
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

  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
  });

  const reviewsResponse: GetReviewResponse = await getReviews({
    newsletterId: parseInt(newsletterId),
    page: 1,
    pageSize: 5,
  });

  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : null;
  const userResponse = await getUserMe({ token } as { token: string });

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
      user: token ? userResponse : null,
    },
  };
};

export default withLayout(NewsletterPage);
