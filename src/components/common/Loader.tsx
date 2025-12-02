import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-[#4b0082]"></div>
    </div>
  );
};

export default Loader;
