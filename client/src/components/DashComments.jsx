import { Button, Modal, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import Skeleton from "./Skeleton";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(comments);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const res = await fetch(`/api/comment/get-all-comments`);

      const data = await res.json();
      setComments(data.comments);
      setLoading(false);
      if (data.comments.length < 9) {
        setShowMore(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/comment/get-all-comments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (data.success) {
        setLoading(false);
        setComments((comment) => [...comment, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleDeleteComment = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/comment/admin-delete-comment/${commentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setLoading(false);
        toast.success(data.message);
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex items-center mx-auto">
        <Spinner aria-label="Extra large spinner example" size="xl" />
      </div>
    );
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>comment content</Table.HeadCell>
              <Table.HeadCell>likes</Table.HeadCell>
              <Table.HeadCell>comment id</Table.HeadCell>
              <Table.HeadCell>Userid</Table.HeadCell>
              <Table.HeadCell>delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment && comment.content}</Table.Cell>
                  <Table.Cell className="text-center">{comment && comment.likes.length}</Table.Cell>
                  <Table.Cell>{comment && comment._id}</Table.Cell>
                  <Table.Cell>{comment && comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentId(comment._id);
                      }}
                      className="cursor-pointer bg-red-600 text-white p-1 rounded-md font-medium hover:underline"
                    >
                      Delete
                    </span>
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
        <p className="text-center">No Comments</p>
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
              Are you sure you want to delete your this comment?
            </h3>
          </div>
          <div className="flex gap-4">
            <Button
              color="failure"
              onClick={handleDeleteComment}
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
