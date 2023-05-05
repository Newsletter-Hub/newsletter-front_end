import ContactUs from '@/assets/images/contactUs';

import Button from '../Button';

const GetStartedBlock = () => {
  return (
    <div className="bg-getStarted h-82">
      <div className="flex w-full h-full">
        <div className="w-2/3 justify-center items-center flex">
          <div>
            <p className="text-5xl">Ready to get started?</p>
            <p className="text-base mb-12">Sign up or contact us</p>
            <Button
              label="Start free trial"
              rounded="md"
              bold
              uppercase
              fontSize="md"
            />
          </div>
          <div></div>
        </div>
        <div className="flex justify-center items-center">
          <ContactUs />
        </div>
      </div>
    </div>
  );
};

export default GetStartedBlock;
