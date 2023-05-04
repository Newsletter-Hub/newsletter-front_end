import { useState, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { UserContext } from '@/pages/sign-up/user-info';

import { UserInfoStepsProps } from '@/assets/types/signup';

import Button from '../Button';

const validationSchema = z.object({
  profileType: z.string().min(1, { message: 'Username is required field' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

interface IUserType {
  value: string;
  label: string;
}

type IUserTypes = IUserType[];

const userTypes: IUserTypes = [
  { label: 'Reader', value: 'reader' },
  { label: 'Writter', value: 'writter' },
];

const UserType = ({
  payload,
  setPayload,
  setPage,
  page,
}: UserInfoStepsProps) => {
  const user = useContext(UserContext);
  const [type, setType] = useState(user.profileType);

  const handlePreviousStep = () => setPage(page - 1);

  const onSubmit: SubmitHandler<ValidationSchema> = data => {
    setPayload({
      ...payload,
      profileType: data.profileType,
    });
    setPage(page + 1);
  };

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      profileType: user.profileType,
    },
  });

  const isErrors = Boolean(Object.keys(errors).length);

  return (
    <form
      className="w-[400px] flex flex-col gap-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <div className="flex gap-5 w-full">
          {userTypes.map(item => (
            <Button
              label={item.label}
              customStyles="w-full"
              rounded="xl"
              selected={type === item.value}
              fontSize="md"
              key={item.value}
              onClick={e => {
                setType(item.value);
                setValue('profileType', item.value);
                e.preventDefault();
              }}
            />
          ))}
        </div>
        {isErrors && (
          <div className="flex w-full items-center justify-center -bottom-5 absolute">
            <p className="text-red absolute">Please select type</p>
          </div>
        )}
      </div>
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

export default UserType;
