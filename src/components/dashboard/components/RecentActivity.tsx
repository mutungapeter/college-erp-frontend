import { UserType } from "@/definitions/students";
import { useGetRecentActionsQuery } from "@/store/services/curriculum/campusService";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit, FiPlus } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";
import { MdAccessTime } from "react-icons/md";

export interface RecentActionType {
  id: number;
  user: UserType;
  action_time: string;
  content_type: string;
  object_repr: string;
  action_flag: number;
  action_flag_display: string;
  change_message: string;
}

const RecentActivity = () => {
  const { data = [], isLoading } = useGetRecentActionsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log("data", data);
  
  const getIcon = (flag: number) => {
    if (flag === 1) return <FiPlus className="w-4 h-4 text-emerald-600" />;
    if (flag === 2) return <FiEdit className="w-4 h-4 text-blue-600" />;
    if (flag === 3) return <FaRegTrashAlt className="w-4 h-4 text-red-600" />;
    return <MdAccessTime className="w-4 h-4 text-gray-500" />;
  };

  const getActionColor = (flag: number) => {
    if (flag === 1) return "border-l-emerald-500 bg-emerald-50/30";
    if (flag === 2) return "border-l-blue-500 bg-blue-50/30";
    if (flag === 3) return "border-l-red-500 bg-red-50/30";
    return "border-l-gray-400 bg-gray-50/30";
  };

  const getActionBadge = (flag: number) => {
    const baseClasses = "px-2.5 py-0.5 rounded-md text-xs font-medium inline-flex items-center gap-1";
    if (flag === 1) return `${baseClasses} bg-emerald-100 text-emerald-700 border border-emerald-200`;
    if (flag === 2) return `${baseClasses} bg-blue-100 text-blue-700 border border-blue-200`;
    if (flag === 3) return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
    return `${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`;
  };

  const formatDateTime = (time: string) => {
    const date = new Date(time);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${timeString}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${timeString}`;
    } else {
      return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year:
            date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
        }) + `, ${timeString}`
      );
    }
  };

  const getRelativeTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Recent Activity
          </h3>
          <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full font-medium">
            {data.length} {data.length === 1 ? "action" : "actions"}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {data.slice(0, 10).map((item: RecentActionType) => (
          <div
            key={item.id}
            className={`relative p-5 hover:bg-gray-50/50 transition-all duration-200 border-l-4 ${getActionColor(item.action_flag)}`}
          >
            
            <div className="grid grid-cols-12 gap-4 items-start">
              
         
              <div className="col-span-3">
                <div className="flex items-center space-x-2">

                 {getIcon(item.action_flag)}
               <div className={getActionBadge(item.action_flag)}>
  <span className="truncate">{item.action_flag_display}</span>
</div>

                </div>
              </div>

              {/* Content Details - Col 4-6 */}
              <div className="col-span-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                    {item.object_repr}
                  </h4>
                  <p className="text-xs text-gray-600 font-medium">
                    {item.content_type}
                  </p>
                </div>
              </div>

              {/* User Information - Col 7-9 */}
              <div className="col-span-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <LuUserRound className="w-3 h-3 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {item.user.first_name} {item.user.last_name}
                    </p>
                    <span className="inline-block px-1.5 py-0.5 bg-indigo-100 text-indigo-600 rounded text-xs font-medium mt-1">
                      {item.user.role.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamp - Col 10-12 */}
              <div className="col-span-2 text-right">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-gray-900">
                    {getRelativeTime(item.action_time)}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight">
                    {formatDateTime(item.action_time)}
                  </p>
                </div>
              </div>
            </div>

         
          </div>
        ))}

        {data.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdAccessTime className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No Recent Activity
            </h4>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              When actions are performed on the system, they&apos;ll appear here for easy tracking.
            </p>
          </div>
        )}
      </div>

     
      {/* {data.length > 10 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-200">
            View All Activity ({data.length} total)
          </button>
        </div>
      )} */}
    </div>
  );
};

export default RecentActivity;