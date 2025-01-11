const ChatBotskeleton = () => {
    return (
      <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
        {/* Display Chatbot Response Skeleton */}
        <div className="skeleton h-2 w-32 rounded-full mb-2"></div>
        <div className="skeleton h-4 w-full rounded-md"></div>
      </div>
    );
  };
  
  export default ChatBotskeleton;
  
  