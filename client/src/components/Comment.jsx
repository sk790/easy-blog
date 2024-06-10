import React, { useEffect, useState } from "react";
import moment from "moment";
export default function Comment({ comment }) {
  const [commentUser, setCommentUser] = useState({});
  console.log(commentUser);
  useEffect(() => {
    try {
      const getUser = async () => {
        const res = await fetch(`/api/${comment.userId}`);
        const data = await res.json();
        if (data.success) {
          setCommentUser(data.user);
          console.log(data);
        }
      };
      getUser();
    } catch (error) {
      console.log(error);
    }
  }, [comment]);
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
      </div>
    </div>
  );
}
