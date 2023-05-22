import { useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import { Controller, useForm } from 'react-hook-form';

import { COUNTRIES } from '@/config/constants';

import { Country, State } from 'country-state-city';

import { UserMe } from '@/types/user';

import Button from '../Button';
import FileDownloader from '../FileDownloader';
import Input from '../Input';
import Select, { Option } from '../Select';

interface EditProps {
  user: UserMe;
}

const Edit = ({ user }: EditProps) => {
  const [profileType, setProfileType] = useState(user.profileType);
  const [states, setStates] = useState<Option[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    watch,
  } = useForm();

  const watchCountry = watch('country');

  const handleChooseAvatar = (value: File | string) => {
    setValue('avatar', value);
  };

  useEffect(() => {
    const formattedStates = State.getStatesOfCountry(getValues().country).map(
      item => {
        return {
          value: item.name,
          label: item.name,
        };
      }
    );
    setStates(formattedStates);
  }, [watchCountry, getValues]);

  const countries = Country.getAllCountries()
    .filter(item => COUNTRIES.includes(item.name))
    .map(item => {
      return {
        value: item.isoCode,
        label: `${item.flag} ${item.name}`,
      };
    });
  return (
    <div className="pt-10">
      <h3 className="text-xl text-dark-blue font-medium mb-8">Edit profile</h3>
      <form className="font-inter">
        <p className="font-semibold text-lg text-dark-blue mb-2">
          Your profile PIC
        </p>
        <div className="flex items-center gap-6 mb-10">
          <FileDownloader
            setValue={handleChooseAvatar}
            defaultValue={user.avatar}
          />
          <div>
            <span className="text-grey text-sm">
              Format: .png, .jpg, .jpeg.
              <br /> Max size: 5 MB.
              <br /> Recommended dimensions: 200x200 px.
            </span>
          </div>
        </div>
        <p className="font-semibold text-lg text-dark-blue mb-4">
          Profile type
        </p>
        <div className="flex gap-4 max-w-[236px] mb-[76px]">
          <Button
            label="Reader"
            selected={profileType === 'reader'}
            rounded="xl"
            onClick={() => setProfileType('reader')}
          />
          <Button
            label="Writter"
            selected={profileType === 'writter'}
            rounded="xl"
            onClick={() => setProfileType('writter')}
          />
        </div>
        <div className="max-w-[676px] mb-[76px]">
          <p className="font-semibold text-lg text-dark-blue mb-4">
            Personal information
          </p>
          <div className="flex mb-12 max-w-[676px] overflow-hidden gap-6">
            <Input
              label="Enter your name"
              variant="filled"
              placeholder="Enter your name"
              defaultValue={user.username}
              wrapperStyles="w-1/2"
              register={{ ...register('username') }}
            />
            <Input
              label="Enter your email address"
              variant="filled"
              placeholder="Enter your email address"
              defaultValue={user.email}
              wrapperStyles="w-1/2"
              register={{ ...register('email') }}
            />
          </div>
          <Input
            variant="filled"
            customStyles="w-full"
            placeholder="Tell something about yourself"
          />
        </div>
        <div className="max-w-[676px] mb-[76px]">
          <p className="font-semibold text-lg text-dark-blue mb-4">
            Birth information
          </p>
          <Controller
            control={control}
            name="dateBirth"
            render={({ field: { onChange, value } }) => (
              <Datetime
                timeFormat={false}
                dateFormat="DD-MM-yyyy"
                className="w-full mb-12 [&>input]:border-b-2 [&>input]:outline-none [&>input]:border-grey [&>input]:w-full [&>input]:pb-2 [&>input]:text-sm [&>input]:text-dark-blue font-inter [&>input]:pl-4 [&>input]:placeholder:text-dark-grey"
                inputProps={{ placeholder: 'Date of birth' }}
                onChange={onChange}
                value={value}
              />
            )}
          />
          <div className="flex gap-6 mb-10 w-full">
            <Controller
              control={control}
              name="country"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={countries}
                  placeholder="Country"
                  name="country"
                  value={value}
                  onChange={onChange}
                  wrapperStyles="w-full"
                />
              )}
            />
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <Select
                  options={states}
                  placeholder="State"
                  name="state"
                  value={value}
                  onChange={onChange}
                  wrapperStyles="w-full"
                />
              )}
            />
          </div>
        </div>
        <p className="curspr-pointer border-b border-b-dark-blue text-dark-blue text-base font-semibold w-fit mb-21">
          Change password
        </p>
      </form>
    </div>
  );
};

export default Edit;
