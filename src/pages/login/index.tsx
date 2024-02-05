import { getServerSideProps } from '@/helpers/authGetServerSideProps';

import Form from '@/components/Login/Form';

const Login = () => {
  return (
    <div className="w-full justify-center items-center flex">
      <div className="lg:shadow-md text-center lg:pt-12 pt-6 lg:px-16 pb-16 px-2 rounded-3xl">
        <h2 className="mb-12 font-medium text-5xl text-lightBlack">Login</h2>
        <Form />
      </div>
    </div>
  );
};

Login.layout = 'entry';
Login.title = 'Login| Newsletter Hub';
Login.description =
  'Login to your Newsletter Hub account, and continue discovering the best email newsletters.';

export { getServerSideProps };

export default Login;
