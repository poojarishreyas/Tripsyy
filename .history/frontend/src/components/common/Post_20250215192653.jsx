import { FaRegComment } from "react-icons/fa";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import axios from 'axios';



import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";


const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			// this is not the best UX, bc it will refetch all posts
			// queryClient.invalidateQueries({ queryKey: ["posts"] });

			// instead, update the cache directly for that post
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};

	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		likePost();
	};
	const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);

	
	const [showInvideo, setShowInvideo] = useState(false);
  
	async function generateAnswer() {
	  setIsGeneratingAnswer(true); // Start the loading state
	  try {
		console.log("loading...");
  
		const response = await axios({
		  url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.",
		  method: "post",
		  data: {
			contents: [
			  { 
				parts: [
				  {
					text:` Generate a visually captivating and engaging video script about ${post.text} for potential tourists, aiming for a 2-5 minute video with a warm and enthusiastic voiceover. The script should be structured with distinct sections, each suggesting specific visuals categorized as [ARCHIVAL], [ANIMATION], [MODERN], [ILLUSTRATION], or [TEXT/GRAPHIC] and appropriate audio. Focus on a compelling narrative that highlights: Historical Significance (covering notable events, kingdoms, rulers, etc., using [ARCHIVAL/ANIMATION] visuals and dramatic music); Unique Features (showcasing architectural marvels, natural wonders, etc., with [MODERN/ILLUSTRATION] visuals and local sounds); Legends and Stories (retelling local myths with [ILLUSTRATION/ANIMATION] visuals and enchanting music); Cultural Heritage (emphasizing art, cuisine, festivals with [MODERN] visuals and traditional music); Present-Day Attractions (showcasing tourist activities with [MODERN] visuals and upbeat music); Traveler Tips (offering practical information with [TEXT/GRAPHIC/MODERN] visuals and informative music); and an Emotional Connection (appealing to emotions with [MODERN] visuals and evocative music). Use persuasive language and keywords like "breathtaking beauty," "unforgettable experiences," and "hidden gem" throughout. Conclude with a strong call to action, inspiring viewers to visit and including website/social media promotion, using a montage of best visuals and uplifting music. Maintain a cinematic, vibrant, historical, or modern visual style, with appropriate background music and sound effects. Adapt the script to ${post.text}, ensuring it flows logically and is approximately 32,000 characters long`}
				],
			  },
			],
		  },
		});
  
		const textContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
		if (!textContent) {
		  throw new Error("Invalid response structure or no content generated.");
		}
  
		// Attempt to copy the text content to the clipboard
		if (navigator.clipboard && navigator.clipboard.writeText) {
		  await navigator.clipboard.writeText(textContent);
		  console.log("Text content copied to clipboard!");
		   
		  setShowInvideo(true); // Show the iframe
		} else {
		  throw new Error("Clipboard API not supported in this browser.");
		}
	  } catch (error) {
		console.error("Error generating answer:", error);
		toast.error("Something went wrong. Please try again."); // Notify the user of failure
	  } finally {
		setIsGeneratingAnswer(false); // End the loading state
	  }
	}
	


	  
	  
	  

	return (
	   <>
			<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='flex flex-col flex-1'>
					<div className='flex gap-2 items-center'>
						<Link to={`/profile/${postOwner.username}`} className='font-bold'>
							{postOwner.fullName}
						</Link>
						<span className='text-gray-700 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
								)}

								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden'>
						<span>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border border-gray-700'
								alt=''
							/>
						)}
					</div>
					<div className='flex justify-between mt-3'>
						<div className='flex gap-4 items-center w-2/3 justify-between'>
							<div
								className='flex gap-1 items-center cursor-pointer group'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='w-4 h-4  text-slate-500 group-hover:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded border border-gray-600'>
									<h3 className='font-bold text-lg mb-4'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet 🤔 Be the first one 😉
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
														<span className='text-gray-700 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none  border-gray-800'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
											{isCommenting ? <LoadingSpinner size='md' /> : "Post"}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
							{showInvideo ? (
  <div className="iframe-container fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    {/* InVideo iframe, Cancel, and Refresh buttons */}
    <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
	<iframe
  id="invideoIframe" // Assign an ID to the iframe for easy reference
  src="https://ai.invideo.io/login"
  title="InVideo Editor"
  className="w-full h-full border-none"
  style={{
    maxWidth: '1200px',
    maxHeight: '80vh',
    position: 'relative', // Makes sure it can be adjusted relative to its normal position
    top: '-55px', // Moves it 20px upwards
  }}
></iframe>

      
      {/* Cancel Button */}
      <button
        onClick={() => setShowInvideo(false)} // Close the iframe
        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
      >
        X
      </button>

      {/* Refresh Iframe Button */}
      
    </div>
  </div>
) : (
  <div className="flex gap-2 items-start p-4 border-b border-gray-700">
    {/* Existing Post Content */}
    <div className="flex flex-col flex-1">
      <div className="flex justify-between mt-3">
        <div className="group">
          {isGeneratingAnswer ? (
            <LoadingSpinner size="md" />
          ) : (
            <HiOutlineRocketLaunch
              className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-green-500"
              onClick={() => {
                setIsGeneratingAnswer(true); // Start loading spinner
                generateAnswer().then(() => {
                  setIsGeneratingAnswer(false); // Stop loading spinner after answer is generated
                  setShowInvideo(true); // Show InVideo iframe after answer generation is complete
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  </div>
)}




							
						
				

							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
								)}

								<span
									className={`text-sm  group-hover:text-pink-500 ${
										isLiked ? "text-pink-500" : "text-slate-500"
									}`}
								>
									{post.likes.length}
								</span>
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
						</div>
					</div>
				</div>
			</div>
								
		</>
	);
};
export default Post;