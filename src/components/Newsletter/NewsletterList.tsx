import { GetNewsletterListProps } from '@/actions/newsletters';
import {
  GetBookmarkListProps,
  addToBookmark,
  deleteBookmark,
} from '@/actions/newsletters/bookmarks';
import { createReview } from '@/actions/newsletters/reviews';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alegreya } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';

import { format, parseISO } from 'date-fns';

import { Interest } from '@/types/interests';
import {
  Newsletter,
  NewsletterData,
  NewslettersListData,
} from '@/types/newsletters';

import Accordion from '@/components/Accordion';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Popover from '@/components/Popover';
import Slider from '@/components/Slider';
import StarRating from '@/components/StarRating';

import BookmarkIcon from '@/assets/icons/bookmark';
import CheckIcon from '@/assets/icons/check';
import FilterIcon from '@/assets/icons/filter';
import PlusIcon from '@/assets/icons/plus';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SortIcon from '@/assets/icons/sort';
import StarIcon from '@/assets/icons/star';

const alegreya = Alegreya({ subsets: ['latin'] });

interface NewsletterResponse {
  newslettersListData?: NewsletterData[];
  error?: string;
}

type GetNewslettersListType = (
  props: GetNewsletterListProps | GetBookmarkListProps
) => Promise<NewsletterResponse>;

export interface NewslettersPageProps {
  newslettersListData?: NewslettersListData;
  interests?: Interest[];
  getNewslettersList: GetNewslettersListType;
  type: 'bookmark' | 'newsletter';
  isSeparated?: boolean;
  isRated?: boolean;
  isAuthor?: boolean;
  isFollowEnable?: boolean;
  isNewsletterFollowed?: boolean;
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

const validationSchema = z.object({
  rating: z.number({ required_error: 'Rating is required' }),
  comment: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

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

const NewslettersList = ({
  newslettersListData,
  interests,
  getNewslettersList,
  type,
  isSeparated = true,
  isRated = true,
  isAuthor = true,
  isFollowEnable = true,
  isNewsletterFollowed = false,
}: NewslettersPageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [newslettersData, setNewslettersData] = useState<Newsletter>(
    newslettersListData as Newsletter
  );
  const [page, setPage] = useState(1);
  const [choosedSortType, setChoosedSortType] = useState(3);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenReviewModal, setIsOpenReviewModal] = useState<boolean | number>(
    false
  );
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
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ? 'DESC' : 'ASC',
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

  const handleChangeSearch = debounce(async (value: string) => {
    setSearch(value);
    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[choosedSortType].value,
      search: value,
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
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  }, 500);

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
      pageSize: 6 * page,
      order: sortTypes[value].value,
      orderDirection: sortTypes[value].value === 'rating' ? 'DESC' : 'ASC',
      search,
      pricingTypes: filtersPayload.pricingType.map(item => item.toLowerCase()),
      ratings: filtersPayload.ratings,
      categoriesIds: filtersPayload.categories,
      durationFrom: filtersPayload.durationFrom,
      durationTo: filtersPayload.durationTo,
    });
    if (newsletterResponse.error) {
      console.error(newsletterResponse.error);
    } else if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  };
  const handleAddBookmark = async (id: string) => {
    await addToBookmark({ newsletterId: id });
  };

  const handleDeleteBookmark = async (id: string) => {
    const response = await deleteBookmark({ newsletterId: id });
    if (!response.error) {
      const bookmarksResponse = await getNewslettersList({
        page: 1,
        pageSize: 6 * page,
        order: sortTypes[choosedSortType].value,
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ||
          sortTypes[choosedSortType].value === 'data'
            ? 'DESC'
            : 'ASC',
        search,
        pricingTypes: filtersPayload.pricingType.map(item =>
          item.toLowerCase()
        ),
        ratings: filtersPayload.ratings,
        categoriesIds: filtersPayload.categories,
        durationFrom: filtersPayload.durationFrom,
        durationTo: filtersPayload.durationTo,
      });
      if (bookmarksResponse.error) {
        console.error(bookmarksResponse.error);
      } else if (bookmarksResponse.newslettersListData) {
        setNewslettersData(bookmarksResponse.newslettersListData as Newsletter);
      }
    }
  };

  const handleClickBookmark = (id: string) => {
    if (type === 'bookmark') {
      handleDeleteBookmark(id);
    } else if (type === 'newsletter') {
      handleAddBookmark(id);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = async ({
    rating,
    comment,
  }) => {
    if (isOpenReviewModal) {
      await createReview({
        rating,
        comment,
        newsletterId: isOpenReviewModal as number,
      });
      setIsOpenReviewModal(false);
    }
  };

  if (interests && !interests?.length) {
    return <span>loading..</span>;
  }
  return (
    <div
      className={`flex justify-center items-center flex-col ${
        isSeparated && 'pt-20 px-[17%]'
      }`}
    >
      <div className="max-w-[1280px]">
        {isSeparated && (
          <>
            <h1 className="text-dark-blue text-7xl font-medium mb-10">
              {type === 'newsletter' ? 'Newsletters' : 'Bookmarks'}
            </h1>
            <div className="flex mb-10 items-center min-w-[500px] md:min-w-[950px]">
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
                                    categories:
                                      filtersPayload.categories.filter(
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
                                  pricingType:
                                    filtersPayload.pricingType.filter(
                                      item => item !== 'Free'
                                    ),
                                });
                              }
                            }}
                            checked={filtersPayload.pricingType.includes(
                              'Free'
                            )}
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
                                  pricingType:
                                    filtersPayload.pricingType.filter(
                                      item => item !== 'Paid'
                                    ),
                                });
                              }
                            }}
                            checked={filtersPayload.pricingType.includes(
                              'Paid'
                            )}
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
                                    ratings: [
                                      ...filtersPayload.ratings,
                                      rating,
                                    ],
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
                  triggerContent={
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
          </>
        )}
        <div>
          {!newslettersData ||
          Boolean(!newslettersData.newsletters?.length) ||
          !newslettersData.newsletters ? (
            <div
              className={`flex flex-col justify-center items-center ${
                isSeparated && 'pt-16'
              }`}
            >
              <SearchResultsIcon />
              <span className="text-5xl text-lightBlack">
                Sorry! We couldn’t find anything
              </span>
            </div>
          ) : (
            newslettersData.newsletters.map((newsletter, index) => {
              return (
                <div
                  key={newsletter.id}
                  className={`flex mb-8 gap-8 pb-8 ${
                    newslettersData.newsletters &&
                    index + 1 !== newslettersData.newsletters.length &&
                    'border-b'
                  } border-b-light-grey`}
                >
                  <div className="min-w-[224px]">
                    <Image
                      src={newsletter.image || ''}
                      className="h-[224px] w-[224px] rounded-[10px] object-cover"
                      alt="newsletter"
                      width={224}
                      height={224}
                    />
                  </div>
                  <div className="w-full flex flex-col justify-between">
                    <div
                      className={`flex mb-4 font-inter ${
                        isAuthor ? 'justify-between' : 'justify-end'
                      } items-center`}
                    >
                      {isAuthor && (
                        <div className="flex gap-2 items-center">
                          <Avatar
                            src={newsletter.addedByUser?.avatar}
                            width={40}
                            height={40}
                            alt="author avatar"
                            username={newsletter.newsletterAuthor}
                            className="rounded-full max-h-[40px] max-w-full object-cover min-w-[40px]"
                          />
                          <span className="text-sm text-dark-blue">
                            {newsletter.newsletterAuthor}
                          </span>
                        </div>
                      )}
                      <div className="flex gap-6 items-center">
                        {newsletter.averageDuration && (
                          <>
                            <p className="text-sm text-dark-grey">
                              <span className="font-semibold">
                                {newsletter.averageDuration} min&nbsp;
                              </span>
                              read
                            </p>
                            <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
                          </>
                        )}
                        <span className="text-sm text-dark-grey font-semibold">
                          {newsletter.pricing.charAt(0).toUpperCase() +
                            newsletter.pricing.slice(1)}
                        </span>
                        <span className="text-sm text-grey">
                          {format(parseISO(newsletter.createdAt), 'dd.MM.yyyy')}
                        </span>
                      </div>
                    </div>
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
                      <div className={`flex ${isRated && 'gap-6'} mr-10`}>
                        <div
                          onClick={() =>
                            handleClickBookmark(String(newsletter.id))
                          }
                        >
                          <BookmarkIcon
                            className={`cursor-pointer ${
                              type === 'bookmark' && 'fill-dark-blue'
                            }`}
                          />
                        </div>
                        {isRated && (
                          <div
                            onClick={() =>
                              setIsOpenReviewModal(newsletter.id as number)
                            }
                          >
                            <StarIcon className="stroke-lightBlack stroke-[1.5px] cursor-pointer" />
                          </div>
                        )}
                        <Modal
                          open={Boolean(isOpenReviewModal === newsletter.id)}
                          handleClose={() => setIsOpenReviewModal(false)}
                        >
                          <div>
                            <div className="flex gap-6 border-b border-b-light-grey pb-6 mb-6">
                              <Avatar
                                src={newsletter?.addedByUser?.avatar as string}
                                alt="avatar"
                                width={112}
                                height={112}
                                className="rounded-full max-h-[112px] max-w-full object-cover min-w-[112px]"
                                username={newsletter?.addedByUser?.username}
                                customStyles="max-h-[112px] min-w-[112px]"
                              />
                              <div className="flex flex-col">
                                <span className="font-medium text-lightBlack text-xl mb-3">
                                  {newsletter?.newsletterAuthor}
                                </span>
                                <div className="flex items-center mb-3">
                                  <StarRating
                                    readonly
                                    value={
                                      newsletter?.addedByUser?.averageUserRating
                                    }
                                    customStyles="mr-2"
                                  />
                                  <span className="font-inter text-dark-grey text-sm mr-6">
                                    {newsletter?.addedByUser?.amountUserRatings}
                                  </span>
                                  <span className="font-inter text-sm text-dark-grey">
                                    <span className="font-bold">207</span>{' '}
                                    Followers
                                  </span>
                                </div>
                                <span className="font-inter text-sm text-dark-grey">
                                  I create and curate content for both the blog
                                  and our training courses. He also directs the
                                  market research and strategic planning the
                                  site.
                                </span>
                              </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                              <div className="flex gap-4 items-center mb-14">
                                <span className="text-lightBlack font-semibold text-lg font-inter">
                                  Your rating
                                </span>
                                <StarRating
                                  error={Boolean(errors.rating)}
                                  errorText={errors.rating?.message}
                                  setValue={(index: number) =>
                                    setValue('rating', index)
                                  }
                                />
                              </div>
                              <Input
                                variant="filled"
                                placeholder="Go ahead, we are listening..."
                                customStyles="w-full mb-9"
                                register={{ ...register('comment') }}
                              />
                              <div className="flex justify-center">
                                <Button
                                  label="Add"
                                  type="submit"
                                  size="full"
                                  customStyles="max-w-[400px]"
                                  rounded="xl"
                                  height="sm"
                                />
                              </div>
                            </form>
                          </div>
                        </Modal>
                      </div>
                      <div className="flex gap-2">
                        <Link href={newsletter.link}>
                          <Button
                            label="Read Newsletter"
                            rounded="xl"
                            fontSize="md"
                          />
                        </Link>
                        {isFollowEnable && (
                          <Button
                            rounded="xl"
                            fontSize="md"
                            variant={
                              isNewsletterFollowed
                                ? 'outlined-secondary'
                                : 'primary'
                            }
                            customStyles="pl-8 pr-6"
                            label={
                              isNewsletterFollowed ? (
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

export default NewslettersList;
