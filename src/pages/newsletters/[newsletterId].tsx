import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { NewsletterData } from '@/types/newsletters';

import Button from '@/components/Button';
import StarRating from '@/components/StarRating';
import withLayout from '@/components/withLayout';

import ArrowLeft from '@/assets/icons/arrowLeft';
import BookmarkIcon from '@/assets/icons/bookmark';
import ListIcon from '@/assets/icons/list';
import PlusIcon from '@/assets/icons/plus';
import SubscribeIcon from '@/assets/icons/subscribe';

import { GetNewsletterResponse, getNewsletter } from '../api/newsletters';

interface NewsletterPageProps {
  newsletterData?: NewsletterData;
}

const NewsletterPage = ({ newsletterData }: NewsletterPageProps) => {
  console.log(newsletterData);
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
            <Image
              src={newsletterData?.addedByUser?.avatar as string}
              alt="avatar"
              width={112}
              height={112}
              className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
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
            src={newsletterData.image as string}
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
        />
        <div className="mb-8">
          <div className="flex w-full pb-6 border-b border-light-grey">
            <Image
              src={newsletterData?.addedByUser?.avatar as string}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full max-h-[80px] max-w-full object-cover min-w-[80px] mr-[18px]"
            />
            <div className="mr-[88px]">
              <p className="text-lightBlack text-xl">Bookbear express</p>
              <p className="font-inter text-dark-grey text-sm">Torento</p>
            </div>
            <div className="w-full">
              <div className="flex mb-4">
                <StarRating readonly value={3} customStyles="flex-1" />
                <span className="text-sm text-grey font-inter">
                  about 3 hours ago
                </span>
              </div>
              <span className="text-lightBlack text-base font-inter">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters.
              </span>
            </div>
          </div>
        </div>
        <Button label="See more" variant="outlined-secondary" size="full" />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { newsletterId } = context.params as { newsletterId: string };
  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
  });
  if (response.error) {
    return {
      props: {
        newsletterData: null,
      },
    };
  }
  return {
    props: {
      newsletterData: response.newsletterData,
    },
  };
};

export default withLayout(NewsletterPage);
