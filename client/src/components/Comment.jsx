import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike }) {
  const [commentUser, setCommentUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [numberOfLikes, setNumberOfLikes] = useState(comment.numberOfLikes);

  const [like, setLike] = useState(
    currentUser ? comment.likes.includes(currentUser._id) : false
  );
  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await fetch(`/api/${comment.userId}`);
        const data = await res.json();
        if (data.success) {
          setCommentUser(data.user);
        }
      };
      getUser();
    } catch (error) {
      console.log(error);
    }
  }, [comment]);

  const handlelike = () => {
    if (like) {
      setLike(false);
      setNumberOfLikes((prev) => prev - 1);
    } else {
      setLike(true);
      setNumberOfLikes((prev) => prev + 1);
    }
  };
  
  return (
    <div className="flex p-4 border-b dark:border-gray-700 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={commentUser.profilePicture}
          alt={commentUser.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {commentUser ? `@${commentUser.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 mb-2">{comment.content}</p>
        <div className="flex items-center gap-2 pt-2 text-xs border-t max-w-fit">
          <button
            onClick={() => {
              onLike(comment._id), handlelike();
            }}
            type="button"
            className={`${like ? "text-blue-500" : "text-gray-400"}`}
          >
            <FaThumbsUp />
          </button>
          <div className="">
            {numberOfLikes > 0 &&
              numberOfLikes +
                " " +
                (numberOfLikes === 1 ? "like" : "likes")}
          </div>
        </div>
      </div>
    </div>
  );
}
