import AvatarSection from './AvatarSection';
import PersonaSection from './PersonaSection';
import FirstMessageSection from './FirstMessageSection';
import ColorSection from './ColorSection';
import SizeSection from './SizeSection';
import AlignmentSection from './AlignmentSection';

const CustomizationPanel = () => {
    return (
        <div className="w-[400px] bg-white border-r border-gray-200 overflow-y-auto h-screen">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Customization</h2>
                    <button className="text-gray-400 hover:text-gray-600">
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
