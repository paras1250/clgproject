import AvatarSection from './AvatarSection';
import PersonaSection from './PersonaSection';
import FirstMessageSection from './FirstMessageSection';
import ColorSection from './ColorSection';
import SizeSection from './SizeSection';
import AlignmentSection from './AlignmentSection';

const CustomizationPanel = () => {
    return (
        <div className="w-[400px] bg-[#0F1629] border-r border-white/[0.06] overflow-y-auto h-screen custom-scrollbar">
            <div className="px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-sora font-bold text-[#F1F5F9]">Customization</h2>
                    <button className="text-[#64748B] hover:text-[#00F5D4] transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <AvatarSection />
            <PersonaSection />
            <FirstMessageSection />
            <ColorSection />
            <SizeSection />
            <AlignmentSection />
        </div>
    );
};

export default CustomizationPanel;
