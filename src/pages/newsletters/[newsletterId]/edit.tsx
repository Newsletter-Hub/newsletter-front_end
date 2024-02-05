import {
  GetNewsletterResponse,
  getNewsletter,
  newsletterUpdate,
} from '@/actions/newsletters';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import parseCookies from 'next-cookies';

import Image from 'next/image';
import { useRouter } from 'next/router';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import { Interest } from '@/types/interests';

import CrossIcon from '@/assets/icons/cross';
import { useMutation } from 'react-query';

import Button from '@/components/Button';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import RadioGroup from '@/components/RadioGroup';
import Slider from '@/components/Slider';
import TextArea from '@/components/TextArea';
import { GetServerSideProps } from 'next';
import { getInterests } from '@/actions/user/interests';
import { NewsletterData } from '@/types/newsletters';

interface EditNewsletterProps {
  interests: Interest[];
  newsletterData: NewsletterData;
}

const EditNewsletter = ({ newsletterData, interests }: EditNewsletterProps) => {
  const formattedTags = interests.filter(interest =>
    newsletterData.interests?.some(
      newsletterInterest => newsletterInterest.id === interest.id
    )
  );
  const [tags, setTags] = useState<Interest[]>(formattedTags);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('free');
  const [averageDuration, setAverageDuration] = useState<number>(
    newsletterData.averageDuration || 1
  );
  const autoCompleteRef = useRef(null);
  const newsletterMutation = useMutation(newsletterUpdate);

  const router = useRouter();
  const { newsletterId } = router.query;

  const { handleSubmit } = useForm();

  const onAdd = async () => {
    newsletterMutation.mutate({
      id: Number(newsletterId),
      interests: tags.map(item => item.id),
      averageDuration: String(averageDuration),
      pricingType,
      router,
    });
  };

  const handleAddTag = (tag: Interest) => {
    setTags([...tags, tag]);
    const formattedSuggests = suggests.filter(item => item.id !== tag.id);
    setSuggests(formattedSuggests);
  };
  const handleDeleteTag = (tagId: number) => {
    const formattedTags = tags.filter(item => item.id !== tagId);
    setTags(formattedTags);
  };
  useEffect(() => {
    if (inputValue) {
      setShowAutoComplete(true);
      if (interests) {
        const filteredInterests = interests.filter(interest => {
          return !tags.some(tag => tag.id === interest.id);
        });
        const formattedData = filteredInterests.filter(item =>
          item.interestName.toLowerCase().includes(inputValue.toLowerCase())
        );
        setSuggests(formattedData);
      }
    } else if (interests) {
      const formattedSuggests = interests.filter(interest => {
        return !tags.some(tag => tag.id === interest.id);
      });
      setSuggests(formattedSuggests);
    }
  }, [inputValue, interests, tags]);

  useEffect(() => {
    if (interests) {
      const filteredInterests = interests.filter(interest => {
        return !tags.some(tag => tag.id === interest.id);
      });
      setSuggests(filteredInterests);
    }
  }, [interests, tags]);

  useEffect(() => {
    if (tags.length === 5) {
      setShowAutoComplete(false);
      setInputValue('');
    }
  }, [tags]);

  const handleClickInput = () => {
    if (!inputValue && interests) {
      const formattedSuggests = interests.filter(interest => {
        return !tags.some(tag => tag.id === interest.id);
      });
      setSuggests(formattedSuggests);
    }
    setShowAutoComplete(true);
  };

  const handleClickOutside = () => {
    setShowAutoComplete(false);
  };

  useOnClickOutside(autoCompleteRef, handleClickOutside);
  if (!interests) {
    return <Loading />;
  }

  return (
    <div className="md:shadow-md md:p-12 p-3 pt-6 rounded-3xl max-w-[696px] max-h-[95vh] overflow-y-auto">
      <p className="text-lightBlack font-semibold text-center mb-8 text-5xl">
        Edit Newsletter
      </p>
      <form onSubmit={handleSubmit(onAdd)}>
        <div className="mb-6">
          <div className="flex flex-col">
            <Input
              label="Title"
              variant="filled"
              customStyles="!w-full mb-4"
              defaultValue={newsletterData.title}
              disabled
            />
            <TextArea
              label="Description"
              variant="filled"
              customStyles="w-full mb-8"
              defaultValue={newsletterData.description}
              disabled
            />
            {newsletterData.image && (
              <div className="flex justify-center mb-8">
                <Image
                  src={newsletterData.image}
                  alt="newsletter image"
                  width={434}
                  height={236}
                  className="object-cover object-center rounded-3xl w-[434px] h-[236px]"
                />
              </div>
            )}
            <div className="border-b-grey border-b-2 flex gap-3 md:w-[600px] w-[280px] xs:w-[330px] sm:w-[380px] flex-wrap mb-4">
              {Boolean(tags.length) &&
                tags.map(item => (
                  <React.Fragment key={item.id}>
                    <div className="flex bg-[#F4F5F6] py-[3px] px-3 rounded-lg gap-3 items-center">
                      <span className="text-dark-grey font-inter">
                        {item.interestName}
                      </span>
                      <div onClick={() => handleDeleteTag(item.id)}>
                        <CrossIcon className="cursor-pointer" />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              <div className="relative w-full">
                {tags.length < 5 && (
                  <input
                    placeholder={
                      tags.length
                        ? ''
                        : 'Add topics (up to 5) so readers know what story is about'
                    }
                    className={`outline-none w-full`}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onClick={handleClickInput}
                  />
                )}
                {showAutoComplete &&
                  (suggests.length ? (
                    <div
                      className="absolute shadow-md bg-white top-6 w-full max-h-48 overflow-scroll pl-4 z-10"
                      ref={autoCompleteRef}
                    >
                      {suggests.map(item => (
                        <p
                          className="w-full bg-white font-inter text-dark-blue text-base hover:outline-none focus:outline-none py-2 cursor-pointer"
                          key={item.id}
                          onClick={() => handleAddTag(item)}
                        >
                          {item.interestName}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div
                      className="absolute shadow-md bg-white top-6 w-full overflow-scroll"
                      ref={autoCompleteRef}
                    >
                      <p className="w-full font-inter text-base text-dark-blue">
                        Nothing..
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="mb-4">
              <RadioGroup
                defaultValue={newsletterData.pricing}
                options={[
                  { label: 'Free', value: 'free', id: '1' },
                  { label: 'Paid', value: 'paid', id: '2' },
                ]}
                setValue={(value: string) =>
                  setPricingType(value as 'free' | 'paid')
                }
              />
            </div>
            <div>
              <p className="mb-4 text-dark-blue text-xl font-medium">
                Duration
              </p>
              <Slider
                min={1}
                max={60}
                step={1}
                values={averageDuration}
                setValues={values => setAverageDuration(values as number)}
              />
              <p className="text-lightBlack px-2 py-2 border-b-2 border-grey w-fit font-inter pt-2">
                <span className="font-semibold">
                  {averageDuration} minute{averageDuration > 1 && 's'}
                </span>
              </p>
            </div>
          </div>
        </div>
        <Button
          label="Edit"
          size="full"
          rounded="xl"
          fontSize="md"
          type="submit"
          loading={newsletterMutation.isLoading}
        />
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { newsletterId } = context.params as { newsletterId: string };
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : undefined;
  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
    token,
  });
  const interests = await getInterests();

  if (response.error || !interests) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsletterData: response.newsletterData,
      interests: interests,
    },
  };
};

EditNewsletter.layout = 'entry';
EditNewsletter.type = 'newsletterEdit';

EditNewsletter.title = 'Edit Newsletter | Newsletter Hub';
EditNewsletter.description =
  'Update information for a newsletter to ensure members of the Newsletter Hub community are seeing accurate and up-to date information.';
export default EditNewsletter;
