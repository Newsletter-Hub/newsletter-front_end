import { useContext } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getInterests } from '@/pages/api/user/interests';

import { UserContext } from '@/pages/sign-up/user-info';

import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';
import FileDownloader from '../FileDownloader';

interface Payload {
  avatar?: string;
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

  const handleSetValue = (value: BinaryData | string) =>
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
      className="w-[400px] flex flex-col gap-10"
    >
      <FileDownloader
        setValue={handleSetValue}
        setPayload={setPayload}
        payload={payload}
      />
      <div className="flex gap-2 w-full">
        <Button
          label="Back"
          customStyles="w-full"
          rounded="xl"
          variant="secondary"
          onClick={handlePreviousStep}
          fontSize="md"
        />
        <Button
          label="Next"
          type="submit"
          customStyles="w-full"
          rounded="xl"
          fontSize="md"
        />
      </div>
    </form>
  );
};

export default ProfilePicture;
