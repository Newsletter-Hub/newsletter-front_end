import { newsletterUpdateAsOwner } from '@/actions/newsletters';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { z } from 'zod';
import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';
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
import FileDownloader from '../FileDownloader';

interface EditNewsletterProps {
  interests: Interest[];
  newsletterData: NewsletterData;
}

const EditAsOwner = ({ newsletterData, interests }: EditNewsletterProps) => {
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
  const newsletterMutation = useMutation(newsletterUpdateAsOwner);

  const router = useRouter();
  const { newsletterId } = router.query;

  const validationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required field' }),
    description: z
      .string()
      .min(1, { message: 'Description is required field' }),
    image: z
      .union([z.string(), z.unknown()])
      .refine(
        value => {
          return typeof value === 'string' || value instanceof File;
        },
        { message: 'Image is a required field' }
      )
      .refine(
        value => {
          if (typeof value === 'string') {
            return value.trim() !== '';
          } else if (value instanceof File) {
            return value.name !== '';
          }
          return false;
        },
        { message: 'Image is a required field' }
      ),
  });

  type ValidationSchema = z.infer<typeof validationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      image: newsletterData.image,
    },
  });
  const onAdd: SubmitHandler<ValidationSchema> = async data => {
    newsletterMutation.mutate({
      id: Number(newsletterId),
      title: data.title,
      description: data.description,
      link: newsletterData.link,
      image: data.image as File,
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

  const handleSetValue = (value: string | File) => {
    setValue('image', value);
  };

  useOnClickOutside(autoCompleteRef, handleClickOutside);
  if (!interests) {
    return <Loading />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onAdd)}>
        <div className="mb-6">
          <div className="flex flex-col gap-12">
            <Input
              placeholder="Title"
              variant="filled"
              register={{ ...register('title') }}
              customStyles="w-full"
              error={Boolean(errors.title)}
              errorText={errors.title?.message}
              defaultValue={newsletterData.title}
            />
            <TextArea
              placeholder="Description"
              variant="filled"
              register={{ ...register('description') }}
              maxLength={300}
              checkNumberOfSymbols
              customStyles="w-full"
              error={Boolean(errors.description)}
              errorText={errors.description?.message}
              defaultValue={newsletterData.description}
            />
            <FileDownloader
              setValue={handleSetValue}
              variant="lg"
              error={Boolean(errors.image)}
              errorText={errors.image?.message}
              defaultValue={newsletterData.image}
            />
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

export default EditAsOwner;
