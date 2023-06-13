import React, { useState } from 'react';

import Logo from '@/assets/images/logo';

interface BurgerMenuProps {
  children: React.ReactNode;
}

const BurgerMenu = ({ children }: BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button
        className="focus:outline-none z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white dark:bg-gray-900 transition-all duration-500 ease-in-out z-40 shadow-md">
          <button
            className="float-right focus:outline-none mt-[18px] mr-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-gray-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="pt-16 pb-4 px-8">
            <Logo className="mb-10" />
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
