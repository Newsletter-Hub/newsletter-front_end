import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useRouter } from 'next/router';

import {
  newsletterUpdate,
  newsletterVerifyOwnership,
} from '@/pages/api/newsletters';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import { Interest } from '@/types/interests';
import { NewsletterFormProps } from '@/types/newsletters';

import CrossIcon from '@/assets/icons/cross';

import Button from '../Button';
import FileDownloader from '../FileDownloader';
import Input from '../Input';

interface NewsletterAddPayload {
  title?: string;
  description?: string;
  author?: string;
}

const DetailsForm = ({ payload, interests }: NewsletterFormProps) => {
  const [tags, setTags] = useState<Interest[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);
  const [image, setImage] = useState<string | Blob>('');

  const autoCompleteRef = useRef(null);

  const router = useRouter();

  const { register, handleSubmit } = useForm<NewsletterAddPayload>();

  const onSubmit: SubmitHandler<NewsletterAddPayload> = () => {
    newsletterVerifyOwnership({ link: payload.link })
      .then(response => {
        if (response && response.ok) {
          router.push('/');
        }
      })
      .catch(error => console.log(error));
  };

  const onAdd: SubmitHandler<NewsletterAddPayload> = data => {
    newsletterUpdate({
      id: payload.id,
      link: payload.link,
      title: data.title,
      newsletterAuthor: data.author,
      description: data.description,
      image: image,
      interests: tags.map(item => item.id),
    })
      .then(response => {
        if (response.ok) {
          router.push('/');
        }
      })
      .catch(error => console.log(error));
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

  const handleSetValue = (value: string | Blob) => setImage(value);

  useOnClickOutside(autoCompleteRef, handleClickOutside);

  if (!interests) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <div className="flex flex-col gap-12">
          <Input
            placeholder="Title"
            variant="filled"
            register={{ ...register('title') }}
            customStyles="w-full"
          />
          <Input
            placeholder="Description"
            variant="filled"
            register={{ ...register('description') }}
            maxLength={300}
            checkNumberOfSymbols
            customStyles="w-full"
          />
          <Input
            placeholder="Author"
            variant="filled"
            register={{ ...register('author') }}
            customStyles="w-full"
          />
          <FileDownloader setValue={handleSetValue} variant="lg" />
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
          type="submit"
          variant="outlined-primary"
          fontSize="md"
        />
        <Button
          label="Add"
          size="full"
          rounded="xl"
          fontSize="md"
          onClick={handleSubmit(onAdd)}
        />
      </div>
    </form>
  );
};

export default DetailsForm;
