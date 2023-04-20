import Image from 'next/image';
import StarRatingComponent from 'react-star-rating-component';
import HeartIcon from '@/assets/icons/heart';
import StarIcon from '@/assets/icons/star';
import PlusIcon from '@/assets/icons/plus';
import Button from '../Button';
import Link from 'next/link';
import ArrowRight from '@/assets/icons/arrowRight';

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
        <div className="shadow-lg pl-12 pt-12 pb-24 pr-16">
          <div className="mb-10">
            {latestReviews.map(review => (
              <div className="flex border-b border-mercury pb-3 pt-2.5">
                <Image
                  src={review.image}
                  alt="latest"
                  width={64}
                  height={64}
                  className="rounded mr-8 max-h-16"
                />
                <div className="mr-24 min-w-[200px]">
                  <p className="text-xl">{review.name}</p>
                  <p className="text-base">{review.city}</p>
                  <StarRatingComponent
                    name="reviews_rating"
                    value={review.ratingCount}
                    starColor="#F7B500"
                  />
                  <p className="text-xs text-grey">{review.time}</p>
                </div>
                <div>
                  <div className="text-base max-w-[600px] mb-7">
                    {review.description}
                  </div>
                  <div className="flex justify-end gap-6 items-center">
                    <HeartIcon />
                    <StarIcon />
                    <PlusIcon />
                    <Button
                      label="Read Newletter"
                      rounded
                      bold
                      uppercase
                      fontSize="small"
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
            rounded
            bold
          />
        </div>
      </div>
      <div className="h-full">
        <h6 className="text-2x whitespace-nowrap mb-6 mt-4">
          Reviews for Your Newsletters
        </h6>
        <div className="flex flex-col gap-3 items-stretch">
          {reviewsNewsletters.map(review => (
            <div className="max-w-[482px] hover:bg-light-grey px-7 py-6 rounded-2xl">
              <p className="text-xl">{review.name}</p>
              <p>{review.city}</p>
              <div className="mb-6">
                <StarRatingComponent
                  name="reviews_rating"
                  value={review.ratingCount}
                  starColor="#F7B500"
                />
              </div>
              <p className="mb-6">{review.description}</p>
              <Link
                href="/"
                className="text-primary font-bold text-base flex items-center gap-4"
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
