import ArrowLeft from '@/assets/icons/arrowLeft';
import Image from 'next/image';
import notFoundImage from '@/assets/images/notFoundImage.svg';
import Button from '@/components/Button';
import { useRouter } from 'next/router';

const Page_404 = () => {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-[1280px] flex flex-row px-10">
        <div className="pt-[160px] pb-[108px]">
          <h1 className="text-7xl text-dark-blue font-medium mb-6 xl:whitespace-nowrap lg:text-6xl">
            Sorry! Page not found
          </h1>
          <p className="text-dark-grey text-xl lg:text-lg font-medium mb-10">
            Cannot seem to find the page you were looking for. <br /> Please
            check the link URL and try again.
          </p>
          <Button
            rounded="xl"
            label={
              <span className="flex items-center gap-2 text-base">
                <ArrowLeft className="stroke-white" />
                Back
              </span>
            }
            onClick={goBack}
          />
        </div>
        <div className="w-auto hidden lg:block">
          <Image src={notFoundImage} alt="404" priority />
        </div>
      </div>
    </div>
  );
};

export default Page_404;
