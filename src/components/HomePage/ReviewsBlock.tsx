import { getReviews } from '@/actions/newsletters/reviews';
import timeAgo from '@/helpers/timeAgo';
import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ReviewResponse } from '@/types/newsletters';

import Avatar from '../Avatar';
import Button from '../Button';
import StarRating from '../StarRating';

interface ReviewsBlockProps {
  reviewData: ReviewResponse;
}

const ReviewsBlock = ({ reviewData }: ReviewsBlockProps) => {
  const [reviewsInfo, setReviewsInfo] = useState<ReviewResponse>(reviewData);
  const [page, setPage] = useState(1);
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
                <Avatar
                  src={review.reviewer.avatar}
                  alt="latest"
                  width={96}
                  height={96}
                  customStyles="mr-8 max-h-[96px]"
                  className="rounded-full mr-8 max-h-[96px]"
                  username={review.reviewer.username}
                />
                <div className="flex md:items-center flex-col md:flex-row">
                  <div className="mr-24 min-w-[200px]">
                    <p className="text-xl text-dark-blue">
                      {review.reviewer.username}
                    </p>
                    <p className="text-base text-dark-grey font-inter mb-2">
                      {review.reviewer.country}
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
                  <p className="md:text-base mb-8 font-inter text-dark-blue text-sm block max-w-[200px] xs:max-w-[250px] sm:max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis lg:max-w-[600px] lg:whitespace-normal lg:overflow-auto">
                    {review.comment}
                  </p>
                </div>
              </div>
              <Link
                href={`newsletters/${review.newsletter.id}`}
                className="flex justify-end items-end w-full"
              >
                <Button
                  label="Read Newsletter"
                  rounded="xl"
                  fontSize="md"
                  customStyles="w-full md:w-fit"
                />
              </Link>
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
