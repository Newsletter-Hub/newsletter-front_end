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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import clsx from 'clsx';

import { format, parseISO } from 'date-fns';

import { Interest } from '@/types/interests';
import { Newsletter, NewslettersListData } from '@/types/newsletters';

import Accordion from '@/components/Accordion';
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

import Loading from '../Loading';
import { useMutation } from 'react-query';
import ReviewModal from '../Modals/ReviewModal';
import BookmarkPlusIcon from '@/assets/icons/bookmarkPlus';

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
  authorId?: number;
  defaultSortType?: 'date' | 'rating';
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
  isFollowEnable = true,
  isNewsletterFollowed = false,
  authorId,
  defaultSortType = 'rating',
}: NewslettersPageProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { id, userId } = router.query;
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
    categories: id === 'all' ? [] : id ? [+id] : [],
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
  };

  const loadMoreNewsletters = async () => {
    setPage(prevPage => prevPage + 1);
    setMoreNewslettersLoading(true);

    const newsletterResponse = await getNewslettersList({
      page: 1,
      pageSize: 6 * (page + 1),
      order: sortTypes[choosedSortType].value,
      authorId: authorId || (userId ? +userId : undefined),
      orderDirection:
        sortTypes[choosedSortType].value === 'rating' ||
        sortTypes[choosedSortType].value === 'date'
          ? 'DESC'
          : 'ASC',
      entity: 'Newsletter',
    }).finally(() => setMoreNewslettersLoading(false));

    if (newsletterResponse.newslettersListData) {
      setNewslettersData(newsletterResponse.newslettersListData as Newsletter);
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
    if (filtersChoosed || id !== 'all') {
      const newsletterResponse = await getNewslettersList({
        page: 1,
        pageSize: 6,
        order: sortTypes[choosedSortType].value,
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ||
          sortTypes[choosedSortType].value === 'date'
            ? 'DESC'
            : 'ASC',
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
      orderDirection:
        sortTypes[choosedSortType].value === 'rating' ||
        sortTypes[choosedSortType].value === 'date'
          ? 'DESC'
          : 'ASC',
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
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ||
          sortTypes[choosedSortType].value === 'date'
            ? 'DESC'
            : 'ASC',
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
      orderDirection:
        sortTypes[value].value === 'rating' || sortTypes[value].value === 'date'
          ? 'DESC'
          : 'ASC',
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
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ||
          sortTypes[choosedSortType].value === 'date'
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
        orderDirection:
          sortTypes[choosedSortType].value === 'rating' ||
          sortTypes[choosedSortType].value === 'date'
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
            orderDirection:
              sortTypes[choosedSortType].value === 'rating' ||
              sortTypes[choosedSortType].value === 'date'
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
            authorId: authorId || (userId ? +userId : undefined),
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
            orderDirection:
              sortTypes[choosedSortType].value === 'rating' ||
              sortTypes[choosedSortType].value === 'date'
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
            authorId: authorId || (userId ? +userId : undefined),
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
    <div
      className={`flex justify-center items-center flex-col ${
        isSeparated && 'pt-20 px-3'
      }`}
    >
      <div className="xl:w-[1280px] max-w-[1280px] w-[300px] xs:w-[350px] sm:w-[400px] md:w-fit px-3">
        {isSeparated && (
          <>
            <h1 className="text-dark-blue md:text-7xl text-4xl font-medium mb-10">
              {type === 'newsletter' ? 'Newsletters' : 'Bookmarks'}
            </h1>
            <div className="flex mb-10 md:items-center justify-between md:min-w-[735px] lg:min-w-[950px] flex-col md:flex-row gap-2 md:gap-0">
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
                  customStyles="w-full md:max-w-[200px]"
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
                            : 'stroke-grey-chat fill-grey-chat'
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
                          isSelected={Boolean(
                            filtersPayload.pricingType.length
                          )}
                          setIsOpen={value => {
                            setFilters({ ...filters, pricingType: value });
                          }}
                        >
                          <div className="pt-4 pl-9 flex flex-col gap-2">
                            <Checkbox
                              id="Free"
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
                              id="Paid"
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
                            {ratings.map((rating, index) => (
                              <Checkbox
                                id={index}
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
                                checked={filtersPayload.ratings.includes(
                                  rating
                                )}
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
          </>
        )}
        {!searchLoading ? (
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
                    className={`md:flex mb-8 gap-8 pb-8 flex-col md:flex-row ${
                      newslettersData.newsletters &&
                      index + 1 !== newslettersData.newsletters.length &&
                      'border-b'
                    } border-b-light-grey`}
                  >
                    <div className="lg:min-w-[224px] min-w-[112px]">
                      <Image
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
                            {newsletter.pricing.charAt(0).toUpperCase() +
                              newsletter.pricing.slice(1)}
                          </span>
                          <div className="w-1.5 h-1.5 bg-light-grey rounded-full md:hidden"></div>
                          <span className="text-sm text-grey">
                            {format(
                              parseISO(newsletter.createdAt),
                              'dd.MM.yyyy'
                            )}
                          </span>
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
                      <div className="flex mb-6 gap-2 max-w-[300px] flex-wrap">
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
                        <div className="flex w-full">
                          <StarRating
                            readonly
                            value={newsletter.averageRating}
                            customStyles="flex-1"
                          />
                          <div className="flex md:mr-10">
                            <div
                              onClick={() =>
                                handleClickBookmark(
                                  String(newsletter.id),
                                  newsletter.isInBookmarks
                                )
                              }
                            >
                              {newsletter.isInBookmarks ? (
                                <BookmarkIcon className="cursor-pointer fill-dark-blue" />
                              ) : (
                                <BookmarkPlusIcon className="cursor-pointer" />
                              )}
                            </div>
                            {isRated && (
                              <div
                                onClick={() => {
                                  if (user) {
                                    setIsOpenReviewModal(
                                      newsletter.id as number
                                    );
                                  } else {
                                    router.push('/sign-up');
                                  }
                                }}
                              >
                                <StarIcon className="stroke-lightBlack stroke-[1.5px] cursor-pointer md:ml-6 ml-3" />
                              </div>
                            )}
                            <ReviewModal
                              register={register}
                              setValue={setValue}
                              errors={errors}
                              newsletter={newsletter}
                              open={Boolean(
                                isOpenReviewModal === newsletter.id
                              )}
                              handleClose={() => setIsOpenReviewModal(false)}
                              onSubmit={handleSubmit(onSubmit)}
                              loading={reviewMutation.isLoading}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-between w-full md:w-auto md:justify-normal">
                          <Link href={newsletter.link} legacyBehavior passHref>
                            <a target="_blank" rel="noopener noreferrer">
                              <Button
                                label="Read Newsletter"
                                rounded="xl"
                                fontSize="md"
                                customStyles="max-w-[150px] md:max-w-none"
                              />
                            </a>
                          </Link>
                          {isFollowEnable && (
                            <Button
                              rounded="xl"
                              fontSize="md"
                              customStyles="md:!w-[140px] !min-w-[125px]"
                              loading={Boolean(followLoading === newsletter.id)}
                              onClick={() =>
                                handleFollow({
                                  entityId: newsletter.id,
                                  followed: newsletter.isFollower,
                                })
                              }
                              variant={
                                isNewsletterFollowed || newsletter.isFollower
                                  ? 'outlined-secondary'
                                  : 'primary'
                              }
                              label={
                                isNewsletterFollowed ||
                                newsletter.isFollower ? (
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
