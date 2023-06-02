import React from 'react';

const LoadingButton = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingButton;
