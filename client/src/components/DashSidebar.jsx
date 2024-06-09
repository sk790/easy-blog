import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowCircleRight, HiUser } from "react-icons/hi";
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
      const res = await fetch(`/api/signout`, {
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
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser && currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
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
