import { useRef } from 'react';

import { Alegreya } from 'next/font/google';

import clsx from 'clsx';

import * as RadixAccordion from '@radix-ui/react-accordion';

import PlusAccordionIcon from '@/assets/icons/plusAccordion';

const alegreya = Alegreya({ subsets: ['latin'] });

interface AccordionProps {
  label: string;
  children?: JSX.Element;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
  isSelected?: boolean;
}

const Accordion = ({
  label,
  children,
  isOpen,
  setIsOpen,
  isSelected,
}: AccordionProps) => {
  const labelStyles = clsx('flex gap-4 items-center', alegreya.className);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <RadixAccordion.Root collapsible type="single" value={isOpen ? '1' : ''}>
      <RadixAccordion.Item value="1" ref={accordionRef}>
        <RadixAccordion.Trigger
          className="focus:outline-none"
          onClick={handleClick}
        >
          <p className={labelStyles}>
            <PlusAccordionIcon
              className={`${
                isOpen || isSelected ? 'fill-primary' : 'fill-light-grey'
              }`}
            />
            <span
              className={`${
                isOpen || isSelected ? 'text-primary' : 'text-lightBlack'
              } text-xl hover:text-primary`}
            >
              {label}
            </span>
          </p>
        </RadixAccordion.Trigger>
        <RadixAccordion.Content>{children}</RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
};

export default Accordion;
