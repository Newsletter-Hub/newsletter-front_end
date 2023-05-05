import { useState } from 'react';

import Link from 'next/link';

import { AddNewsletterPayload } from '@/types/newsletters';

import EntryLayout from '@/components/EntryLayout';
import DetailsForm from '@/components/Newsletter/DetailsForm';
import LinkForm from '@/components/Newsletter/LinkForm';

const AddNewsletter = () => {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<AddNewsletterPayload>({
    link: '',
    title: '',
    description: '',
    author: '',
    image: '',
    topics: [],
  });

  return (
    <EntryLayout type="newsletter">
      <div className="shadow-md p-12 rounded-3xl max-w-[696px] max-h-[95vh] overflow-y-auto">
        <p className="text-3xl text-googleBlack font-semibold text-center mb-8 text-[40px]">
          Add Newsletter
        </p>
        {step === 1 ? (
          <LinkForm
            setPayload={setPayload}
            payload={payload}
            step={step}
            setStep={setStep}
          />
        ) : (
          <DetailsForm
            setPayload={setPayload}
            payload={payload}
            step={step}
            setStep={setStep}
          />
        )}
        <Link href="/" className="flex justify-center">
          <span className="underline font-semibold font-inter">Skip</span>
        </Link>
      </div>
    </EntryLayout>
  );
};

export default AddNewsletter;
