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
    <div className="px-[10%] pt-20">
      <h1 className="text-dark-blue text-7xl font-medium mb-10">Categories</h1>
      <div className="flex flex-wrap -m-2">
        {categories.map(category => (
          <Link
            href={`categories/${category.id}`}
            key={category.id}
            className="w-1/4 p-2"
          >
            <div>
              <Image
                src={category.image}
                alt="category"
                width={302}
                height={204}
                className="rounded-t-lg min-h-[204px] object-cover"
              />
              <div className="bg-light-porcelain p-4 rounded-b-lg max-w-[302px]">
                <p className="text-dark-blue font-semibold font-inter text-lg mb-1 xl:whitespace-nowrap">
                  {category.interestName}
                </p>
                <p className="text-dark-grey font-inter text-sm">
                  {category.newsletterCount} Newsletter
                </p>
              </div>
            </div>
          </Link>
        ))}
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
