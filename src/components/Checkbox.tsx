import * as RadixCheckbox from '@radix-ui/react-checkbox';

import CheckIcon from '@/assets/icons/check';

interface CheckboxProps {
  label?: string | JSX.Element;
  checked: boolean;
  setChecked: (arg: boolean) => void;
  id: number | string;
}

const Checkbox = ({ label, checked, setChecked, id }: CheckboxProps) => {
  const handleClick = () => {
    setChecked(!checked);
  };
  return (
    <div className="flex gap-2 items-center">
      <RadixCheckbox.Root
        className={`${
          checked ? 'bg-primary' : 'bg-white border'
        } border-light-grey h-[20px] w-[20px] rounded-md flex justify-center items-center`}
        onClick={handleClick}
        checked={checked}
        id={String(id)}
      >
        <RadixCheckbox.Indicator>
          <CheckIcon className="stroke-white" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={String(id)} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
