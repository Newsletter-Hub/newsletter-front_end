import Link from 'next/link';

import ContactUs from '@/assets/images/contactUs';

import Button from '../Button';

const GetStartedBlock = () => {
  return (
    <div className="bg-getStarted h-82">
      <div className="flex w-full h-full">
        <div className="md:w-2/3 w-full justify-center items-center flex">
          <div className="w-full md:w-fit flex flex-col items-center gap-3 px-2 md:block">
            <p className="text-4xl">Ready to get started?</p>
            <p className="text-base md:mb-12">Sign up or contact us</p>
            <Link href="/sign-up">
              <Button
                label="Sign up"
                rounded="xl"
                fontSize="md"
                customStyles="w-full md:w-fit"
              />
            </Link>
          </div>
          <div></div>
        </div>
        <div className="md:flex justify-center items-center hidden">
          <ContactUs />
        </div>
      </div>
    </div>
  );
};

export default GetStartedBlock;
