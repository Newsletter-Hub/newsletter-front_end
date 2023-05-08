import Form from '@/components/Login/Form';
import withLayout from '@/components/withLayout';

const Login = () => {
  return (
    <div className="w-full justify-center items-center flex">
      <div className="flex">
        <div className="shadow-md text-center pt-12 px-16 pb-16">
          <h2 className="mb-12 font-medium text-5xl text-lightBlack">Login</h2>
          <Form />
        </div>
      </div>
    </div>
  );
};

export default withLayout(Login, 'entry');
