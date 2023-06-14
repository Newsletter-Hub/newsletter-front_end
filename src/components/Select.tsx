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
  wrapperStyles?: string;
}

const Select = ({
  options,
  name,
  register,
  placeholder,
  value,
  onChange,
  wrapperStyles,
}: SelectProps) => {
  return (
    <div className={wrapperStyles}>
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger
          className="border-b-2 outline-none border-grey w-full text-sm text-dark-grey text-start pb-2 inline-flex items-center justify-between font-inter pr-5 pl-4"
          name={name}
        >
          <RadixSelect.Value placeholder={placeholder} {...register} />
          <RadixSelect.Icon>
            <ArrowDownIcon />
          </RadixSelect.Icon>
          <RadixSelect.SelectContent>
            {options.length ? (
              <RadixSelect.Viewport className="top-10 shadow-md rounded-lg bg-white border-t border-t-light-grey">
                <div className="max-h-[250px] overflow-auto">
                  {options.map(item => (
                    <RadixSelect.Item
                      value={item.value}
                      className="bg-white font-inter text-dark-blue text-base hover:outline-none focus:outline-none py-2 pl-4 hover:bg-porcelain"
                      key={item.value}
                    >
                      <RadixSelect.ItemText> {item.label}</RadixSelect.ItemText>
                    </RadixSelect.Item>
                  ))}
                </div>
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
