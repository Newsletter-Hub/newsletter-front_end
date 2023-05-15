import { useEffect, useRef, useState } from 'react';

import { Alegreya } from 'next/font/google';

import clsx from 'clsx';

import * as RadixAccordion from '@radix-ui/react-accordion';

import PlusAccordionIcon from '@/assets/icons/plusAccordion';

const alegreya = Alegreya({ subsets: ['latin'] });

interface AccordionProps {
  label: string;
  children?: JSX.Element;
}

const Accordion = ({ label, children }: AccordionProps) => {
  const labelStyles = clsx('flex gap-4 items-center', alegreya.className);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const accordion = accordionRef.current;

    if (!accordion) {
      return;
    }

    const observer = new MutationObserver(() => {
      const state = accordion.getAttribute('data-state');

      if (state === 'open') {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    });

    observer.observe(accordion, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <RadixAccordion.Root collapsible type="single">
      <RadixAccordion.Item value="1" ref={accordionRef}>
        <RadixAccordion.Trigger className="focus:outline-none">
          <p className={labelStyles}>
            <PlusAccordionIcon
              className={`${isOpen ? 'fill-primary' : 'fill-light-grey'}`}
            />
            <span className="text-lightBlack text-xl">{label}</span>
          </p>
        </RadixAccordion.Trigger>
        <RadixAccordion.Content>{children}</RadixAccordion.Content>
      </RadixAccordion.Item>
    </RadixAccordion.Root>
  );
};

export default Accordion;
