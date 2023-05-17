import { getServerSideProps } from '@/helpers/authGetServerSideProps';

const VerifyEmail = () => {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      A verification link has been sent to your email account
    </div>
  );
};

export { getServerSideProps };

export default VerifyEmail;
