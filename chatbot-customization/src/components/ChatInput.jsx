const ChatInput = () => {
    // Input layout is ALWAYS the same regardless of alignment
    return (
        <div className="border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="p-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Type here"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500 text-left"
                        disabled
                    />
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="px-4 pb-3 text-center">
                <p className="text-xs text-gray-500">
                    This chat is recorded. By chatting, you agree to the{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                        AI Terms
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

export default ChatInput;
