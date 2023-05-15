import {
  newsletterUpdate,
  newsletterVerifyOwnership,
} from '@/actions/newsletters';
import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from 'next/router';

import { zodResolver } from '@hookform/resolvers/zod';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import { Interest } from '@/types/interests';
import { NewsletterFormProps } from '@/types/newsletters';

import CrossIcon from '@/assets/icons/cross';

import Button from '../Button';
import FileDownloader from '../FileDownloader';
import Input from '../Input';

const validationSchema = z.object({
  title: z.string().min(1, { message: 'Title is required field' }),
  description: z.string().min(1, { message: 'Description is required field' }),
  author: z.string().min(1, { message: 'Author is required field' }),
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

const DetailsForm = ({ payload, interests }: NewsletterFormProps) => {
  const [tags, setTags] = useState<Interest[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);

  const autoCompleteRef = useRef(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const onSubmit = async () => {
    try {
      const response = await newsletterVerifyOwnership({ link: payload.link });
      if (response && response.id) {
        router.push(`${response.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onAdd: SubmitHandler<ValidationSchema> = async data => {
    try {
      const response = await newsletterUpdate({
        id: payload.id,
        link: payload.link,
        title: data.title,
        newsletterAuthor: data.author,
        description: data.description,
        image: data.image as File,
        interests: tags.map(item => item.id),
      });
      if (response && response.id) {
        router.push(`${response.id}`);
      }
    } catch (error) {
      console.error(error);
    }
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
    } else {
      setShowAutoComplete(false);
    }
  }, [inputValue, interests]);

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

  const handleClickOutside = () => {
    setShowAutoComplete(false);
    setInputValue('');
  };

  const handleSetValue = (value: string | File) => {
    setValue('image', value);
  };

  useOnClickOutside(autoCompleteRef, handleClickOutside);

  if (!interests) {
    return <p>Loading...</p>;
  }

  return (
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
          />
          <Input
            placeholder="Description"
            variant="filled"
            register={{ ...register('description') }}
            maxLength={300}
            checkNumberOfSymbols
            customStyles="w-full"
            error={Boolean(errors.description)}
            errorText={errors.description?.message}
          />
          <Input
            placeholder="Author"
            variant="filled"
            register={{ ...register('author') }}
            customStyles="w-full"
            error={Boolean(errors.author)}
            errorText={errors.author?.message}
          />
          <FileDownloader
            setValue={handleSetValue}
            variant="lg"
            error={Boolean(errors.image)}
            errorText={errors.image?.message}
          />
          <div className="border-b-grey border-b-2 flex gap-3 w-[600px] flex-wrap">
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
                />
              )}
              {showAutoComplete &&
                (suggests.length ? (
                  <div
                    className="absolute shadow-md bg-white top-6 w-full max-h-24 overflow-scroll"
                    ref={autoCompleteRef}
                  >
                    {suggests.map(item => (
                      <p
                        className="w-full border-b-grey border-b text-grey last:border-b-0"
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
                    <p className="w-full">Nothing..</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-4">
        <Button
          label="Verify Ownership"
          size="full"
          rounded="xl"
          onClick={onSubmit}
          variant="outlined-primary"
          fontSize="md"
        />
        <Button
          label="Add"
          size="full"
          rounded="xl"
          fontSize="md"
          type="submit"
        />
      </div>
    </form>
  );
};

export default DetailsForm;
