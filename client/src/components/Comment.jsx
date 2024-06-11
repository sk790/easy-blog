import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import toast from "react-hot-toast";

export default function Comment({ comment, onLike, onEdit }) {
  const [commentUser, setCommentUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
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
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  const handleSaveComment = async () => {
    setIsEditing(false);
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (data.success) {
        onEdit(comment, editedContent);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
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
        {isEditing ? (
          <div>
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="resize-none p-2 focus:bg-gray-200 mb-2"
            ></Textarea>
            <div className="flex justify-end gap-5 items-center my-3">
              <Button
                gradientDuoTone={"purpleToPink"}
                onClick={() => setIsEditing(false)}
                outline
              >
                Cancel
              </Button>
              <Button
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={handleSaveComment}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
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
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <button
                    onClick={handleEdit}
                    type="button"
                    className="hover:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
