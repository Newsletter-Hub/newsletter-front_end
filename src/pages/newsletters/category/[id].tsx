import { getNewslettersList } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';

import { GetServerSideProps } from 'next';
import { Alegreya } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import clsx from 'clsx';

import { Interest } from '@/types/interests';
import { NewsletterData } from '@/types/newsletters';

import Accordion from '@/components/Accordion';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Popover from '@/components/Popover';
import Slider from '@/components/Slider';
import StarRating from '@/components/StarRating';
import withLayout from '@/components/withLayout';

import BookmarkIcon from '@/assets/icons/bookmark';
import CheckIcon from '@/assets/icons/check';
import FilterIcon from '@/assets/icons/filter';
import PlusIcon from '@/assets/icons/plus';
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

interface Filters {
  categories: number[];
  pricingType: string[];
  durationFrom: number;
  durationTo: number;
  ratings: number[];
}

const sortTypes: SortType[] = [
  {
    label: 'Data added',
    value: 'date',
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

const ratings = [5, 4, 3, 2, 1];

const NewslettersPage = ({
  newslettersListData,
  interests,
}: NewslettersPageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [newslettersData, setNewslettersData] = useState<Newsletter>(
    newslettersListData as Newsletter
  );
  const [page, setPage] = useState(1);
  const [choosedSortType, setChoosedSortType] = useState(3);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [filters, setFilters] = useState({
    categories: false,
    pricingType: false,
    duration: false,
    rating: false,
  });
  const [filtersPayload, setFiltersPayload] = useState<Filters>({
    categories: id === 'all' ? [] : id ? [+id] : [],
    pricingType: [],
    durationFrom: 1,
    durationTo: 60,
    ratings: [],
  });
  const [filtersChoosed, setFiltersChoosed] = useState(false);

  const filtersCount = useMemo(() => {
    let count = 0;
    if (filtersPayload.categories.length > 0) count++;
    if (filtersPayload.pricingType.length > 0) count++;
    if (filtersPayload.durationFrom !== 1 || filtersPayload.durationTo !== 60)
      count++;
    if (filtersPayload.ratings.length > 0) count++;
    return count;
  }, [filtersPayload]);

  const [search, setSearch] = useState('');

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const loadMoreNewsletters = async () => {
    setPage(prevPage => prevPage + 1);

    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * (page + 1),
      order: sortTypes[choosedSortType].value,
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

  const handleFiltersReset = async () => {
    setFilters({
      categories: false,
      pricingType: false,
      duration: false,
      rating: false,
    });
    setFiltersPayload({
      categories: [],
      pricingType: [],
      durationFrom: 1,
      durationTo: 60,
      ratings: [],
    });
    if (filtersChoosed || id !== 'all') {
      const newsletterResponse = await getNewslettersList({
        page: 1,
        pageSize: 6,
        order: sortTypes[choosedSortType].value,
        search: search,
      });

      if (newsletterResponse.error) {
        console.error(newsletterResponse.error);
      } else if (newsletterResponse.newslettersListData) {
        setNewslettersData(
          newsletterResponse.newslettersListData as Newsletter
        );
        handleCloseModal();
      }
    } else {
      handleCloseModal();
    }
  };

  const debouncedFetchNewsletters = debounce(async (value: string) => {
    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * (page + 1),
      order: sortTypes[choosedSortType].value,
      search: value,
    });

    if (newsletterResponse.error) {
      console.error(newsletterResponse.error);
    } else if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  }, 1000);

  const handleChangeSearch = (value: string) => {
    setSearch(value);
    debouncedFetchNewsletters(value);
  };

  const applyFilters = async () => {
    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6,
      order: sortTypes[choosedSortType].value,
      search,
      pricingTypes: filtersPayload.pricingType.map(item => item.toLowerCase()),
      ratings: filtersPayload.ratings,
      categoriesIds: filtersPayload.categories,
      durationFrom: filtersPayload.durationFrom,
      durationTo: filtersPayload.durationTo,
      orderDirection:
        sortTypes[choosedSortType].value === 'rating' ? 'DESC' : 'ASC',
    });
    if (newsletterResponse.error) {
      console.error(newsletterResponse.error);
    } else if (newsletterResponse.newslettersListData) {
      handleCloseModal();
      setFiltersChoosed(true);
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  };

  const handleSort = async (value: number) => {
    setChoosedSortType(value);
    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * (page + 1),
      order: sortTypes[value].value,
      orderDirection: sortTypes[value].value === 'rating' ? 'DESC' : 'ASC',
    });
    if (newsletterResponse.error) {
      console.error(newsletterResponse.error);
    } else if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  };

  if (!interests?.length) {
    return <span>loading..</span>;
  }
  return (
    <div className="flex justify-center items-center flex-col pt-20 px-[17%]">
      <div className="max-w-[1280px]">
        <h1 className="text-blue text-7xl font-medium mb-10">Newsletters</h1>
        <div className="flex mb-10 items-center min-w-[500px] md:min-w-[800px]">
          <div className="flex-grow">
            <Input
              isSearch
              placeholder="Search Newsletter Hub"
              wrapperStyles="max-w-[262px]"
              customStyles="h-[48px]"
              iconStyles="!top-3"
              onChange={handleChangeSearch}
            />
          </div>
          <div className="flex gap-4">
            <Button
              variant="outlined-secondary"
              onClick={handleOpenModal}
              label={
                <span
                  className={`flex text-base justify-center px-6 gap-2 ${
                    filtersCount && 'text-primary'
                  }`}
                >
                  <FilterIcon
                    className={`${
                      filtersCount
                        ? 'fill-primary stroke-primary'
                        : 'stroke-grey-chat fill-grey-chat'
                    }`}
                  />
                  Filters {Boolean(filtersCount) && `(${filtersCount})`}
                </span>
              }
            />
            <Modal open={isOpenModal} handleClose={handleCloseModal}>
              <div>
                <h2 className={modalTitleStyles}>
                  What would you like to filter by?
                </h2>
                <div className="flex flex-col gap-9 mb-9">
                  <Accordion
                    label="Categories"
                    isSelected={Boolean(filtersPayload.categories.length)}
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
                          setChecked={value => {
                            if (value) {
                              setFiltersPayload({
                                ...filtersPayload,
                                categories: [
                                  ...filtersPayload.categories,
                                  interest.id,
                                ],
                              });
                            } else {
                              setFiltersPayload({
                                ...filtersPayload,
                                categories: filtersPayload.categories.filter(
                                  item => item !== interest.id
                                ),
                              });
                            }
                          }}
                          checked={filtersPayload.categories.includes(
                            interest.id
                          )}
                        />
                      ))}
                    </div>
                  </Accordion>
                  <Accordion
                    label="Pricing type"
                    isOpen={filters.pricingType}
                    isSelected={Boolean(filtersPayload.pricingType.length)}
                    setIsOpen={value => {
                      setFilters({ ...filters, pricingType: value });
                    }}
                  >
                    <div className="pt-4 pl-9 flex flex-col gap-2">
                      <Checkbox
                        label="Free"
                        setChecked={value => {
                          if (value) {
                            setFiltersPayload({
                              ...filtersPayload,
                              pricingType: [
                                ...filtersPayload.pricingType,
                                'Free',
                              ],
                            });
                          } else {
                            setFiltersPayload({
                              ...filtersPayload,
                              pricingType: filtersPayload.pricingType.filter(
                                item => item !== 'Free'
                              ),
                            });
                          }
                        }}
                        checked={filtersPayload.pricingType.includes('Free')}
                      />
                      <Checkbox
                        label="Paid"
                        setChecked={value => {
                          if (value) {
                            setFiltersPayload({
                              ...filtersPayload,
                              pricingType: [
                                ...filtersPayload.pricingType,
                                'Paid',
                              ],
                            });
                          } else {
                            setFiltersPayload({
                              ...filtersPayload,
                              pricingType: filtersPayload.pricingType.filter(
                                item => item !== 'Paid'
                              ),
                            });
                          }
                        }}
                        checked={filtersPayload.pricingType.includes('Paid')}
                      />
                    </div>
                  </Accordion>
                  <Accordion
                    label="Duration"
                    isOpen={filters.duration}
                    isSelected={Boolean(
                      filtersPayload.durationFrom !== 1 ||
                        filtersPayload.durationTo !== 60
                    )}
                    setIsOpen={value => {
                      setFilters({ ...filters, duration: value });
                    }}
                  >
                    <div className="pl-9">
                      <div className="pt-[18px] mb-2">
                        <Slider
                          min={1}
                          max={60}
                          from={filtersPayload.durationFrom}
                          to={filtersPayload.durationTo}
                          step={1}
                          values={[
                            filtersPayload.durationFrom,
                            filtersPayload.durationTo,
                          ]}
                          setValues={values =>
                            setFiltersPayload({
                              ...filtersPayload,
                              durationFrom: values[0],
                              durationTo: values[1],
                            })
                          }
                        />
                      </div>
                      <div className="flex justify-between">
                        <p className="text-lightBlack pl-4 pr-[43px] py-2 border-b-2 border-grey">
                          from&nbsp;
                          <span className="font-semibold">
                            {filtersPayload.durationFrom} minute
                          </span>
                        </p>
                        <p className="text-lightBlack pl-4 pr-[43px] py-2 border-b-2 border-grey">
                          to&nbsp;
                          <span className="font-semibold">
                            {filtersPayload.durationTo} minute
                          </span>
                        </p>
                      </div>
                    </div>
                  </Accordion>
                  <Accordion
                    label="Rating"
                    isOpen={filters.rating}
                    isSelected={Boolean(filtersPayload.ratings.length)}
                    setIsOpen={value => {
                      setFilters({ ...filters, rating: value });
                    }}
                  >
                    <div className="flex flex-col gap-[10px] pt-4 pl-9">
                      {ratings.map(rating => (
                        <Checkbox
                          key={rating}
                          label={<StarRating value={rating} readonly />}
                          setChecked={value => {
                            if (value) {
                              setFiltersPayload({
                                ...filtersPayload,
                                ratings: [...filtersPayload.ratings, rating],
                              });
                            } else {
                              setFiltersPayload({
                                ...filtersPayload,
                                ratings: filtersPayload.ratings.filter(
                                  item => item !== rating
                                ),
                              });
                            }
                          }}
                          checked={filtersPayload.ratings.includes(rating)}
                        />
                      ))}
                    </div>
                  </Accordion>
                </div>
                <div className="flex pl-8 justify-between items-center">
                  <span
                    className="text-base text-lightBlack cursor-pointer"
                    onClick={handleFiltersReset}
                  >
                    Clear
                  </span>
                  <Button
                    label="Apply filters"
                    rounded="xl"
                    fontSize="md"
                    onClick={applyFilters}
                  />
                </div>
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
                      onClick={() => handleSort(index)}
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
        <div>
          {!newslettersData ||
          Boolean(!newslettersData.newsletters?.length) ||
          !newslettersData.newsletters ? (
            <span>Undefined</span>
          ) : (
            newslettersData.newsletters.map((newsletter, index) => {
              const imageLink = encodeURIComponent(newsletter.image as string);
              return (
                <div
                  key={newsletter.id}
                  className={`flex mb-8 gap-8 pb-8 ${
                    newslettersData.newsletters &&
                    index + 1 !== newslettersData.newsletters.length &&
                    'border-b'
                  } border-b-light-grey`}
                >
                  <Image
                    src={`/api/imageproxy/${imageLink}` as string}
                    className="h-[224px] w-[224px] rounded-[10px] object-cover"
                    alt="newsletter"
                    width={224}
                    height={224}
                  />
                  <div className="h-[224px] w-full">
                    <span className="block max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden text-lightBlack font-medium text-xl mb-2">
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
                      <div className="flex gap-2">
                        <Link href={newsletter.link}>
                          <Button
                            label="Read Newsletter"
                            rounded="xl"
                            fontSize="md"
                          />
                        </Link>
                        <Button
                          rounded="xl"
                          fontSize="md"
                          label={
                            <span className="flex items-center gap-2">
                              <PlusIcon />
                              Follow
                            </span>
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {newslettersData &&
            Boolean(newslettersData.newsletters?.length) &&
            newslettersData.total &&
            newslettersData.newsletters &&
            newslettersData.newsletters.length < newslettersData.total && (
              <Button
                label="See more"
                variant="outlined-secondary"
                size="full"
                onClick={loadMoreNewsletters}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { params } = context;
  const categoryId = params && params.id;
  const categoriesIds =
    categoryId && typeof +categoryId === 'number' && categoryId !== 'all'
      ? [+categoryId]
      : [];
  const newsletterList = await getNewslettersList({
    page: 1,
    pageSize: 6,
    order: 'rating',
    orderDirection: 'DESC',
    categoriesIds,
  });
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
