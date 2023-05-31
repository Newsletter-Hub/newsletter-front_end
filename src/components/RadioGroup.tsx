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
}

const RadioGroup = ({ options, defaultValue }: RadioGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  return (
    <RadixRadioGroup.Root
      className="flex gap-9"
      defaultValue={defaultValue}
      onValueChange={setSelectedValue}
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
          <span className="font-inter pl-2 text-base text-dark-grey">
            {option.label}
          </span>
        </div>
      ))}
    </RadixRadioGroup.Root>
  );
};

export default RadioGroup;
