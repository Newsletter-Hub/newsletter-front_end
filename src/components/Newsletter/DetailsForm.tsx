import {
  createNewsletter, // newsletterVerifyOwnership,
} from '@/actions/newsletters';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Image from 'next/image';
import { useRouter } from 'next/router';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import { Interest } from '@/types/interests';
import { NewsletterFormProps } from '@/types/newsletters';

import CrossIcon from '@/assets/icons/cross';
import { useMutation } from 'react-query';

import Button from '../Button';
import Input from '../Input';
import Loading from '../Loading';
import RadioGroup from '../RadioGroup';
import Slider from '../Slider';
import TextArea from '../TextArea';

const DetailsForm = ({ payload, interests, setStep }: NewsletterFormProps) => {
  const [tags, setTags] = useState<Interest[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);
  const [pricingType, setPricingType] = useState<'free' | 'paid'>('free');
  const [averageDuration, setAverageDuration] = useState<number>(1);
  const autoCompleteRef = useRef(null);
  const newsletterMutation = useMutation(createNewsletter);

  const router = useRouter();

  const { handleSubmit } = useForm();

  const handlePreviousStep = () => {
    setStep(1);
  };

  // const onSubmit = async () => {
  //   try {
  //     const response = await newsletterVerifyOwnership({ link: payload.link });
  //     if (response && response.id) {
  //       router.push(`${response.id}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const onAdd = async () => {
    newsletterMutation.mutate({
      link: payload.link,
      title: payload.title,
      description: payload.description,
      image: payload.image,
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
        const formattedData = interests.filter(item =>
          item.interestName.includes(inputValue)
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
      setSuggests(interests);
    }
  }, [interests]);

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
    <form onSubmit={handleSubmit(onAdd)}>
      <div className="mb-6">
        <div className="flex flex-col">
          <Input
            label="Title"
            variant="filled"
            customStyles="w-full mb-4"
            defaultValue={payload.title}
            disabled
          />
          <TextArea
            label="Description"
            variant="filled"
            customStyles="w-full mb-8"
            defaultValue={payload.description}
            disabled
          />
          {payload.image && (
            <div className="flex justify-center mb-8">
              <Image
                src={payload.image}
                alt="newsletter image"
                width={434}
                height={236}
                className="object-cover object-center rounded-3xl w-[434px] h-[236px]"
              />
            </div>
          )}
          <div className="border-b-grey border-b-2 flex gap-3 w-[600px] flex-wrap mb-4">
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
                      : 'Add topics (up to 5) so readers know what your story is about'
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
              defaultValue="free"
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
            <p className="mb-4 text-dark-blue text-xl font-medium">Duration</p>
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
      <div className="flex w-full gap-4 justify-between items-center">
        <span
          className="font-inter text-dark-blue text-base font-semibold border-b border-dark-blue cursor-pointer"
          onClick={handlePreviousStep}
        >
          Back
        </span>
        {/* <Button
          label="Verify Ownership"
          size="full"
          rounded="xl"
          onClick={onSubmit}
          variant="outlined-primary"
          fontSize="md"
        /> */}
        <Button
          label="Add"
          size="full"
          rounded="xl"
          fontSize="md"
          type="submit"
          customStyles="max-w-[400px]"
          loading={newsletterMutation.isLoading}
        />
      </div>
    </form>
  );
};

export default DetailsForm;
