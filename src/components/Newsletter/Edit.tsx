import { newsletterUpdate } from '@/actions/newsletters';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
import { NewsletterData } from '@/types/newsletters';

interface EditNewsletterProps {
  interests: Interest[];
  newsletterData: NewsletterData;
}

const Edit = ({ newsletterData, interests }: EditNewsletterProps) => {
  const formattedTags = interests.filter(interest =>
    newsletterData.interests?.some(
      newsletterInterest => newsletterInterest.id === interest.id
    )
  );
  const [tags, setTags] = useState<Interest[]>(formattedTags);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);
  const [pricingType, setPricingType] = useState<
    'free' | 'paid' | 'free_and_paid'
  >(newsletterData.pricing || 'free');
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
    <>
      <form onSubmit={handleSubmit(onAdd)}>
        <div className="mb-6">
          <div className="flex flex-col">
            <p className="text-start max-w-[395px] font-inter text-sm mb-8 text-dark-blue">
              In order to fully edit a newsletter - and its title, image, and
              description, you must be the owner of the newsletter. If you are
              the owner of this newsletter, you may claim it by clicking&nbsp;
              <Link href="/newsletters/claim" legacyBehavior passHref>
                <a target="_blank" rel="noopener noreferrer">
                  here.
                </a>
              </Link>
            </p>
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
                <p className="mb-4 text-dark-blue text-xl font-medium">
                  Topics
                </p>
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
              <p className="mb-4 text-dark-blue text-xl font-medium">
                Pricing Type
              </p>
              <RadioGroup
                defaultValue={newsletterData.pricing}
                options={[
                  { label: 'Free', value: 'free', id: '1' },
                  { label: 'Paid', value: 'paid', id: '2' },
                  { label: 'Free & Paid', value: 'free_and_paid', id: '3' },
                ]}
                setValue={(value: string) =>
                  setPricingType(value as 'free' | 'paid' | 'free_and_paid')
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
    </>
  );
};

export default Edit;
