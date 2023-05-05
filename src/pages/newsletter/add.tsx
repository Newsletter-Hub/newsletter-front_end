import EntryLayout from '@/components/EntryLayout';
import Link from 'next/link';
import { useState } from 'react';
import { AddNewsletterPayload } from '@/assets/types/newsletters';
import LinkForm from '@/components/Newsletter/LinkForm';
import DetailsForm from '@/components/Newsletter/DetailsForm';

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
      <div className="shadow-md p-12 rounded-3xl">
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
