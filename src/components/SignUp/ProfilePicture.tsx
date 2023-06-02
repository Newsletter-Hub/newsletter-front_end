import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UserContext } from '@/pages/sign-up/user-info';

import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';
import FileDownloader from '../FileDownloader';

interface Payload {
  avatar?: string | Blob;
}

const ProfilePicture = ({
  payload,
  setPayload,
  setPage,
  page,
}: UserInfoStepsProps) => {
  const user = useContext(UserContext);

  const { handleSubmit, setValue } = useForm({
    defaultValues: {
      avatar: user.avatar,
    },
  });

  const handleSetValue = (value: BinaryData | string | File) =>
    setValue('avatar', value as string);

  const handlePreviousStep = () => setPage(page - 1);
  const onSubmit: SubmitHandler<Payload> = data => {
    setPayload({
      ...payload,
      avatar: data.avatar,
    });
    setPage(page + 1);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sm:w-[400px] flex flex-col gap-10 px-3"
    >
      <FileDownloader
        setValue={handleSetValue}
        setPayload={setPayload}
        payload={payload}
      />
      <div className="flex justify-between items-center w-full">
        <span
          className="font-inter text-dark-blue text-base font-semibold border-b border-dark-blue cursor-pointer"
          onClick={handlePreviousStep}
        >
          Back
        </span>
        <Button
          label="Next step"
          type="submit"
          customStyles="w-1/2"
          rounded="xl"
          fontSize="md"
        />
      </div>
    </form>
  );
};

export default ProfilePicture;
