import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/post/getposts/?userId=${currentUser._id}`);

      const data = await res.json();
      setPosts(data.posts);
      if (data.posts.length < 9) {
        setShowMore(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(
        `/api/post/getposts/?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data.success) {
        setPosts((posts) => [...posts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postId}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setPosts(posts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
      {currentUser.isAdmin && posts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {posts.map((post) => (
              <Table.Body className="divide-y" key={post._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt=""
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostId(post._id);
                      }}
                      className="cursor-pointer text-red-700 font-medium hover:underline"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="cursor-pointer text-teal-400 hover:underline font-medium">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-gray-500 dark:text-white py-4 text-sm w-full hover:underline self-center "
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="text-center">No Posts</p>
      )}
      <Modal
        show={showModal}
        size="md"
        popup={true}
        onClose={() => setShowModal(false)}
      >
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mt-5 text-2xl font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your this post?
            </h3>
          </div>
          <div className="flex gap-4">
            <Button
              color="failure"
              onClick={handleDeletePost}
              className="w-full mt-5"
            >
              Yes, I'm sure
            </Button>
            <Button
              color="gray"
              className="w-full mt-5"
              onClick={() => setShowModal(false)}
            >
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}