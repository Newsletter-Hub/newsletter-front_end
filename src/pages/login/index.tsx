import EntryLayout from '@/components/EntryLayout';
import Form from '@/components/Login/Form';

const Login = () => {
  return (
    <EntryLayout type="login">
      <div className="w-full justify-center items-center flex">
        <div className="flex">
          <div className="shadow-md text-center pt-12 px-16 pb-16">
            <h2 className="mb-21 font-semibold text-4xl text-googleBlack">
              Login
            </h2>
            <Form />
          </div>
        </div>
      </div>
    </EntryLayout>
  );
};

export default Login;
