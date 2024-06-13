import { Button, Modal, Spinner, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`/api/user/getusers`);

      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
      if (data.users.length < 9) {
        setShowMore(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/getusers/?startIndex=${startIndex}`);
      const data = await res.json();
      if (data.success) {
        setUsers((users) => [...users, ...data.users]);
        setLoading(false);
        if (data.users.length < 9) {
          setShowMore(false);
        }
        setShowMore(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setLoading(false);
        toast.success(data.message);
        setUsers(users.filter((user) => user._id !== userId));
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen m-auto">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-500 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-400">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y" key={user._id}>
                <Table.Row>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover bg-gray-500"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`${
                        user.isAdmin
                          ? "text-white bg-gray-700  p-1 rounded-md dark:bg-black dark:text-green-700"
                          : "text-gray-300"
                      } font-medium`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user._id);
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
        <p className="text-center">No User Found</p>
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
              Are you sure you want to delete this user?
            </h3>
          </div>
          <div className="flex gap-4">
            <Button
              color="failure"
              onClick={handleDeleteUser}
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
