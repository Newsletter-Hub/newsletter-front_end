import {
  GetNewsletterListProps,
  follow,
  unfollow,
} from '@/actions/newsletters';
import { addToBookmark, deleteBookmark } from '@/actions/newsletters/bookmarks';
import { createReview } from '@/actions/newsletters/reviews';
import { useUser } from '@/contexts/UserContext';
import { FollowingPayload } from '@/types';
import { debounce } from 'lodash';
import React, { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Alegreya } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';

import { Interest } from '@/types/interests';
import { Newsletter, NewslettersListData } from '@/types/newsletters';
import { NewsletterListCtaBlockLayoutType } from './NewsletterListCtaBlock';

import Accordion from '@/components/Accordion';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Popover from '@/components/Popover';
import Slider from '@/components/Slider';
import StarRating from '@/components/StarRating';
import NewsletterListCtaBlock from './NewsletterListCtaBlock';

import CheckIcon from '@/assets/icons/check';
import FilterIcon from '@/assets/icons/filter';
import SearchResultsIcon from '@/assets/icons/searchResults';
import SortIcon from '@/assets/icons/sort';

import { setRedirectPath } from '@/helpers/redirectPathLocalStorage';

import Loading from '../Loading';
import { useMutation } from 'react-query';
import SkeletonImage from '../SkeletonImage';

const alegreya = Alegreya({ subsets: ['latin'] });

interface NewsletterResponse {
  newslettersListData?: NewslettersListData;
  error?: string;
}

type GetNewslettersListType = (
  props: GetNewsletterListProps
) => Promise<NewsletterResponse>;

export interface NewslettersPageProps {
  newslettersListData?: NewslettersListData;
  interests?: Interest[];
  getNewslettersList: GetNewslettersListType;
  type: 'bookmark' | 'newsletter';
  isSeparated?: boolean;
  isRated?: boolean;
  isFollowEnable?: boolean;
  isNewsletterFollowed?: boolean;
  layout?: NewsletterListCtaBlockLayoutType;
  authorId?: number;
  defaultSortType?: 'date' | 'rating';
  title?: string;
  categoryName?: number | string | null;
  categoryId?: string | null;
  subTitle?: string;
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
    label: 'Date added',
    value: 'date',
  },
  {
    label: 'Number of followers',
    value: 'followers',
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
  isFollowEnable = true,
  isNewsletterFollowed = false,
  layout = 'default',
  authorId,
  defaultSortType = 'rating',
  title = 'Trending Newsletters',
  categoryId,
  categoryName,
  subTitle,
}: NewslettersPageProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [pageTitle] = useState(
    categoryName ? `Best ${categoryName} Newsletters` : title
  );
  const [newslettersData, setNewslettersData] = useState<Newsletter>(
    newslettersListData as Newsletter
  );
  const [page, setPage] = useState(1);
  const [choosedSortType, setChoosedSortType] = useState(
    sortTypes.findIndex(item => item.value === defaultSortType)
  );
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
    categories: categoryId === 'all' ? [] : categoryId ? [+categoryId] : [],
    pricingType: [],
    durationFrom: 1,
    durationTo: 60,
    ratings: [],
  });
  const [filtersChoosed, setFiltersChoosed] = useState(false);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [moreNewslettersLoading, setMoreNewslettersLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState<boolean | number>(false);
  const filtersCount = useMemo(() => {
    let count = 0;
    if (filtersPayload.categories.length > 0) count++;
    if (filtersPayload.pricingType.length > 0) count++;
    if (filtersPayload.durationFrom !== 1 || filtersPayload.durationTo !== 60)
      count++;
    if (filtersPayload.ratings.length > 0) count++;
    return count;
  }, [filtersPayload]);

  const [search, setSearch] = useState((router.query.search as string) || '');

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };
  const handleCloseModal = () => {
    setIsOpenModal(false);
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (!filtersPayload.categories.length) newFilters.categories = false;
      if (!filtersPayload.pricingType.length) newFilters.pricingType = false;
      if (filtersPayload.durationFrom === 1 && filtersPayload.durationTo === 60)
        newFilters.duration = false;
      if (!filtersPayload.ratings.length) newFilters.rating = false;
      return newFilters;
    });
  };

  const loadMoreNewsletters = async () => {
    const nextPage = newslettersData.nextPage;
    if (nextPage == null) return;
    setMoreNewslettersLoading(true);

    const newsletterResponse = await getNewslettersList({
      page: nextPage,
      pageSize: 6,
      order: sortTypes[choosedSortType].value,
      authorId: authorId || undefined,
      orderDirection: 'DESC',
      entity: 'Newsletter',
      search,
      categoriesIds: filtersPayload.categories,
    }).finally(() => setMoreNewslettersLoading(false));
    const prevNewsletters = newslettersData.newsletters;
    if (newsletterResponse.newslettersListData) {
      const newNewsletters = newsletterResponse.newslettersListData.newsletters;
      setNewslettersData({
        ...newsletterResponse.newslettersListData,
        newsletters: prevNewsletters
          ? prevNewsletters.concat(newNewsletters)
          : newNewsletters,
      });
      setPage(nextPage);
    }
  };
  const modalTitleStyles = clsx(
    'text-dark-blue md:text-5xl text-2xl mb-6 text-center',
    alegreya.className
  );

  const handleFiltersReset = async () => {
    setFiltersLoading(true);
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
    if (filtersChoosed || categoryId !== 'all') {
      const newsletterResponse = await getNewslettersList({
        page: 1,
        pageSize: 6,
        order: sortTypes[choosedSortType].value,
        orderDirection: 'DESC',
        search: search,
      });

      if (newsletterResponse.newslettersListData) {
        setNewslettersData(
          newsletterResponse.newslettersListData as Newsletter
        );
      }
    }
    setFiltersLoading(false);
    handleCloseModal();
  };

  const handleChangeSearch = debounce(async (value: string) => {
    setSearchLoading(true);
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
      orderDirection: 'DESC',
    }).finally(() => setSearchLoading(false));

    if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  }, 500);

  const applyFilters = async () => {
    if (filtersCount) {
      setFiltersLoading(true);
      const newsletterResponse = await getNewslettersList({
        page: 1,
        pageSize: 6,
        order: sortTypes[choosedSortType].value,
        search,
        pricingTypes: filtersPayload.pricingType.map(item =>
          item.toLowerCase()
        ),
        ratings: filtersPayload.ratings,
        categoriesIds: filtersPayload.categories,
        durationFrom: filtersPayload.durationFrom,
        durationTo: filtersPayload.durationTo,
        orderDirection: 'DESC',
      }).finally(() => setFiltersLoading(false));
      if (newsletterResponse.newslettersListData) {
        handleCloseModal();
        setFiltersChoosed(true);
        setNewslettersData(
          newsletterResponse.newslettersListData as Newsletter
        );
      }
    } else {
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
      handleCloseModal();
    }
  };

  const handleSort = async (value: number) => {
    setChoosedSortType(value);
    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * page,
      order: sortTypes[value].value,
      orderDirection: 'DESC',
      search,
      pricingTypes: filtersPayload.pricingType.map(item => item.toLowerCase()),
      ratings: filtersPayload.ratings,
      categoriesIds: filtersPayload.categories,
      durationFrom: filtersPayload.durationFrom,
      durationTo: filtersPayload.durationTo,
    });
    if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
    }
  };
  const handleAddBookmark = async (id: string) => {
    const response = await addToBookmark({ newsletterId: id });
    if (!response.error) {
      const bookmarksResponse = await getNewslettersList({
        page: 1,
        pageSize: 6 * page,
        order: sortTypes[choosedSortType].value,
        orderDirection: 'DESC',
        search,
        pricingTypes: filtersPayload.pricingType.map(item =>
          item.toLowerCase()
        ),
        ratings: filtersPayload.ratings,
        categoriesIds: filtersPayload.categories,
        durationFrom: filtersPayload.durationFrom,
        durationTo: filtersPayload.durationTo,
      });
      if (bookmarksResponse.newslettersListData) {
        setNewslettersData(bookmarksResponse.newslettersListData as Newsletter);
      }
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    const response = await deleteBookmark({ newsletterId: id });
    if (!response.error) {
      const bookmarksResponse = await getNewslettersList({
        page: 1,
        pageSize: 6 * page,
        order: sortTypes[choosedSortType].value,
        orderDirection: 'DESC',
        search,
        pricingTypes: filtersPayload.pricingType.map(item =>
          item.toLowerCase()
        ),
        ratings: filtersPayload.ratings,
        categoriesIds: filtersPayload.categories,
        durationFrom: filtersPayload.durationFrom,
        durationTo: filtersPayload.durationTo,
      });
      if (bookmarksResponse.newslettersListData) {
        setNewslettersData(bookmarksResponse.newslettersListData as Newsletter);
      }
    }
  };

  const handleClickBookmark = async (id: string, isInBookmarks?: boolean) => {
    if (user) {
      if (type === 'bookmark') {
        handleDeleteBookmark(id);
      } else if (type === 'newsletter') {
        if (isInBookmarks) {
          handleDeleteBookmark(id);
        } else {
          handleAddBookmark(id);
        }
      }
    } else {
      const storedRedirectPath = `/newsletters/${id}`;
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    }
  };
  const reviewMutation = useMutation(createReview);
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
      reviewMutation
        .mutateAsync({
          rating,
          comment,
          newsletterId: isOpenReviewModal as number,
        })
        .finally(() => setIsOpenReviewModal(false));
    }
  };

  const handleFollow = async ({ entityId, followed }: FollowingPayload) => {
    if (!user) {
      const storedRedirectPath = `/newsletters/${entityId}`;
      setRedirectPath(storedRedirectPath);
      router.push('/sign-up');
    } else {
      setFollowLoading(entityId);
      if (followed) {
        const response = await unfollow({ entityId, entityType: 'Newsletter' });
        if (response?.ok) {
          const response = await getNewslettersList({
            page: 1,
            pageSize: 6 * page,
            order: sortTypes[choosedSortType].value,
            orderDirection: 'DESC',
            search,
            pricingTypes: filtersPayload.pricingType.map(item =>
              item.toLowerCase()
            ),
            ratings: filtersPayload.ratings,
            categoriesIds: filtersPayload.categories,
            durationFrom: filtersPayload.durationFrom,
            durationTo: filtersPayload.durationTo,
            authorId: authorId || undefined,
          });
          if (response.newslettersListData) {
            setNewslettersData(response.newslettersListData as Newsletter);
          }
        }
      } else {
        const response = await follow({ entityId, entityType: 'Newsletter' });
        if (response?.ok) {
          const response = await getNewslettersList({
            page: 1,
            pageSize: 6 * page,
            order: sortTypes[choosedSortType].value,
            orderDirection: 'DESC',
            search,
            pricingTypes: filtersPayload.pricingType.map(item =>
              item.toLowerCase()
            ),
            ratings: filtersPayload.ratings,
            categoriesIds: filtersPayload.categories,
            durationFrom: filtersPayload.durationFrom,
            durationTo: filtersPayload.durationTo,
            authorId: authorId || undefined,
          });
          if (response) {
            setNewslettersData(response.newslettersListData as Newsletter);
          }
        }
      }
      setFollowLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col md:pt-20 pt-3 px-3">
      <div
        className={`xl:w-[1280px] w-[300px] xs:w-[350px] sm:w-[400px] md:w-fit px-3 ${
          !isSeparated && 'xl:!w-fit max-w-[1280px]'
        }`}
      >
        <h1
          className={`text-dark-blue md:text-7xl text-5xl font-medium ${
            !subTitle && 'mb-10'
          }`}
        >
          {pageTitle}
        </h1>
        {subTitle && (
          <p className="font-inter text-dark-grey text-lg mb-10">{subTitle}</p>
        )}
        {isSeparated && (
          <div className="flex mb-10 md:items-center justify-between md:min-w-[735px] lg:min-w-[1000px] flex-col md:flex-row gap-4 md:gap-0">
            <div className="lg:flex-grow">
              <Input
                isSearch
                placeholder="Search Newsletter Hub"
                wrapperStyles="md:max-w-[262px]"
                customStyles="h-[48px] w-full"
                iconStyles="!top-3"
                onChange={e => handleChangeSearch(e.target.value)}
                defaultValue={(router.query.search as string) || ''}
              />
            </div>
            <div className="flex md:gap-4 md:w-fit w-full gap-2 flex-col md:flex-row">
              <Button
                variant="outlined-secondary"
                onClick={handleOpenModal}
                height="base"
                customStyles="w-full md:max-w-[200px] group"
                label={
                  <span
                    className={`flex text-base justify-center px-6 gap-2 whitespace-nowrap ${
                      filtersCount && 'text-primary'
                    }`}
                  >
                    <FilterIcon
                      className={`${
                        filtersCount
                          ? 'fill-primary stroke-primary'
                          : 'stroke-grey-chat fill-grey-chat group-hover:stroke-white group-hover:fill-white'
                      }`}
                    />
                    Filters {Boolean(filtersCount) && `(${filtersCount})`}
                  </span>
                }
              />
              <Modal
                open={isOpenModal}
                handleClose={handleCloseModal}
                customStyles="min-h-[472px]"
              >
                {interests && interests?.length ? (
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
                        <div className="pt-4 pl-9 grid md:grid-cols-2 gap-4">
                          {interests?.map((interest, index) => (
                            <Checkbox
                              id={index}
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
                            id="free"
                            label="Free"
                            setChecked={value => {
                              if (value) {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType: [
                                    ...filtersPayload.pricingType,
                                    'free',
                                  ],
                                });
                              } else {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType:
                                    filtersPayload.pricingType.filter(
                                      item => item !== 'free'
                                    ),
                                });
                              }
                            }}
                            checked={filtersPayload.pricingType.includes(
                              'free'
                            )}
                          />
                          <Checkbox
                            id="paid"
                            label="Paid"
                            setChecked={value => {
                              if (value) {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType: [
                                    ...filtersPayload.pricingType,
                                    'paid',
                                  ],
                                });
                              } else {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType:
                                    filtersPayload.pricingType.filter(
                                      item => item !== 'paid'
                                    ),
                                });
                              }
                            }}
                            checked={filtersPayload.pricingType.includes(
                              'paid'
                            )}
                          />
                          <Checkbox
                            id="free_and_paid"
                            label="Free & Paid"
                            setChecked={value => {
                              if (value) {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType: [
                                    ...filtersPayload.pricingType,
                                    'free_and_paid',
                                  ],
                                });
                              } else {
                                setFiltersPayload({
                                  ...filtersPayload,
                                  pricingType:
                                    filtersPayload.pricingType.filter(
                                      item => item !== 'free_and_paid'
                                    ),
                                });
                              }
                            }}
                            checked={filtersPayload.pricingType.includes(
                              'free_and_paid'
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
                        <div className="md:pl-9">
                          <div className="pt-[18px] mb-2">
                            <Slider
                              min={1}
                              max={60}
                              step={1}
                              values={[
                                filtersPayload.durationFrom,
                                filtersPayload.durationTo,
                              ]}
                              setValues={values => {
                                if (Array.isArray(values)) {
                                  setFiltersPayload({
                                    ...filtersPayload,
                                    durationFrom: values[0],
                                    durationTo: values[1],
                                  });
                                }
                              }}
                            />
                          </div>
                          <div className="flex justify-between">
                            <p className="text-lightBlack md:pl-4 md:pr-[43px] py-2 border-b-2 border-grey text-sm md:text-base">
                              from&nbsp;
                              <span className="font-semibold">
                                {filtersPayload.durationFrom} minute
                              </span>
                            </p>
                            <p className="text-lightBlack md:pl-4 md:pr-[43px] py-2 border-b-2 border-grey text-sm md:text-base">
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
                              id={`${rating}star`}
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
                    <div className="flex md:pl-8 justify-between items-center">
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
                        customStyles="text-sm md:text-base min-w-[155px]"
                        onClick={applyFilters}
                        loading={filtersLoading}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="h-[432px]">
                    <Loading />
                  </div>
                )}
              </Modal>
              <Popover
                customTriggerStyles="md:w-[200px]"
                triggerContent={
                  <div className="flex items-center justify-center md:gap-4 h-12">
                    <span className="whitespace-nowrap text-sm">
                      {sortTypes[choosedSortType].label}
                    </span>
                    <SortIcon className="min-w-4 min-h-4" />
                  </div>
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
        )}
        {!searchLoading ? (
          <div>
            {!newslettersData ||
            Boolean(!newslettersData.newsletters?.length) ||
            !newslettersData.newsletters ? (
              <div
                className={`flex flex-col justify-center items-center ${
                  isSeparated && 'md:pt-16'
                }`}
              >
                <SearchResultsIcon />
                <span className="text-5xl text-lightBlack text-center">
                  Sorry! We couldn’t find anything
                </span>
              </div>
            ) : (
              newslettersData.newsletters.map((newsletter, index) => {
                return (
                  <div
                    key={newsletter.id}
                    className={`md:flex mb-8 gap-8 pb-8 flex-col md:flex-row ${
                      newslettersData.newsletters &&
                      index + 1 !== newslettersData.newsletters.length &&
                      'border-b'
                    } border-b-light-grey`}
                  >
                    <div className="lg:min-w-[224px] min-w-[112px]">
                      <SkeletonImage
                        src={
                          newsletter.image || 'https://i.imgur.com/kZMNj7Q.jpeg'
                        }
                        className="lg:h-[224px] lg:w-[224px] md:h-[122px] md:w-[112px] h-[170px] rounded-[10px] object-cover w-full mb-3 md:mb-0"
                        alt="newsletter"
                        width={224}
                        height={224}
                        priority
                      />
                    </div>
                    <div className="w-full flex flex-col justify-between">
                      <div className="flex flex-col md:flex-row mb-4 font-inter items-center">
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
                            {newsletter.pricing === 'free_and_paid'
                              ? 'Free & Paid'
                              : newsletter.pricing.charAt(0).toUpperCase() +
                                newsletter.pricing.slice(1)}
                          </span>
                          <div className="w-1.5 h-1.5 bg-light-grey rounded-full"></div>
                          <p className="text-sm text-dark-grey">
                            <span className="font-semibold">
                              {newsletter.amountFollowers}
                            </span>
                            &nbsp;Follower
                            {newsletter.amountFollowers !== 1 && 's'}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/newsletters/${newsletter.id}`}
                        className="block max-w-[650px] whitespace-nowrap text-ellipsis overflow-hidden text-lightBlack font-medium text-xl mb-2 cursor-pointer"
                      >
                        {newsletter.title}
                      </Link>
                      <span className="font-inter text-base text-lightBlack mb-6">
                        {newsletter.description}
                      </span>
                      <div className="flex mb-6 gap-2 max-w-[300px] md:max-w-none flex-wrap">
                        {newsletter.interests?.map(interest => (
                          <span
                            key={interest.id}
                            className="bg-primary/10 text-primary rounded-lg px-[14px] py-2 text-base font-inter"
                          >
                            {interest.interestName}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center md:flex-row flex-col gap-5 md:gap-0 justify-between">
                        <NewsletterListCtaBlock
                          newsletter={newsletter}
                          layout={layout}
                          isRated={isRated}
                          isFollowEnable={isFollowEnable}
                          handleClickBookmark={handleClickBookmark}
                          setIsOpenReviewModal={setIsOpenReviewModal}
                          setRedirectPath={setRedirectPath}
                          handleSubmit={handleSubmit}
                          register={register}
                          setValue={setValue}
                          errors={errors}
                          onSubmit={onSubmit}
                          handleFollow={handleFollow}
                          isOpenReviewModal={isOpenReviewModal}
                          reviewMutation={reviewMutation}
                          followLoading={followLoading}
                          isNewsletterFollowed={isNewsletterFollowed}
                          type={type}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {newslettersData && Boolean(newslettersData.nextPage) && (
              <Button
                label="See more"
                variant="outlined-secondary"
                size="full"
                onClick={loadMoreNewsletters}
                loading={moreNewslettersLoading}
              />
            )}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default NewslettersList;
