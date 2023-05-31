import * as RadixCheckbox from '@radix-ui/react-checkbox';

import CheckIcon from '@/assets/icons/check';

interface CheckboxProps {
  label?: string | JSX.Element;
  checked: boolean;
  setChecked: (arg: boolean) => void;
}

const Checkbox = ({ label, checked, setChecked }: CheckboxProps) => {
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
