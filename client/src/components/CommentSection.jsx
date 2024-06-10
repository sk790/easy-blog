import { Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const handleSubmit = async()=>{
    
  }


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
        <form onSubmit={handleSubmit} className="border border-cyan-500 rounded-lg p-4">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            rows={"3"}
            maxLength={"200"}
          />
          <div className="flex justify-between items-center my-3">
            <p className="text-xs text-gray-500">{200-comment.length} characters left</p>
            <Button type="submit" gradientDuoTone={"cyanToBlue"} outline>
              Submit
            </Button>
          </div>
        </form>
      )}

      {/* comments list */}
    </div>
  );
}
