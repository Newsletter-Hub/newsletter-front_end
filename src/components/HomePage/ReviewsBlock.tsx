import Image from 'next/image';
import StarRatingComponent from 'react-star-rating-component';
import HeartIcon from '@/assets/icons/heart';
import StarIcon from '@/assets/icons/star';
import PlusIcon from '@/assets/icons/plus';
import Button from '../Button';

const latestReviews = [
  {
    image:
      'https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000',
  },
];

const ReviewsBlock = () => {
  return (
    <div className="flex">
      <div>
        <h4 className="text-5xl">Latest reviews</h4>
        <div className="shadow-lg pl-12 pt-12 pb-24 pr-16">
          <div className="flex border-b border-mercury pb-3">
            <Image
              src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
              alt="latest"
              width={64}
              height={64}
              className="rounded mr-8 max-h-16"
            />
            <div className="mr-24 min-w-[200px]">
              <p className="text-xl">bookbear express</p>
              <p className="text-base">Torento</p>
              <StarRatingComponent
                name="reviews_rating"
                value={5}
                starColor="#F7B500"
              />
              <p className="text-xs text-grey">about 3 hours ago</p>
            </div>
            <div>
              <div className="text-base max-w-[600px] mb-7">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters. Read Newletter
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
        </div>
      </div>
    </div>
  );
};

export default ReviewsBlock;
