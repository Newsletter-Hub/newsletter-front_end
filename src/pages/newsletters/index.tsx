import { useState } from 'react';

import Image from 'next/image';

import { NewsletterData } from '@/types/newsletters';

import Button from '@/components/Button';
import StarRating from '@/components/StarRating';
import withLayout from '@/components/withLayout';

import BookmarkIcon from '@/assets/icons/bookmark';
import StarIcon from '@/assets/icons/star';

import { getNewslettersList } from '../api/newsletters';

export interface NewslettersListData {
  total: number;
  newsletters: NewsletterData[];
}

interface NewslettersPageProps {
  newslettersListData?: NewslettersListData;
}
interface Newsletter {
  total?: number;
  newsletters?: NewsletterData[];
}

const NewslettersPage = ({ newslettersListData }: NewslettersPageProps) => {
  const [newslettersData, setNewslettersData] = useState<Newsletter>(
    newslettersListData as Newsletter
  );
  const [page, setPage] = useState(1);
  const loadMoreNewsletters = async () => {
    setPage(prevPage => prevPage + 1);

    const newsletterResponse = await getNewslettersList({
      page: page + 1,
      pageSize: 6,
    });

    if (newsletterResponse.error) {
      console.error(newsletterResponse.error);
    } else if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  };

  if (
    !newslettersListData ||
    !newslettersData ||
    !newslettersData.newsletters
  ) {
    return <span>loading..</span>;
  }
  return (
    <div className="flex justify-center items-center flex-col pt-20 px-[17%]">
      <div className="max-w-[1280px]">
        <div className="flex justify-start items-start mb-10">
          <h1 className="text-blue text-7xl font-medium">Newsletters List</h1>
        </div>
        {newslettersData.newsletters.map((newsletter, index) => {
          const imageLink = encodeURIComponent(newsletter.image as string);
          return (
            <div
              className={`flex mb-8 gap-8 pb-8 ${
                index + 1 !== newslettersListData.newsletters.length &&
                'border-b'
              } border-b-light-grey`}
              key={newsletter.id}
            >
              <Image
                src={`/api/imageproxy/${imageLink}` as string}
                className="h-[224px] w-[224px] rounded-[10px] object-cover"
                alt="newsletter"
                width={224}
                height={224}
              />
              <div className="h-[224px] w-full">
                <span
                  className="block max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden text-lightBlack font-medium text-xl mb-2
                "
                >
                  {newsletter.title}
                </span>
                <span className="font-inter text-base text-lightBlack mb-6 block">
                  {newsletter.description}
                </span>
                <div className="flex mb-6 gap-2">
                  {newsletter.interests?.map(interest => (
                    <span
                      key={interest.id}
                      className="bg-primary/10 text-primary rounded-lg px-[14px] py-2 text-base font-inter"
                    >
                      {interest.interestName}
                    </span>
                  ))}
                </div>
                <div className="flex items-center">
                  <StarRating
                    readonly
                    value={newsletter.averageRating}
                    customStyles="flex-1"
                  />
                  <div className="flex gap-6 mr-10">
                    <BookmarkIcon />
                    <StarIcon className="stroke-lightBlack stroke-[1.5px]" />
                  </div>
                  <Button label="Read Newsletter" rounded="xl" fontSize="md" />
                </div>
              </div>
            </div>
          );
        })}
        <Button
          label="See more"
          variant="outlined-secondary"
          size="full"
          onClick={loadMoreNewsletters}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const newsletterList = await getNewslettersList({ page: 1, pageSize: 6 });
  if (!newsletterList) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
    },
  };
};

export default withLayout(NewslettersPage);
