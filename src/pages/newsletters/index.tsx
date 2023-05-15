import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import React, { useState } from 'react';

import { Alegreya } from 'next/font/google';
import Image from 'next/image';

import clsx from 'clsx';

import { Interest } from '@/types/interests';
import { NewsletterData } from '@/types/newsletters';

import Accordion from '@/components/Accordion';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Popover from '@/components/Popover';
import StarRating from '@/components/StarRating';
import withLayout from '@/components/withLayout';

import BookmarkIcon from '@/assets/icons/bookmark';
import CheckIcon from '@/assets/icons/check';
import FilterIcon from '@/assets/icons/filter';
import SortIcon from '@/assets/icons/sort';
import StarIcon from '@/assets/icons/star';

const alegreya = Alegreya({ subsets: ['latin'] });

export interface NewslettersListData {
  total: number;
  newsletters: NewsletterData[];
}

interface NewslettersPageProps {
  newslettersListData?: NewslettersListData;
  interests?: Interest[];
}
interface Newsletter {
  total?: number;
  newsletters?: NewsletterData[];
}

interface SortType {
  label: string;
  value: string;
}

const sortTypes: SortType[] = [
  {
    label: 'Data added',
    value: 'added',
  },
  {
    label: 'Number of followers',
    value: 'followers',
  },
  {
    label: 'Number of bookmarks',
    value: 'bookmarks',
  },
  {
    label: 'Rating',
    value: 'rating',
  },
];

const NewslettersPage = ({
  newslettersListData,
  interests,
}: NewslettersPageProps) => {
  const [newslettersData, setNewslettersData] = useState<Newsletter>(
    newslettersListData as Newsletter
  );
  const [page, setPage] = useState(1);
  const [choosedSortType, setChoosedSortType] = useState(3);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [filters, setFilters] = useState({ categories: false });

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

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
  const modalTitleStyles = clsx(
    'text-lightBlack text-5xl mb-6 text-center',
    alegreya.className
  );
  console.log(filters);
  if (
    !newslettersListData ||
    !newslettersData ||
    !newslettersData.newsletters ||
    !interests?.length
  ) {
    return <span>loading..</span>;
  }
  return (
    <div className="flex justify-center items-center flex-col pt-20 px-[17%]">
      <div className="max-w-[1280px]">
        <h1 className="text-blue text-7xl font-medium mb-10">
          Newsletters List
        </h1>
        <div className="flex mb-10 items-center">
          <div className="flex-grow">
            <Input
              isSearch
              placeholder="Search Newsletter Hub"
              wrapperStyles="max-w-[262px]"
              customStyles="h-[48px]"
              iconStyles="!top-3"
            />
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined-secondary"
              onClick={handleOpenModal}
              label={
                <span className="flex text-base justify-center px-6 gap-2">
                  <FilterIcon />
                  Filters
                </span>
              }
            />
            <Modal open={isOpenModal} handleClose={handleCloseModal}>
              <div>
                <h2 className={modalTitleStyles}>
                  What would you like to filter by?
                </h2>
                <Accordion
                  label="Categories"
                  isOpen={filters.categories}
                  setIsOpen={value => {
                    setFilters({ ...filters, categories: value });
                  }}
                >
                  <div className="pt-4 pl-9 grid grid-cols-2 gap-4">
                    {interests?.map(interest => (
                      <Checkbox
                        label={interest.interestName}
                        key={interest.id}
                      />
                    ))}
                  </div>
                </Accordion>
              </div>
            </Modal>
            <Popover
              buttonLabel={
                <span className="flex text-base justify-center items-center px-6 gap-4">
                  {sortTypes[choosedSortType].label}
                  <SortIcon />
                </span>
              }
            >
              <div className="flex flex-col gap-[6px] py-[18px]">
                {sortTypes.map((item, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`flex gap-4 items-center w-full cursor-pointer px-4 py-2 ${
                        choosedSortType === index &&
                        'bg-light-porcelain rounded'
                      }`}
                      onClick={() => setChoosedSortType(index)}
                    >
                      <span className="flex-1">{item.label}</span>
                      <div className="w-4">
                        {index === choosedSortType && (
                          <CheckIcon className="stroke-[#253646]" />
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </Popover>
          </div>
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
  const interests = await getInterests();
  if (!newsletterList || !interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      newslettersListData: newsletterList.newslettersListData || null,
      interests: interests,
    },
  };
};

export default withLayout(NewslettersPage);
