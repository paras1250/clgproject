import { useState } from 'react';
import { useChatbot } from '../context/ChatbotContext';

const AvatarCard = ({ src, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        w-16 h-16 rounded-full cursor-pointer avatar-hover
        ${isSelected ? 'avatar-selected' : 'ring-2 ring-gray-200'}
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
        <div className="border-b border-gray-200">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-semibold text-gray-800">Avatar</span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
                        <label className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCustomAvatarUpload}
                                className="hidden"
                            />
                            <span className="text-white text-2xl font-light">+</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarSection;
