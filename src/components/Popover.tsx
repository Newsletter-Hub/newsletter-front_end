import * as RadixPopover from '@radix-ui/react-popover';

import Button from './Button';

interface RadixPopoverProps {
  buttonLabel: string | JSX.Element;
  children?: JSX.Element;
}

const Popover = ({ buttonLabel, children }: RadixPopoverProps) => {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <button className="bg-porcelain font-inter text-base rounded-lg text-lightBlack">
          {buttonLabel}
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content className="bg-white shadow-md rounded-2xl mt-2">
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
