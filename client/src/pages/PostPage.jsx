import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
export default function PostPage() {
  const [posts, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { postSlug } = useParams();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (data.success) {
          toast.success("successfully fetch");
          setPost(data.posts[0]);
          setLoading(false);
        } else {
          toast.error(data.error);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
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
        className="mt-5 object-cover w-full p-5 max-h-[600px]"
      />
      <div className="flex justify-between p-3 border-b-2 border-x-slate-300 text-sm lg:text-xl">
        <span>{new Date(posts && posts.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {posts && (posts.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: posts && posts.content }}
      ></div>
      <div className="mx-auto max-w-4xl">
        <CallToAction />
      </div>
      <CommentSection postId = {posts && posts._id}/>
    </main>
  );
}
