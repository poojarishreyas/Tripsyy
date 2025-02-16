import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";
import axios from "axios";
import ChatBotSkeleton from "../../components/skeletons/chatbotskeleton";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [showChatBot, setShowChatBot] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for user input
  const [chatResponse, setChatResponse] = useState(""); // State for Gemini response
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Function to call Gemini API
  const generateAnswer = async () => {
    console.log("loading");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC6FEAPiMOElRYQPV30NBxUSsIbCrnw2Ik",
        method: "POST",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `As a professional tourist guide assistant, respond to our client's question in a friendly, informative, and engaging manner. The client's question is: "${searchQuery}". Provide a detailed and helpful response, ensuring to include relevant information, tips, and highlights to enhance their understanding and interest in short and crisp and ${searchQuery}language and response language should be same`,
                },
              ],
            },
          ],
        },
      });

      // Log the full response to check its structure
      console.log("Full response data:", response.data);

      // Process the response if needed
      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates.length > 0 &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts.length > 0
      ) {
        // Accessing the text from the parts array
        const responseText = response.data.candidates[0].content.parts[0].text;
        console.log("Response text:", responseText);

        // You can set the response text to state or handle it as needed
        setChatResponse(responseText); // Assuming you have a state to store the response
      } else {
        console.error("Response data structure is not as expected");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen relative">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          {["forYou", "following"].map((type) => (
            <div
              key={type}
              className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
                feedType === type ? "text-primary font-bold" : ""
              }`}
              onClick={() => setFeedType(type)}
            >
              {type === "forYou" ? "For You" : "Following"}
              {feedType === type && (
                <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
              )}
            </div>
          ))}
        </div>

        {/* Create Post Input */}
        <CreatePost />

        {/* Posts */}
        <Posts feedType={feedType} />

       {/* Chatbot Button */}
<div
  className="hidden lg:block fixed bottom-10 right-40 bg-[#16181C] p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:border-2 hover:border-glow hover:opacity-90 cursor-pointer z-50"
  onClick={() => setShowChatBot(!showChatBot)}
>
  <div className="flex items-center gap-6">
    <div className="avatar">
      <div className="w-22 h-24 rounded-full overflow-hidden">
        <img
          src="../images/bot.jpg"
          alt="Chatbot"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-white font-bold text-lg">Need Help?</span>
      <span className="text-base text-slate-500">Chat with guide</span>
    </div>
  </div>
</div>


        {/* Chatbot Dashboard */}
        {showChatBot && (
          <div className="fixed top-0 right-0 h-full w-1/4 bg-gray-800 text-white shadow-lg z-50">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">AI Chatbot Dashboard</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setShowChatBot(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col justify-between h-[calc(100%-64px)] overflow-y-auto">
              <div>
                <p>Welcome to the Trypsyy. How can we assist you today?</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full bg-gray-700 rounded-full mt-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type your query here..."
                  className="w-full h-12 bg-transparent py-2 px-6 text-white placeholder-gray-400 border-2 border-gray-600 rounded-full focus:ring-teal-200 focus:border-teal-200 outline-none"
                />

                <button
                  className="absolute right-3 top-2.5 bg-teal-600 text-white rounded-full h-9 px-4 flex items-center text-sm hover:bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  onClick={generateAnswer}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Search"}
                </button>
              </div>

              {/* Display Chatbot Response */}
              <div className="mt-4 p-4 bg-gray-700 rounded-lg text-white">
                <h3 className="font-bold text-lg">Response:</h3>
                {/* Show skeleton while loading */}
                {loading ? (
                  <div>
                    <div className="skeleton h-2 w-32 rounded-full mb-2"></div>
                    <div className="skeleton h-4 w-full rounded-md"></div>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-300">{chatResponse}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
