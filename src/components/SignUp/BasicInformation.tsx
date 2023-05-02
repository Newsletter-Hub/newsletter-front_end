import {
  SetStateAction,
  Dispatch,
  useEffect,
  useState,
  useContext,
} from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Country, State } from 'country-state-city';

import { COUNTRIES } from '@/config/constants';
import { Payload as SignupPayload } from '@/assets/types/signup-types';
import { UserContext } from '@/pages/sign-up/[token]';

import { Option } from '../Select';
import Select from '../Select';
import Button from '../Button';
import Input from '@/components/Input';

interface Field {
  placeholder: 'Month' | 'Day' | 'Year';
  name: 'month' | 'day' | 'year' | 'country' | 'state';
}

const fields: Field[] = [
  { placeholder: 'Month', name: 'month' },
  { placeholder: 'Day', name: 'day' },
  { placeholder: 'Year', name: 'year' },
];

interface Payload {
  month?: string;
  day?: string;
  year?: string;
  country?: string;
  state?: string;
}

interface BasicInformationProps {
  payload: object;
  setPayload: Dispatch<SetStateAction<SignupPayload>>;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
}

const BasicInformation = ({
  payload,
  setPayload,
  setPage,
  page,
}: BasicInformationProps) => {
  const [states, setStates] = useState<Option[]>([]);
  const user = useContext(UserContext);
  const { register, handleSubmit, control, getValues, watch } =
    useForm<Payload>({
      defaultValues: {
        country: user.country,
        state: user.state,
        year: user.year,
        month: user.month,
        day: user.day,
      },
    });

  const watchCountry = watch('country');

  const onSubmit: SubmitHandler<Payload> = data => {
    setPayload({
      ...payload,
      country: data.country,
      state: data.state,
      year: data.year,
      month: data.month,
      day: user.day,
    });
    setPage(page + 1);
  };

  //   const handlePreviousStep = () => setPage(page - 1);

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
      <div className="flex gap-2 mb-7">
        {fields.map(field => (
          <div key={field.name}>
            <Input
              placeholder={field.placeholder}
              variant="filled"
              customStyles="w-full !pb-0 placeholder:text-sm"
              type="number"
              register={{ ...register(field.name, { min: 1, max: 12 }) }}
            />
          </div>
        ))}
      </div>
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
