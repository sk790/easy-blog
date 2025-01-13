import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";
import { FaHeart, FaComment } from "react-icons/fa";
import { set } from "mongoose";
import Likes from "../components/Likes";
export default function PostPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { postSlug } = useParams();
  const [recentPosts, setRecentPosts] = useState([]);
  const [like, setLike] = useState(false);
  let [countLikes, setCountLikes] = useState(0);
  console.log(recentPosts);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (data.success) {
          setPost(data.posts[0]);
          setCountLikes(data.posts[0].likes.length);
          if (data.posts[0].likes.includes(currentUser._id)) {
            setLike(true);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/post/getposts?limit=3");
        const data = await res.json();
        if (data.success) {
          setRecentPosts(data.posts);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchRecentPosts();
  }, [postSlug]);

  const handleLike = async (postId) => {
    if (!currentUser) {
      navigate("/sign-in");
      return;
    }
    const res = await fetch(
      `/api/post/like-post/${postId}/${currentUser._id}`,
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-2xl mt-10 p-3 font-normal max-w-4xl mx-auto text-center lg:text-3xl">
        {posts && posts.title}
      </h1>
      <Link
        to={`/search?category=${posts && posts.category}`}
        className="self-center mt-5"
      >
        <Button className="" color={"gray"} pill size={"xs"}>
          {posts && posts.category}
        </Button>
      </Link>
      <img
        src={posts && posts.image}
        alt={posts && posts.title}
        className="mt-5 object-cover py-10 border max-w-full  max-h-[600px]"
      />
      <div className="flex justify-between p-3 border-b-2 border-x-slate-300 text-sm lg:text-xl">
        <span>
          Created at: {new Date(posts && posts.createdAt).toLocaleDateString()}
        </span>
        {/* Like component */}
        <div className="italic flex gap-5">
          {/* <Likes posts = {posts}/> */}
        </div>
      </div>
      <div
        className="p-3 max-w-1xl mx-auto w-full md:w-2/3 post-content"
        dangerouslySetInnerHTML={{ __html: posts && posts.content }}
      ></div>
      {/* <div className="mx-auto max-w-4xl"></div> */}
      <CommentSection postId={posts && posts._id} />
      {/* <CallToAction /> */}
      <div className="flex gap-5 flex-col justify-center items-center mb-5">
        <h1 className="text-4xl font-bold">Recent Posts</h1>
        <div className="flex flex-wrap gap-3">
          {recentPosts &&
            recentPosts.map((post) => <PostCard post={post} key={post._id} />)}
        </div>
      </div>
    </main>
  );
}
