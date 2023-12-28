import Link from 'next/link';

import ContactUs from '@/assets/images/contactUs';

const GetStartedBlock = () => {
  return (
    <div className="bg-getStarted h-82">
      <div className="flex w-full h-full">
        <div className="md:w-2/3 w-full justify-center items-center flex">
          <div className="w-full md:w-fit flex flex-col items-center gap-3 px-2 md:block">
            <p className="text-4xl">
              For business inquires, feedback, or support{' '}
            </p>
            <p className="text-base md:mb-12">
              Email us at&nbsp;
              <Link href="mailto: team@newsletterhub.co">
                team@newsletterhub.co
              </Link>
            </p>
          </div>
          <div></div>
        </div>
        <div className="md:flex justify-center items-center hidden">
          <Link href="mailto: team@newsletterhub.co">
            <ContactUs />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStartedBlock;
