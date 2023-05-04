import { useEffect, useState, useContext } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Country, State } from 'country-state-city';

import { COUNTRIES } from '@/config/constants';
import { UserInfoStepsProps } from '@/assets/types/signup';
import { UserContext } from '@/pages/sign-up/user-info';

import { Option } from '../Select';
import Select from '../Select';
import Button from '../Button';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import { format } from 'date-fns';

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
  const { handleSubmit, control, getValues, watch } = useForm<Payload>({
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
      dateBirth: data.dateBirth && format(date, 'dd-MM-yyyy'),
    });
    setPage(page + 1);
  };

  useEffect(() => {
    const formattedStates = State.getStatesOfCountry(getValues().country).map(
      item => {
        return {
          value: item.isoCode,
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
    <form className="max-w-[400px]" onSubmit={handleSubmit(onSubmit)}>
      <p className="text-xs text-grey border-b w-fit mb-3">Birth information</p>
      <Controller
        control={control}
        name="dateBirth"
        render={({ field: { onChange, value } }) => (
          <Datetime
            timeFormat={false}
            dateFormat="DD-MM-yyyy"
            className="[&>input]:border-b-2 [&>input]:outline-none [&>input]:border-gull-grey [&>input]:w-96 [&>input]:pb-3 mb-5 [&>input]:text-sm [&>input]:text-gull-grey"
            inputProps={{ placeholder: 'Date of birth' }}
            onChange={onChange}
            value={value}
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
          render={({ field: { onChange, value } }) => (
            <Select
              options={states}
              placeholder="State"
              name="state"
              value={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="flex gap-2 w-full">
        {/* <Button
          label="Back"
          customStyles="!w-1/2"
          rounded="xl"
          variant="secondary"
          onClick={handlePreviousStep}
        /> */}
        <Button label="Next" type="submit" customStyles="w-full" rounded="xl" />
      </div>
    </form>
  );
};

export default BasicInformation;
