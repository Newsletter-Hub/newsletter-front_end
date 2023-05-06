import Image from 'next/image';
import Link from 'next/link';

import ArrowRight from '@/assets/icons/arrowRight';
import HeartIcon from '@/assets/icons/heart';
import PlusIcon from '@/assets/icons/plus';
import StarIcon from '@/assets/icons/star';
import starRating from '@/assets/images/star-rating.svg';

import Button from '../Button';

const latestReviews = [
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 5,
    time: 'about 3 hours ago',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 4,
    time: 'about 3 hours ago',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 1,
    time: 'about 3 hours ago',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 2,
    time: 'about 3 hours ago',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 3,
    time: 'about 3 hours ago',
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
];

const reviewsNewsletters = [
  {
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
  {
    name: 'bookbear express',
    city: 'Torento',
    ratingCount: 2,
    description:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.The point of using Lorem Ipsum is that it has a more-or-lessnormal distribution of letters. Read Newletter',
  },
];

const ReviewsBlock = () => {
  return (
    <div className="flex gap-6 mb-24">
      <div>
        <h4 className="text-5xl">Latest reviews</h4>
        <div className="pl-12 pt-12 pb-24 pr-16">
          <div className="mb-10">
            {latestReviews.map((review, index) => (
              <div
                className="flex border-b border-light-grey pb-3 pt-2.5"
                key={index}
              >
                <Image
                  src={review.image}
                  alt="latest"
                  width={64}
                  height={64}
                  className="rounded mr-8 max-h-16"
                />
                <div className="mr-24 min-w-[200px]">
                  <p className="text-xl text-lightBlack">{review.name}</p>
                  <p className="text-base text-dark-grey font-inter">
                    {review.city}
                  </p>
                  <Image src={starRating} alt="Star rating" />
                  <p className="text-xs text-grey-chat font-inter">
                    {review.time}
                  </p>
                </div>
                <div>
                  <div className="text-base max-w-[600px] mb-7 font-inter">
                    {review.description}
                  </div>
                  <div className="flex justify-end gap-6 items-center">
                    <HeartIcon />
                    <StarIcon />
                    <PlusIcon />
                    <Button
                      label="Read Newletter"
                      rounded="md"
                      bold
                      uppercase
                      fontSize="xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            label="See More"
            variant="secondary"
            size="full"
            rounded="md"
            bold
          />
        </div>
      </div>
      <div className="h-full">
        <h6 className="text-2xl whitespace-nowrap mb-6 mt-4">
          Reviews for Your Newsletters
        </h6>
        <div className="flex flex-col gap-3 items-stretch">
          {reviewsNewsletters.map((review, index) => (
            <div
              className="max-w-[482px] hover:bg-light-porcelain px-7 py-6 rounded-2xl"
              key={index}
            >
              <p className="text-xl">{review.name}</p>
              <p className="font-inter">{review.city}</p>
              <div className="mb-6">
                <Image src={starRating} alt="Star rating" />
              </div>
              <p className="mb-6 font-inter">{review.description}</p>
              <Link
                href="/"
                className="text-primary font-bold text-base flex items-center gap-4 font-inter"
              >
                See more <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsBlock;
