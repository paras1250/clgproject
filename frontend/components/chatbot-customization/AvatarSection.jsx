import { useState } from 'react';
import { useChatbot } from './ChatbotContext';

const AvatarCard = ({ src, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        w-16 h-16 rounded-full cursor-pointer avatar-hover transition-all
        ${isSelected ? 'ring-2 ring-[#00F5D4] ring-offset-2 ring-offset-[#0F1629]' : 'ring-1 ring-white/[0.1] hover:ring-[#00F5D4]/50'}
      `}
        >
            <img
                src={src}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
            />
        </div>
    );
};

const AvatarSection = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const { selectedAvatar, setSelectedAvatar } = useChatbot();
    const [customAvatars, setCustomAvatars] = useState([]);

    const defaultAvatars = [
        '/avatars/avatar1.png',
        '/avatars/avatar2.png',
        '/avatars/avatar3.png',
        '/avatars/avatar4.png',
        '/avatars/avatar5.png',
        '/avatars/avatar6.png',
        '/avatars/avatar7.png',
        '/avatars/avatar8.png',
    ];

    const allAvatars = [...defaultAvatars, ...customAvatars];

    const handleCustomAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newAvatar = event.target.result;
                setCustomAvatars([...customAvatars, newAvatar]);
                setSelectedAvatar(newAvatar);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="border-b border-white/[0.06]">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#121826] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#00F5D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold text-[#F1F5F9] font-inter">Avatar</span>
                </div>
                <svg
                    className={`w-5 h-5 text-[#64748B] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isExpanded && (
                <div className="px-6 pb-6">
                    <div className="grid grid-cols-4 gap-4">
                        {allAvatars.map((avatar, index) => (
                            <AvatarCard
                                key={index}
                                src={avatar}
                                isSelected={selectedAvatar === avatar}
                                onClick={() => setSelectedAvatar(avatar)}
                            />
                        ))}

                        {/* Add Custom Avatar Button */}
                        <label className="w-16 h-16 rounded-full bg-[#121826] border border-white/[0.1] flex items-center justify-center cursor-pointer hover:border-[#00F5D4] transition-colors group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCustomAvatarUpload}
                                className="hidden"
                            />
                            <span className="text-[#64748B] group-hover:text-[#00F5D4] text-2xl font-light transition-colors">+</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarSection;
