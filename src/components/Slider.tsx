import React, { useState } from 'react';

import * as RadixSlider from '@radix-ui/react-slider';

import SliderThumbIcon from '@/assets/icons/sliderThumb';

interface SliderProps {
  from: number;
  to: number;
  min: number;
  max: number;
  step: number;
  values: number[];
  setValues: (values: number[]) => void;
}

const Slider = ({
  from,
  to,
  min,
  max,
  step,
  values,
  setValues,
}: SliderProps) => {
  const handleValueChange = (newValues: number[]) => {
    if (newValues[0] <= newValues[1]) {
      setValues(newValues);
    }
  };

  return (
    <RadixSlider.Root
      className="relative flex items-center select-none touch-none w-full h-5"
      defaultValue={[from, to]}
      min={min}
      max={max}
      step={step}
      aria-label="Volume"
      onValueChange={handleValueChange}
      value={values}
    >
      <RadixSlider.Track className="rounded-full h-[3px] bg-light-grey w-full">
        <RadixSlider.Range className="bg-light-grey rounded-full h-full" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="flex justify-center items-center w-7 h-7 bg-primary shadow-md rounded-full focus:outline-none">
        <SliderThumbIcon />
      </RadixSlider.Thumb>
      <RadixSlider.Thumb className="flex justify-center items-center w-7 h-7 bg-primary shadow-md rounded-full focus:outline-none">
        <SliderThumbIcon />
      </RadixSlider.Thumb>
    </RadixSlider.Root>
  );
};

export default Slider;
