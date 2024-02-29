import { useState } from 'react';
import { GetStaticProps } from 'next';

import { Interest } from '@/types/interests';
import { AddNewsletterPayload } from '@/types/newsletters';

import DetailsForm from '@/components/Newsletter/DetailsForm';
import LinkForm from '@/components/Newsletter/LinkForm';

import { getInterests } from '../../actions/user/interests';
import PrivateRoute from '@/components/PrivateRoute';

interface AddNewsletterProps {
  interests?: Interest[];
}

const AddNewsletter = ({ interests }: AddNewsletterProps) => {
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
    <PrivateRoute>
      <div className="md:shadow-md md:p-12 p-3 pt-6 md:pt-12 rounded-3xl max-w-[696px] max-h-[95vh] overflow-y-auto">
        <p className="text-lightBlack font-semibold text-center mb-8 text-5xl">
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
            interests={interests}
          />
        )}
      </div>
    </PrivateRoute>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const interests = await getInterests();
  if (!interests) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      interests: interests,
    },
  };
};

AddNewsletter.layout = 'entry';
AddNewsletter.type = 'newsletter';

AddNewsletter.title = 'Add Newsletter | Newsletter Hub';
AddNewsletter.description =
  'Share a newsletter you love reading or one you own yourself with a community of enthusiasts.';
export default AddNewsletter;
