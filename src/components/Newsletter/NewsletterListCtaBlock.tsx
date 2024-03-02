import React, { useState } from 'react';
import { NewsletterData } from '@/types/newsletters';
import { FollowingPayload } from '@/types';
import {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
  SubmitHandler,
} from 'react-hook-form';
import { UseMutationResult } from 'react-query';
import {
  CreateReviewResponse,
  ReviewPayload,
} from '@/actions/newsletters/reviews';

import StarRating from '@/components/StarRating';
import Button from '@/components/Button';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/router';

import StarIcon from '@/assets/icons/star';
import BookmarkIcon from '@/assets/icons/bookmark';
import PlusIcon from '@/assets/icons/plus';
import BookmarkPlusIcon from '@/assets/icons/bookmarkPlus';

import ReviewModal from '../Modals/ReviewModal';
import NewsletterShareBlock from './NewsletterShareBlock';

export type NewsletterListCtaBlockLayoutType =
  | 'default'
  | 'claim_newsletter'
  | 'owned_newsletters';

interface NewsletterListCtaBlockProps {
  newsletter: NewsletterData;
  layout: NewsletterListCtaBlockLayoutType;
  isRated?: boolean;
  isFollowEnable?: boolean;
  handleClickBookmark: (id: string, isInBookmarks?: boolean) => Promise<void>;
  setIsOpenReviewModal: (value: React.SetStateAction<number | boolean>) => void;
  setRedirectPath: (path: string) => void;
  handleSubmit: UseFormHandleSubmit<{
    rating: number;
    comment: string;
  }>;
  register: UseFormRegister<{
    rating: number;
    comment: string;
  }>;
  setValue: UseFormSetValue<{
    rating: number;
    comment: string;
  }>;
  errors: FieldErrors<{
    rating: number;
    comment: string;
  }>;
  onSubmit: SubmitHandler<{
    rating: number;
    comment: string;
  }>;
  isOpenReviewModal: number | boolean;
  reviewMutation: UseMutationResult<
    CreateReviewResponse,
    unknown,
    ReviewPayload,
    unknown
  >;
  followLoading: number | boolean;
  isNewsletterFollowed: boolean;
  handleFollow: ({ entityId, followed }: FollowingPayload) => Promise<void>;
  type: 'bookmark' | 'newsletter';
}

const NewsletterListCtaBlock = ({
  newsletter,
  layout,
  isRated,
  isFollowEnable,
  handleClickBookmark,
  setIsOpenReviewModal,
  setRedirectPath,
  handleSubmit,
  register,
  setValue,
  errors,
  onSubmit,
  handleFollow,
  isOpenReviewModal,
  reviewMutation,
  followLoading,
  isNewsletterFollowed,
  type,
}: NewsletterListCtaBlockProps) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <>
      <div className="flex w-full">
        <StarRating
          readonly
          value={newsletter.averageRating}
          customStyles="flex-1"
        />
        <div className="flex md:mr-10">
          {layout === 'default' && (
            <div
              onClick={() =>
                handleClickBookmark(
                  String(newsletter.id),
                  newsletter.isInBookmarks
                )
              }
            >
              {newsletter.isInBookmarks || type === 'bookmark' ? (
                <BookmarkIcon className="cursor-pointer fill-dark-blue" />
              ) : (
                <BookmarkPlusIcon className="cursor-pointer" />
              )}
            </div>
          )}
          {isRated && (
            <div
              onClick={() => {
                if (user) {
                  setIsOpenReviewModal(newsletter.id as number);
                } else {
                  const storedRedirectPath = newsletter
                    ? `/newsletters/${newsletter.id}?reviewModal=1`
                    : '/';
                  setRedirectPath(storedRedirectPath);
                  router.push('/sign-up');
                }
              }}
            >
              <StarIcon className="stroke-lightBlack stroke-[1.5px] cursor-pointer md:ml-6 ml-3" />
            </div>
          )}
          <ReviewModal
            register={register}
            setValue={setValue}
            errors={errors}
            newsletter={newsletter}
            open={Boolean(isOpenReviewModal === newsletter.id)}
            handleClose={() => setIsOpenReviewModal(false)}
            onSubmit={handleSubmit(onSubmit)}
            loading={reviewMutation.isLoading}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-between w-full md:w-auto md:justify-normal">
        {layout === 'default' && (
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
                customStyles="max-w-[150px] md:max-w-none"
              />
            </a>
          </Link>
        )}
        {layout === 'claim_newsletter' && (
          <Link href={`/newsletters/${newsletter.id}/?claimModal=1`}>
            <Button
              label="Claim Newsletter"
              rounded="xl"
              fontSize="md"
              customStyles="w-full sm:w-fit"
            />
          </Link>
        )}
        {layout === 'owned_newsletters' && (
          <>
            <NewsletterShareBlock
              url={`${process.env.NEXT_PUBLIC_BASE_URL}/newsletters/${newsletter.id}`}
              title={newsletter.title}
            />
            <Link href={`/newsletters/${newsletter.id}/edit`}>
              <Button
                label="Edit Newsletter"
                rounded="xl"
                fontSize="md"
                customStyles="w-full sm:w-fit"
              />
            </Link>
          </>
        )}
        {isFollowEnable && (
          <Button
            rounded="xl"
            fontSize="md"
            customStyles="md:!w-[140px] !min-w-[125px]"
            loading={Boolean(followLoading === newsletter.id)}
            onClick={() =>
              handleFollow({
                entityId: newsletter.id,
                followed: newsletter.isFollower,
              })
            }
            variant={
              isNewsletterFollowed || newsletter.isFollower
                ? 'outlined-secondary'
                : 'primary'
            }
            label={
              isNewsletterFollowed || newsletter.isFollower ? (
                'Following'
              ) : (
                <span className="flex items-center gap-2">
                  <PlusIcon />
                  Follow
                </span>
              )
            }
          />
        )}
      </div>
    </>
  );
};

export default NewsletterListCtaBlock;
