const ChatBubble = ({ message }) => {
    // Message bubble layout is ALWAYS the same regardless of alignment
    return (
        <div className="flex items-start gap-2 mb-4 justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[280px] text-left">
                <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default ChatBubble;
