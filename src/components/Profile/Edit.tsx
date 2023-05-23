import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Datetime from 'react-datetime';
import { Controller, useForm } from 'react-hook-form';

import { COUNTRIES } from '@/config/constants';

import { Country, State } from 'country-state-city';

import { UserMe } from '@/types/user';

import Button from '../Button';
import FileDownloader from '../FileDownloader';
import Input from '../Input';
import Select, { Option } from '../Select';
import ChangePasswordModal from './Modals/ChangePassword';
import VerifyEmailModal from './Modals/VerifyEmail';

export interface EditProfilePayload {
  avatar: string;
  country: string;
  state: string;
  dateOfBirth: string;
  username: string;
  email: string;
  profileType: 'reader' | 'writter';
}
interface EditProps {
  user: UserMe;
  onSubmit: (data: EditProfilePayload) => void;
  setIsDirty: (value: boolean) => void;
  isVerifyEmailModalOpen: boolean;
  setIsVerifyEmailModalOpen: Dispatch<SetStateAction<boolean>>;
}

const Edit = forwardRef(
  (
    {
      user,
      onSubmit,
      setIsDirty,
      isVerifyEmailModalOpen,
      setIsVerifyEmailModalOpen,
    }: EditProps,
    ref
  ) => {
    const [states, setStates] = useState<Option[]>([]);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
      useState(false);

    const handleOpenChangePasswordModal = () => {
      setIsChangePasswordModalOpen(true);
    };

    const handleCloseChangePasswordModal = () => {
      setIsChangePasswordModalOpen(false);
    };

    const {
      handleSubmit,
      control,
      setValue,
      getValues,
      watch,
      reset,
      formState: { isDirty },
    } = useForm({
      defaultValues: {
        avatar: user.avatar,
        country: user.country,
        state: user.state,
        dateOfBirth: user.dateOfBirth,
        username: user.username,
        email: user.email,
        profileType: user.profileType,
        description: user.description,
      },
    });

    useImperativeHandle(ref, () => ({
      resetForm: () => reset(),
      submitForm: () => handleSubmit(onSubmit)(),
    }));

    const watchCountry = watch('country');

    const handleChooseAvatar = (value: File | string) => {
      setValue('avatar', value as string);
    };

    const countries = Country.getAllCountries()
      .filter(item => COUNTRIES.includes(item.name))
      .map(item => {
        return {
          value: item.name,
          label: `${item.flag} ${item.name}`,
        };
      });

    useEffect(() => {
      const choosedCountry = Country.getAllCountries().find(
        item => item.name === getValues().country
      )?.isoCode;
      const formattedStates = State.getStatesOfCountry(choosedCountry).map(
        item => {
          return {
            value: item.name,
            label: item.name,
          };
        }
      );
      setStates(formattedStates);
    }, [watchCountry, getValues]);

    useEffect(() => {
      setIsDirty(isDirty);
    }, [getValues, isDirty, setIsDirty]);

    const handleCloseVerifyEmailModal = () => {
      setIsVerifyEmailModalOpen(false);
    };

    return (
      <div className="pt-10">
        <h3 className="text-xl text-dark-blue font-medium mb-8">
          Edit profile
        </h3>
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
            <Controller
              name="profileType"
              control={control}
              render={({ field }) => (
                <>
                  <Button
                    label="Reader"
                    selected={field.value === 'reader'}
                    rounded="xl"
                    onClick={() => field.onChange('reader')}
                  />
                  <Button
                    label="Writer"
                    selected={field.value === 'writter'}
                    rounded="xl"
                    onClick={() => field.onChange('writter')}
                  />
                </>
              )}
            />
          </div>
          <div className="max-w-[676px] mb-[76px]">
            <p className="font-semibold text-lg text-dark-blue mb-4">
              Personal information
            </p>
            <div className="flex mb-12 max-w-[676px] overflow-hidden gap-6">
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <Input
                    label="Enter your name"
                    variant="filled"
                    placeholder="Enter your name"
                    defaultValue={field.value}
                    wrapperStyles="w-1/2"
                    onChange={e => field.onChange(e.target.value)}
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    label="Enter your email address"
                    variant="filled"
                    placeholder="Enter your email address"
                    defaultValue={field.value}
                    wrapperStyles="w-1/2"
                    onChange={e => field.onChange(e.target.value)}
                  />
                )}
              />
              <VerifyEmailModal
                open={isVerifyEmailModalOpen}
                handleClose={handleCloseVerifyEmailModal}
                email={getValues('email')}
              />
            </div>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input
                  variant="filled"
                  customStyles="w-full"
                  placeholder="Tell something about yourself"
                  defaultValue={field.value}
                  onChange={e => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          <div className="max-w-[676px] mb-[76px]">
            <p className="font-semibold text-lg text-dark-blue mb-4">
              Birth information
            </p>
            <Controller
              control={control}
              name="dateOfBirth"
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
          <p
            onClick={handleOpenChangePasswordModal}
            className="cursor-pointer border-b border-b-dark-blue text-dark-blue text-base font-semibold w-fit mb-21"
          >
            Change password
          </p>
          <ChangePasswordModal
            open={isChangePasswordModalOpen}
            handleClose={handleCloseChangePasswordModal}
          />
        </form>
      </div>
    );
  }
);

Edit.displayName = 'Edit';

export default Edit;
