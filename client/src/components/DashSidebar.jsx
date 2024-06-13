import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { LiaCommentSolid } from "react-icons/lia";
import { RiArticleLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import {
  HiArrowCircleRight,
  HiDocument,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("tab")) setTab(urlParams.get("tab"));
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!data.success) {
        return toast.error(data.error);
      } else {
        dispatch(signoutSuccess(data.user));
        toast.success(data.message);
        navigate("/sign-in");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dashboard"}>
              <Sidebar.Item
                active={tab === "dashboard"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={FaRegUser}
              label={currentUser && currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {/* {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=create-post"}>
              <Sidebar.Item active={tab === "create-post"} icon={HiDocument} as="div">
                Create Post
              </Sidebar.Item>
            </Link>
          )} */}
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item active={tab === "posts"} icon={RiArticleLine} as="div">
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=comments"}>
              <Sidebar.Item
                active={tab === "comments"}
                icon={LiaCommentSolid}
                as="div"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            onClick={handleSignOut}
            icon={HiArrowCircleRight}
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
