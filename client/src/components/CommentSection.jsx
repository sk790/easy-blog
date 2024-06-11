import { Button, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Comment from "./Comment";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(comments);

  useEffect(() => {
    try {
      const fetchComments = async () => {
        const res = await fetch(`/api/comment/get-post-comments/${postId}`);
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        }
      };
      fetchComments();
    } catch (error) {
      console.log(error);
    }
  }, [postId, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return toast.error("Comment must be less than 200 characters");
    }
    try {
      setLoading(true);
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: currentUser._id,
          content: comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setComment("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/comment/like-comment/${commentId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : comment
      )
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img src={currentUser.profilePic} alt="" />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-cyan-500 hover:underline text-xs"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You need to signin to comment
          <Link to={"/sign-in"}>Sign In</Link>
        </div>
      )}

      {/* comment form */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-cyan-500 rounded-lg p-4"
        >
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={"3"}
            maxLength={"200"}
          />
          <div className="flex justify-between items-center my-3">
            <p className="text-xs text-gray-500">
              {200 - comment.length} characters left
            </p>
            <Button type="submit" gradientDuoTone={"cyanToBlue"} outline>
              Submit
            </Button>
          </div>
        </form>
      )}

      {/* comments list */}
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <>
          <div className="flex gap-1 my-5 items-center text-sm">
            <p>Comments</p>
            <div className="text-gray-500 border-2 py-1 px-2 rounded-sm">
              {comments.length}
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit = {handleEdit} />
          ))}
        </>
      )}
    </div>
  );
}
