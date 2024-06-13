import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Likes({posts}) {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [like, setLike] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    const res = await fetch(
      `/api/post/like-post/${posts[0].Id}/${currentUser._id}`,
      {
        method: "PUT",
      }
    );
    const data = await res.json();
    if (data.success) {
      setLike(!like);
    }

    console.log(data);
  };

  return (
    <div>
      <button
        onClick={handleLike}
        type="button"
        className="flex items-center gap-2 text-2xl"
      >
        {<FaHeart className={`${like && "text-red-600"}`} />}
        <div className="flex gap-2">
          {like}
          <span>like</span>
        </div>
      </button>
      {/* <button
            // onClick={handleEdit}
            type="button"
            className="flex items-center gap-2"
          >
            {<FaComment className="hover:text-red-600" />}
            <div className="flex gap-2">
              {(posts && posts.likes) || 1 + "k"}
              <span>comments</span>
            </div>
          </button> */}
    </div>
  );
}
