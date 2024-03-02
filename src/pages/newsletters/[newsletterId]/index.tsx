import { useUser } from '@/contexts/UserContext';
import timeAgo from '@/helpers/timeAgo';
import { FollowingPayload } from '@/types';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { GetServerSideProps } from 'next';
import parseCookies from 'next-cookies';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { zodResolver } from '@hookform/resolvers/zod';

import { NewsletterData } from '@/types/newsletters';
import {
  GetReviewResponse,
  ReviewResponse,
  GetUserReviewForNewsletterResponse,
  UserReviewForNewsletterResponse,
} from '@/types/newsletters';

import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import StarRating from '@/components/StarRating';
import VerifiedWithTooltip from '@/components/VerifiedWithTooltip';

import { setRedirectPath } from '@/helpers/redirectPathLocalStorage';

import ArrowLeft from '@/assets/icons/arrowLeft';
import BookmarkIcon from '@/assets/icons/bookmark';
// import ListIcon from '@/assets/icons/list';
import PlusIcon from '@/assets/icons/plus';

import {
  addToBookmark,
  deleteBookmark,
} from '../../../actions/newsletters/bookmarks';
import {
  GetNewsletterResponse,
  follow,
  getNewsletter,
  unfollow,
} from '../../../actions/newsletters/index';
import {
  createReview,
  getReviews,
  getUserReviewForNewsletter,
  updateReview,
  deleteReview,
} from '../../../actions/newsletters/reviews';
import { useMutation } from 'react-query';
import ReviewModal from '@/components/Modals/ReviewModal';
import EditReviewModal from '@/components/Modals/EditReviewModal';
import SkeletonImage from '@/components/SkeletonImage';
import ReportModal from '@/components/Modals/ReportModal';
import ClaimModal from '@/components/Modals/ClaimModal';
import NewsletterShareBlock from '@/components/Newsletter/NewsletterShareBlock';

interface NewsletterPageProps {
  newsletterData?: NewsletterData;
  reviews?: ReviewResponse;
  reviewForNewsletter?: UserReviewForNewsletterResponse;
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
  reviewForNewsletter,
}: NewsletterPageProps) => {
  const [newsletter, setNewsletter] = useState(newsletterData);
  const [reviewsData, setReviewsData] = useState(reviews);
  const [reviewForNewsletterData, setReviewForNewsletterData] = useState<
    UserReviewForNewsletterResponse | null | undefined
  >(reviewForNewsletter);
  const [page, setPage] = useState(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { user } = useUser();
  const router = useRouter();

  const hasExistingReview: boolean =
    user !== null && reviewForNewsletterData?.review !== null;
  const isReviewModalOpenQueryParam = router.query.reviewModal === '1';
  const isClaimModalOpenQueryParam =
    !isReviewModalOpenQueryParam && router.query.claimModal === '1';
  const isReportModalOpenQueryParam =
    !isClaimModalOpenQueryParam &&
    !isReviewModalOpenQueryParam &&
    router.query.reportModal === '1';

  const [isModalOpen, setIsModalOpen] = useState(
    user !== null && isReviewModalOpenQueryParam
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState(
    user !== null && isReportModalOpenQueryParam
  );
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(
    user !== null && isClaimModalOpenQueryParam
  );

  const handleOpenModal = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      const storedRedirectPath = newsletter
        ? `/newsletters/${newsletter.id}?reviewModal=1`
        : '/';
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    }
  };
  const handleOpenReportModal = () => {
    if (user) {
      setIsReportModalOpen(true);
    } else {
      const storedRedirectPath = newsletter
        ? `/newsletters/${newsletter.id}?reportModal=1`
        : '/';
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    }
  };

  const handleOpenClaimModal = () => {
    if (user) {
      setIsClaimModalOpen(true);
    } else {
      const storedRedirectPath = newsletter
        ? `/newsletters/${newsletter.id}?claimModal=1`
        : '/';
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    }
  };

  const reviewMutation = useMutation(createReview);
  const updateReviewMutation = useMutation(updateReview);
  const deleteReviewMutation = useMutation(deleteReview);
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

        const reviewForNewsletterResponse: GetUserReviewForNewsletterResponse =
          await getUserReviewForNewsletter({
            newsletterId: parseInt(router.query.newsletterId as string),
            token: null,
          });

        if (reviewsResponse.error) {
          console.error(reviewsResponse.error);
        } else {
          setIsModalOpen(false);
          setReviewsData(reviewsResponse.reviews);
          setReviewForNewsletterData(reviewForNewsletterResponse.review);
        }
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const onEdit: SubmitHandler<ValidationSchema> = async ({
    rating,
    comment,
  }) => {
    if (router.query.newsletterId) {
      if (hasExistingReview && reviewForNewsletterData?.review?.id) {
        const response = await updateReviewMutation.mutateAsync({
          rating,
          comment,
          id: reviewForNewsletterData?.review?.id,
        });

        if (!response?.error) {
          const reviewsResponse: GetReviewResponse = await getReviews({
            newsletterId: parseInt(router.query.newsletterId as string),
            page: 1,
            pageSize: 5 * page,
          });

          const reviewForNewsletterResponse: GetUserReviewForNewsletterResponse =
            await getUserReviewForNewsletter({
              newsletterId: parseInt(router.query.newsletterId as string),
              token: null,
            });

          if (reviewsResponse.error) {
            console.error(reviewsResponse.error);
          } else {
            setIsModalOpen(false);
            setReviewsData(reviewsResponse.reviews);
            setReviewForNewsletterData(reviewForNewsletterResponse.review);
          }
        } else {
          setIsModalOpen(false);
        }
      }
    }
  };

  const onDelete = async () => {
    if (router.query.newsletterId) {
      if (hasExistingReview && reviewForNewsletterData?.review?.id) {
        const response = await deleteReviewMutation.mutateAsync({
          reviewId: reviewForNewsletterData.review.id,
        });

        if (response.isDeleted) {
          const reviewsResponse: GetReviewResponse = await getReviews({
            newsletterId: parseInt(router.query.newsletterId as string),
            page: 1,
            pageSize: 5 * page,
          });

          const reviewForNewsletterResponse: GetUserReviewForNewsletterResponse =
            await getUserReviewForNewsletter({
              newsletterId: parseInt(router.query.newsletterId as string),
              token: null,
            });

          if (reviewsResponse.error) {
            console.error(reviewsResponse.error);
          } else {
            setIsModalOpen(false);
            setReviewsData(reviewsResponse.reviews);
            setReviewForNewsletterData(reviewForNewsletterResponse.review);
          }
        } else {
          setIsModalOpen(false);
        }
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
      const storedRedirectPath = newsletter
        ? `/newsletters/${newsletter.id}`
        : '/';
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    }
  };

  const handleFollow = async ({ entityId, followed }: FollowingPayload) => {
    if (!user) {
      const storedRedirectPath = newsletter
        ? `/newsletters/${newsletter.id}`
        : '/';
      setRedirectPath(storedRedirectPath);
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
    const nextPage = reviewsData?.nextPage;
    if (nextPage == null) return;

    const reviewsResponse: GetReviewResponse = await getReviews({
      newsletterId: parseInt(router.query.newsletterId as string),
      page: nextPage,
      pageSize: 5,
    });

    const prevReviews = reviewsData?.reviews;
    if (reviewsResponse.error) {
      console.error(reviewsResponse.error);
    } else {
      const newReviews = reviewsResponse.reviews?.reviews;
      if (newReviews) {
        setReviewsData({
          ...reviewsResponse.reviews,
          reviews: prevReviews ? prevReviews.concat(newReviews) : newReviews,
        });
      }
      setPage(nextPage);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleCopyClick = () => {
    const newsletterLink = `${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}?utm_source=(direct)&utm_medium=copy_link&utm_campaign=social_share`;
    navigator.clipboard
      .writeText(newsletterLink)
      .then(() => {
        // Success message
        setIsCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  if (!reviewsData || !newsletter) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>
          {newsletter?.title
            ? `${newsletter.title} | Newsletter Hub`
            : 'Best Newsletters Discovery & Reviews | Join Newsletter Hub Today'}
        </title>
        <meta
          name="description"
          content={
            newsletter?.description
              ? `${newsletter.description.substring(0, 155)}...`
              : 'Find the best newsletters to subscribe to across various categories. Follow leading newsletters and users, and be part of a community that celebrates quality content.'
          }
        />
      </Head>

      <main>
        <div className="md:pt-20 pt-3 px-3 max-w-[1280px] mx-auto">
          <div className="flex justify-between md:items-center md:flex-row mb-[52px] flex-col gap-2 md:gap-0">
            <Link
              href="/newsletters/categories/all"
              className="flex items-center gap-[18px] mb-3 md:mb-0"
            >
              <ArrowLeft className="stroke-dark-blue" />
              <span className="font-inter border-b-2 border-primary text-lightBlack font-semibold text-lg transition-colors duration-200 ease-in-out hover:text-primary">
                Back to all newsletters
              </span>
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex gap-1 flex-row items-center">
              <h1 className="text-lightBlack sm:text-6xl text-5xl font-medium mb-12">
                {newsletter?.title}
              </h1>
              {newsletter?.owner && (
                <VerifiedWithTooltip
                  className="mb-10"
                  tooltipText="Newsletter claimed by verified user"
                />
              )}
            </div>
            {newsletter?.image && (
              <SkeletonImage
                src={newsletter.image}
                width={1280}
                height={678}
                alt="banner"
                className="w-fit h-auto mb-6 mx-auto"
              />
            )}
          </div>
          {Boolean(newsletter?.interests?.length) && (
            <div className="flex gap-2 mb-10 max-w-[300px] sm:max-w-[400px] md:max-w-none flex-wrap">
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
          <div className="flex flex-col sm:flex-row gap-2 sm:pb-10 pb-5 border-b border-light-grey mb-10">
            {newsletter?.link && (
              <Link
                href={`${newsletter.link}?ref=newsletter-hub`}
                legacyBehavior
                passHref
              >
                <a target="_blank" rel="noopener noreferrer">
                  <Button
                    label="Read Newsletter"
                    rounded="xl"
                    fontSize="md"
                    height="sm"
                    customStyles="w-full sm:w-fit"
                  />
                </a>
              </Link>
            )}
            <Link href={user ? `${newsletter.id}/edit` : '/sign-up'}>
              <Button
                label="Edit Newsletter"
                rounded="xl"
                fontSize="md"
                height="sm"
                customStyles="w-full sm:w-fit"
              />
            </Link>
            <Button
              label="Claim Newsletter"
              rounded="xl"
              fontSize="md"
              height="sm"
              customStyles="w-full sm:w-fit"
              onClick={handleOpenClaimModal}
            />
            {user && (
              <ClaimModal
                user={user}
                newsletterId={newsletter.id}
                newsletterTitle={newsletter.title}
                open={isClaimModalOpen}
                handleClose={() => setIsClaimModalOpen(false)}
              />
            )}
            <Button
              label="Report"
              rounded="xl"
              fontSize="md"
              height="sm"
              customStyles="w-full sm:w-fit"
              onClick={handleOpenReportModal}
            />
            <ReportModal
              open={isReportModalOpen}
              handleClose={() => setIsReportModalOpen(false)}
            />
          </div>
          <div className="flex justify-between font-inter items-center mb-10 flex-col md:flex-row sm:pb-10 pb-5 border-b border-light-grey">
            <div className="flex md:gap-6 gap-3 items-center flex-col md:flex-row">
              <div className="flex gap-6 items-center">
                {newsletter?.owner ? (
                  <>
                    <p className="text-sm text-dark-grey">
                      Owned By:&nbsp;
                      <span className="font-semibold">
                        <Link href={`/users/${newsletter?.owner?.id}`}>
                          {newsletter?.owner?.username}
                        </Link>
                      </span>{' '}
                    </p>
                    <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
                  </>
                ) : (
                  newsletter?.newsletterAuthor && (
                    <>
                      <p className="text-sm text-dark-grey">
                        Author:&nbsp;
                        <span className="font-semibold">
                          {newsletter?.newsletterAuthor}
                        </span>{' '}
                      </p>
                      <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
                    </>
                  )
                )}
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
                      {newsletter.pricing === 'free_and_paid'
                        ? 'Free & Paid'
                        : newsletter.pricing.charAt(0).toUpperCase() +
                          newsletter.pricing.slice(1)}
                    </span>
                    <div className="w-1.5 h-1.5 bg-light-grey rounded-full hidden md:block"></div>
                  </>
                )}
                <p className="text-sm text-dark-grey">
                  <span className="font-semibold">
                    {newsletter.amountFollowers}
                  </span>
                  &nbsp;Follower
                  {newsletter.amountFollowers !== 1 && 's'}
                </p>
              </div>
              <div className="flex gap-2 items-center mb-3 md:mb-0">
                <StarRating readonly value={newsletter?.averageRating} />
                <span className="font-inter xs:text-sm text-dark-grey text-xs">
                  <span className="font-semibold">
                    {newsletter?.amountRatings} people
                  </span>{' '}
                  rated this newsletter
                </span>
              </div>
            </div>
            <div className="flex gap-10 items-center">
              <Button
                rounded="xl"
                fontSize="md"
                height="sm"
                customStyles="w-full sm:w-fit"
                onClick={() =>
                  handleFollow({
                    entityId: newsletter.id,
                    followed: newsletter.isFollower,
                  })
                }
                variant={
                  newsletter.isFollower ? 'outlined-secondary' : 'primary'
                }
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
              <div
                className="flex gap-2 cursor-pointer"
                onClick={() =>
                  handleBookmarkClick({
                    isInBookmarks: newsletter.isInBookmarks,
                  })
                }
              >
                <BookmarkIcon
                  className={`${newsletter.isInBookmarks && 'fill-dark-blue'}`}
                />
                <span className="font-inter text-sm text-dark-grey">
                  {newsletter.isInBookmarks ? 'Bookmarked' : 'Add To Bookmarks'}
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
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:pb-10 pb-5 mb-10">
            <span className="font-inter text-sm text-dark-grey">
              Share This Newsletter
            </span>
            <NewsletterShareBlock
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletter.id}`}
              title={newsletter.title}
            />
          </div>
          <h2 className="text-lightBlack text-5xl font-medium mb-8">
            {newsletter?.title ? `Reviews for ${newsletter?.title}` : 'Reviews'}
          </h2>
          {hasExistingReview ? (
            <>
              <Button
                label="View your review"
                rounded="xl"
                height="sm"
                fontSize="md"
                customStyles="!px-8 mb-8"
                onClick={handleOpenModal}
              />
              <EditReviewModal
                register={register}
                setValue={setValue}
                errors={errors}
                newsletter={newsletter}
                open={isModalOpen}
                handleClose={handleModalClose}
                loading={reviewMutation.isLoading}
                onSubmit={handleSubmit(onEdit)}
                review={reviewForNewsletterData?.review}
                onDelete={onDelete}
              />
            </>
          ) : (
            <>
              <Button
                label="Add Your Review"
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
                review={reviewForNewsletterData?.review}
              />
            </>
          )}
          <div className="mb-8">
            {Boolean(reviewsData.reviews.length) &&
              reviewsData.reviews.map((review, index) => (
                <div
                  className={`flex flex-col md:flex-row w-full py-6 px-3 ${
                    index + 1 < reviewsData.reviews.length && 'border-b'
                  } border-light-grey`}
                  key={review.id}
                >
                  <div className="md:mr-[88px] flex gap-[18px] md:w-[250px] w-[300px] sm:w-[400px] items-center">
                    <div className="mb-2 md:mb-0">
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
                    <div className="flex flex-row items-center">
                      <p className="text-lightBlack text-xl max-w-[280px] sm:max-w-[400px] md:max-w-none md:whitespace-normal overflow-hidden whitespace-nowrap text-ellipsis">
                        <Link
                          href={`/users/${review.reviewer.id}`}
                          className="text-base text-dark-grey font-inter"
                        >
                          {review.reviewer.username}
                        </Link>
                      </p>
                      {review.reviewer?.isVerifiedOwner && (
                        <VerifiedWithTooltip tooltipText="User is a verified newsletter owner" />
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex md:mb-4 mb-2">
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
      </main>
    </>
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

  const reviewForNewsletterResponse: GetUserReviewForNewsletterResponse =
    await getUserReviewForNewsletter({
      newsletterId: parseInt(newsletterId),
      token,
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

  if (token) {
    return {
      props: {
        newsletterData: response.newsletterData,
        reviews: reviewsResponse.reviews,
        reviewForNewsletter: reviewForNewsletterResponse.review,
        token,
      },
    };
  } else {
    return {
      props: {
        newsletterData: response.newsletterData,
        reviews: reviewsResponse.reviews,
        reviewForNewsletter: reviewForNewsletterResponse.review,
      },
    };
  }
};

export default NewsletterPage;
