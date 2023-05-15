import { useEffect, useRef, useState } from 'react';

import * as RadixCheckbox from '@radix-ui/react-checkbox';

import CheckIcon from '@/assets/icons/check';

interface CheckboxProps {
  label?: string;
}

const Checkbox = ({ label }: CheckboxProps) => {
  const checkboxRef = useRef<HTMLButtonElement | null>(null);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const checkbox = checkboxRef.current;

    if (!checkbox) {
      return;
    }

    const observer = new MutationObserver(() => {
      const state = checkbox.getAttribute('data-state');

      if (state === 'checked') {
        setChecked(true);
      } else {
        setChecked(false);
      }
    });

    observer.observe(checkbox, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div className="flex gap-2 items-center">
      <RadixCheckbox.Root
        className={`${
          checked ? 'bg-primary' : 'bg-white border'
        } border-light-grey h-[20px] w-[20px] rounded-md flex justify-center items-center`}
        ref={checkboxRef}
      >
        <RadixCheckbox.Indicator>
          <CheckIcon className="stroke-white" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <span>{label}</span>
    </div>
  );
};

export default Checkbox;
