import { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UseQueryResult, useQuery } from 'react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FileDownloader from '../FileDownloader';

import { NewsletterFormProps } from '@/assets/types/newsletters';

import { getInterests } from '@/pages/api/user/interests';

import useOnClickOutside from '@/hooks/useOnClickOutside';

import { Interest } from '@/assets/types/interests';
import CrossIcon from '@/assets/icons/cross';

import Button from '../Button';
import Input from '../Input';

const validationSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const DetailsForm = ({ payload, setStep, step }: NewsletterFormProps) => {
  const { data }: UseQueryResult<Interest[], Error> = useQuery(
    'interests',
    getInterests
  );
  const [tags, setTags] = useState<Interest[]>([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const autoCompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [suggests, setSuggests] = useState<Interest[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    console.log(data);
  };
  const onAdd: SubmitHandler<ValidationSchema> = data => {
    console.log(data);
    setStep(step + 1);
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
      if (data) {
        const formattedData = data.filter(item =>
          item.interestName.includes(inputValue)
        );
        setSuggests(formattedData);
      }
    } else {
      setShowAutoComplete(false);
    }
  }, [inputValue, data]);

  useEffect(() => {
    if (data) {
      setSuggests(data);
    }
  }, [data]);

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

  useOnClickOutside(autoCompleteRef, handleClickOutside);

  if (!data) {
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
          <FileDownloader setValue={file => console.log(file)} variant="lg" />
          <div className="border-b-[#A8AFB5] border-b-2 flex gap-3 w-[600px] flex-wrap">
            {Boolean(tags.length) &&
              tags.map(item => (
                <>
                  <div className="flex bg-[#F4F5F6] py-[3px] px-3 rounded-lg gap-3 items-center">
                    <span className="text-[#515E6B] font-inter">
                      {item.interestName}
                    </span>
                    <div onClick={() => handleDeleteTag(item.id)}>
                      <CrossIcon className="cursor-pointer" />
                    </div>
                  </div>
                </>
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
                        className="w-full border-b-[#A8AFB5] border-b text-grey last:border-b-0"
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
      <div className="flex w-full gap-4 mb-8">
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
