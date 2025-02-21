/* eslint-disable tailwindcss/no-unnecessary-arbitrary-value */
/* eslint-disable jsx-a11y/heading-has-content */
import React from 'react';

const Skeleton = () => {
  return (
    <div className="mx-auto mt-2 overflow-x-auto bg-white p-3">
      <div className="mb-2 flex flex-col items-center">
        <h1 className="h-5 w-full animate-pulse text-2xl font-light md:w-2/5 dark:bg-gray-700"></h1>
        <h1 className="mt-5 h-10 w-28 animate-pulse text-2xl font-light dark:bg-gray-700"></h1>

        <h1 className="mt-5 h-12 w-64 animate-pulse text-2xl font-light dark:bg-gray-700"></h1>
        <div className="mx-auto w-full sm:w-4/5 md:w-[50%] lg:w-[30%]"></div>
      </div>

      <div className="mt-10 h-72 w-full">
        {[1, 2, 3, 4].map(item => (
          <div key={item} className="mt-2 flex items-center justify-between">
            <div className="mb-3 hidden h-8 w-24 animate-pulse bg-gray-300 md:table-cell dark:bg-gray-700"></div>
            <div className="mb-3 hidden h-8 w-24 animate-pulse bg-gray-300 md:table-cell dark:bg-gray-700"></div>
            <div className="mb-3 hidden h-8 w-24 animate-pulse bg-gray-300 md:table-cell dark:bg-gray-700"></div>
            <div className="mb-3 hidden h-8 w-24 animate-pulse bg-gray-300 md:table-cell dark:bg-gray-700"></div>
            <div className="mb-3 h-8 w-24 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
            <div className="mb-3 h-8 w-24 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
            <div className="mb-3 h-8 w-24 animate-pulse bg-gray-300 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
