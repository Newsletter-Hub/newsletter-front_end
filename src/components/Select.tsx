import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import * as RadixSelect from '@radix-ui/react-select';
import ArrowDownIcon from '@/assets/icons/arrowDown';

export interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  name?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  value?: string;
  onChange?: () => void;
}

const Select = ({
  options,
  name,
  register,
  placeholder,
  value,
  onChange,
}: SelectProps) => {
  return (
    <div>
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          className="border-b-2 outline-none border-gull-grey w-full text-sm text-gull-grey text-start pb-2 inline-flex items-center justify-between"
          name={name}
          placeholder={placeholder}
        >
          <RadixSelect.Value placeholder={placeholder} {...register} />
          <RadixSelect.Icon>
            <ArrowDownIcon />
          </RadixSelect.Icon>
          <RadixSelect.SelectContent>
            {options.length ? (
              <RadixSelect.Viewport>
                {options.map(item => (
                  <RadixSelect.Item
                    value={item.value}
                    className="bg-white border-b-mercury border-b hover:outline-none hover:bg-light-grey"
                    key={item.value}
                  >
                    <RadixSelect.ItemText> {item.label}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            ) : (
              <span className="bg-white">No options</span>
            )}
          </RadixSelect.SelectContent>
        </RadixSelect.Trigger>
      </RadixSelect.Root>
    </div>
  );
};

export default Select;
