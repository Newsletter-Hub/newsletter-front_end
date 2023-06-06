import { getCategories } from '@/actions/user/interests';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: number;
  interestName: string;
  newsletterCount: number;
  image: string;
}

interface CategoriesProps {
  categories: Category[];
}

const Categories = ({ categories }: CategoriesProps) => {
  return (
    <div className="pt-20 w-full flex justify-center">
      <div className="max-w-[1280px] lg:px-10 px-3">
        <h1 className="text-dark-blue xs:text-7xl font-medium mb-10 text-5xl">
          Categories
        </h1>
        <div className="flex flex-wrap -m-2">
          {categories.map(category => {
            const categoryDiv = (
              <div>
                <div className="h-fit">
                  <Image
                    src={category.image}
                    alt="category"
                    width={302}
                    height={204}
                    className="rounded-t-lg object-cover"
                    priority
                  />
                </div>
                <div className="bg-light-porcelain md:p-4 p-2 rounded-b-lg max-w-[302px] h-[88px]">
                  <p
                    className={`${
                      category.newsletterCount
                        ? 'text-dark-blue'
                        : 'text-dark-grey'
                    } font-semibold font-inter xl:text-lg xs:text-base text-sm sm:mb-1 text-ellipsis overflow-hidden max-w-[200px]`}
                  >
                    {category.interestName}
                  </p>
                  <p className="text-dark-grey font-inter xs:text-sm text-xs">
                    {category.newsletterCount} Newsletter
                    {category.newsletterCount > 1 && 's'}
                  </p>
                </div>
              </div>
            );

            if (category.newsletterCount) {
              return (
                <Link
                  href={`categories/${category.id}`}
                  key={category.id}
                  className="md:w-1/3 lg:w-1/4 w-1/2 p-2"
                >
                  {categoryDiv}
                </Link>
              );
            } else {
              return (
                <div key={category.id} className="md:w-1/3 lg:w-1/4 w-1/2 p-2">
                  {categoryDiv}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const categories = await getCategories();
  if (!categories) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      categories: categories,
    },
  };
};
export default Categories;
