import * as RadixPopover from '@radix-ui/react-popover';

interface RadixPopoverProps {
  triggerContent?: string | JSX.Element;
  triggerStyles?: string;
  customTriggerStyles?: string;
  children?: JSX.Element;
  customWrapperStyles?: string;
}

const Popover = ({
  triggerContent,
  triggerStyles,
  customTriggerStyles,
  customWrapperStyles,
  children,
}: RadixPopoverProps) => {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>
        <button
          className={
            triggerStyles ||
            `bg-porcelain font-inter rounded-lg text-lightBlack ${customTriggerStyles} border border-porcelain data-[state=open]:border-primary`
          }
        >
          {triggerContent}
        </button>
      </RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={`bg-white shadow-md rounded-2xl mt-2 ${customWrapperStyles}`}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};

export default Popover;
