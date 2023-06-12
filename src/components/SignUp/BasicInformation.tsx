import { useContext, useEffect, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { UserContext } from '@/pages/sign-up/user-info';

import { COUNTRIES } from '@/config/constants';

import { Country, State } from 'country-state-city';

import { format, subYears } from 'date-fns';

import { UserInfoStepsProps } from '@/types/signup';

import Button from '../Button';
import { Option } from '../Select';
import Select from '../Select';

interface Payload {
  dateBirth?: string;
  country?: string;
  state?: string;
}

const BasicInformation = ({
  payload,
  setPayload,
  setPage,
  page,
}: UserInfoStepsProps) => {
  const [states, setStates] = useState<Option[]>([]);
  const user = useContext(UserContext);
  const { handleSubmit, control, getValues, watch, setValue } =
    useForm<Payload>({
      defaultValues: {
        country: user.country,
        state: user.state,
        dateBirth: user.dateBirth,
      },
    });

  const watchCountry = watch('country');

  const onSubmit: SubmitHandler<Payload> = data => {
    const date = new Date(data.dateBirth as string);
    setPayload({
      ...payload,
      country: data.country,
      state: data.state,
      dateBirth: data.dateBirth && format(date, 'yyyy-MM-dd'),
    });
    setPage(page + 1);
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
    setValue('state', undefined);
    setStates(formattedStates);
  }, [watchCountry, getValues, setValue]);
  const sixteenYearsAgo = subYears(new Date(), 16);
  const hundredYearsAgo = subYears(new Date(), 100);
  return (
    <form
      className="md:max-w-[400px] max-w-[300px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <p className="text-xs text-dark-blue mb-3 pl-4 font-inter font-semibold">
        Birth information
      </p>
      <Controller
        control={control}
        name="dateBirth"
        render={({ field: { onChange, value } }) => (
          <Datetime
            timeFormat={false}
            dateFormat="DD-MM-yyyy"
            className="[&>input]:border-b-2 [&>input]:outline-none [&>input]:border-grey md:[&>input]:w-96 [&>input]:w-full [&>input]:pb-3 mb-5 [&>input]:text-sm [&>input]:text-dark-blue font-inter [&>input]:pl-4 [&>input]:placeholder:text-dark-grey"
            inputProps={{ placeholder: 'Date of birth' }}
            onChange={onChange}
            value={value}
            initialViewDate={sixteenYearsAgo}
            initialViewMode="years"
            isValidDate={currentDate => {
              return (
                currentDate.isBefore(sixteenYearsAgo) &&
                currentDate.isAfter(hundredYearsAgo)
              );
            }}
          />
        )}
      />
      <div className="flex gap-6 flex-col mb-10">
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
            />
          )}
        />
        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                key={value}
                options={states}
                placeholder="State"
                name="state"
                value={value}
                onChange={onChange}
              />
            );
          }}
        />
      </div>
      <div className="flex items-center justify-center">
        <Button
          label="Next step"
          type="submit"
          customStyles="max-w-[200px]"
          size="full"
          fontSize="md"
          rounded="xl"
        />
      </div>
    </form>
  );
};

export default BasicInformation;
