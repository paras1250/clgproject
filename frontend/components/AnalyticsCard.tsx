interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const AnalyticsCard = ({ title, value, icon, trend }: AnalyticsCardProps) => {
  return (
    <div className="bg-[#1E293B] rounded-xl border-2 border-white/10 p-6 hover:border-purple-300 hover:shadow-lg transition-all shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-[#94A3B8] mb-3 uppercase tracking-wider" style={{ color: '#4b5563' }}>
            {title}
          </p>
          <p className="text-4xl font-extrabold text-[#F8FAFC] mb-2" style={{ color: '#111827' }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <svg className="w-5 h-5 text-[#10B981] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold text-green-700">{trend}</p>
            </div>
          )}
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-4 ml-4 flex items-center justify-center" style={{ backgroundColor: '#f3e8ff' }}>
          <div className="w-7 h-7 text-purple-700" style={{ color: '#7e22ce' }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;

