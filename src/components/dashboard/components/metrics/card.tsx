import React from "react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  count: string | number;
  iconBgColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, 
  title, 
  count, 
  iconBgColor = "bg-blue-500" 
}) => {
  // Extract color from iconBgColor for gradient effects
  const colorMap: { [key: string]: string } = {
    'bg-blue-500': 'from-blue-50 to-blue-100 border-blue-200',
    'bg-green-500': 'from-green-50 to-green-100 border-green-200',
    'bg-purple-500': 'from-purple-50 to-purple-100 border-purple-200',
    'bg-yellow-500': 'from-yellow-50 to-yellow-100 border-yellow-200',
    'bg-red-500': 'from-red-50 to-red-100 border-red-200',
    'bg-indigo-500': 'from-indigo-50 to-indigo-100 border-indigo-200',
  };

  const gradientClass = colorMap[iconBgColor] || 'from-blue-50 to-blue-100 border-blue-200';

  return (
    <div className="group relative">
    
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-500 overflow-hidden">
        
      
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientClass} rounded-full -translate-y-16 translate-x-16 opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
        
        
        <div className="relative z-10">
        
          <div className="flex items-center gap-6">
          
            <div className={`${iconBgColor} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            
           
            <div className="flex-1 space-y-2">
           
              <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                {typeof count === 'number' ? count.toLocaleString() : count}
              </div>
              
              
              <div className=" font-semibold text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                {title}
              </div>
              
           
              <div className={`h-1 w-16 ${iconBgColor} rounded-full opacity-60 group-hover:w-24 transition-all duration-300`}></div>
            </div>
            
           
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
          </div>
        </div>

        <div className={`absolute inset-0 ${iconBgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
      </div>
    </div>
  );
};

export default MetricCard;