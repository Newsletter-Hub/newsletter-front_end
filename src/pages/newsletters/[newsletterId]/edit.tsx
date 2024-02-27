import React from 'react';
import parseCookies from 'next-cookies';
import { GetServerSideProps } from 'next';

import { GetNewsletterResponse, getNewsletter } from '@/actions/newsletters';
import { getInterests } from '@/actions/user/interests';
import { useUser } from '@/contexts/UserContext';
import { NewsletterData } from '@/types/newsletters';
import { Interest } from '@/types/interests';
import Edit from '@/components/Newsletter/Edit';
import EditAsOwner from '@/components/Newsletter/EditAsOwner';

interface EditNewsletterProps {
  interests: Interest[];
  newsletterData: NewsletterData;
}

const EditNewsletter = ({ newsletterData, interests }: EditNewsletterProps) => {
  const { user } = useUser();
  const { owner } = newsletterData;
  return (
    <div className="md:shadow-md md:p-12 p-3 pt-6 rounded-3xl max-w-[696px] max-h-[95vh] overflow-y-auto">
      <p className="text-lightBlack font-semibold text-center mb-8 text-5xl">
        Edit Newsletter
      </p>
      {user?.id === owner?.id || user?.profileType === 'admin' ? (
        <EditAsOwner newsletterData={newsletterData} interests={interests} />
      ) : (
        <Edit newsletterData={newsletterData} interests={interests} />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { newsletterId } = context.params as { newsletterId: string };
  const cookies = parseCookies(context);
  const token = cookies.accessToken ? cookies.accessToken : undefined;
  const response: GetNewsletterResponse = await getNewsletter({
    id: parseInt(newsletterId),
    token,
  });
  const interests = await getInterests();

  if (response.error || !interests) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      newsletterData: response.newsletterData,
      interests: interests,
    },
  };
};

EditNewsletter.layout = 'entry';
EditNewsletter.type = 'newsletterEdit';

EditNewsletter.title = 'Edit Newsletter | Newsletter Hub';
EditNewsletter.description =
  'Update information for a newsletter to ensure members of the Newsletter Hub community are seeing accurate and up-to date information.';
export default EditNewsletter;
