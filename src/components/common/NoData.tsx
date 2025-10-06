import { HiOutlineInbox } from 'react-icons/hi';
interface Props {
  message?: string;
}
const NoData = ({ message = 'No data available' }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 py-8">
      <HiOutlineInbox className="text-6xl mb-2 text-gray-400" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default NoData;
