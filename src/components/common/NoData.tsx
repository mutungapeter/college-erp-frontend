// components/NoData.tsx
import { HiOutlineInbox } from "react-icons/hi";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
      <HiOutlineInbox className="text-6xl mb-2 text-gray-400" />
      <p className="text-lg font-medium">No data available</p>
    </div>
  );
};

export default NoData;
