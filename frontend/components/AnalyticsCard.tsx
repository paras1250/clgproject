interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const AnalyticsCard = ({ title, value, icon, trend }: AnalyticsCardProps) => {
  return (
    <div className="premium-card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F5D4]/10 to-[#3A86FF]/5 flex items-center justify-center text-[#00F5D4] border border-[#00F5D4]/20 group-hover:scale-110 transition-transform shadow-lg shadow-[#00F5D4]/5">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
            <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-[10px] font-bold text-[#10B981]">{trend}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.1em]">
          {title}
        </p>
        <p className="text-3xl font-black text-[#F1F5F9] tracking-tight">
          {value}
        </p>
      </div>
      
      <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#00F5D4] to-[#3A86FF] w-[65%] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export default AnalyticsCard;

