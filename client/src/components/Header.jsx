import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import toast from "react-hot-toast";
import { signoutSuccess } from "../redux/user/userSlice";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname;

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
    <Navbar className="border-b-2 self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
      <Link to="/">
        <span className="px-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg">
          Saurabh's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          placeholder="Search..."
          type="search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          pill
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avatar
                alt="User settings"
                img={currentUser?.profilePicture}
                rounded={true}
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm truncate">
                @{currentUser?.username}
              </span>
              <span className="block text-medium truncate">
                {currentUser?.email}
              </span>
            </Dropdown.Header>
            <Link to={"dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Divider />
            </Link>
            <Dropdown.Item onClick={handleSignOut}>SignOut</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
