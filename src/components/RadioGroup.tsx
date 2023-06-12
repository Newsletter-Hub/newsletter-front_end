import { useState } from 'react';

import * as RadixRadioGroup from '@radix-ui/react-radio-group';

interface RadioGroupOption {
  value: string;
  label: string;
  id: string;
}

interface RadioGroupProps {
  options: RadioGroupOption[];
  defaultValue: string;
  setValue?: (value: string) => void;
}

const RadioGroup = ({ options, defaultValue, setValue }: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (setValue) {
      setValue(value);
    }
  };
  return (
    <RadixRadioGroup.Root
      className="flex gap-9"
      defaultValue={defaultValue}
      onValueChange={handleChange}
    >
      {options.map(option => (
        <div className="flex items-center" key={option.id}>
          <RadixRadioGroup.Item
            className={`bg-white w-[25px] h-[25px] rounded-full outline-none ${
              option.value !== selectedValue && 'border border-light-grey'
            }`}
            value={option.value}
            id={option.id}
          >
            <RadixRadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-white bg-primary rounded-[50%]" />
          </RadixRadioGroup.Item>
          <label
            htmlFor={String(option.id)}
            className="font-inter pl-2 text-base text-dark-grey cursor-pointer"
          >
            {option.label}
          </label>
        </div>
      ))}
    </RadixRadioGroup.Root>
  );
};

export default RadioGroup;
