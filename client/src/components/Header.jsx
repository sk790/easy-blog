import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import toast from "react-hot-toast";
import { signoutSuccess } from "../redux/user/userSlice";
import { HiArrowCircleRight } from "react-icons/hi";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [searchTearm, setSearchTearm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const searchTearmFromUrl = urlPrams.get("searchTearm");
    if (searchTearmFromUrl) {
      setSearchTearm(searchTearmFromUrl);
    }
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
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTearm=${searchTearm}`);
  };

  return (
    <Navbar className="border-b-2 items-center self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
      <Link to="/" className="self-center flex items-center">
        <span className="px-4 mr-2 text-2xl bg-gradient-to-r from-green-700 to-fuchsia-500 rounded-lg">
          Easy
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          placeholder="Search..."
          type="search"
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          onChange={(e) => setSearchTearm(e.target.value)}
          value={searchTearm}
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
            {currentUser?.isAdmin && (
              <Link to={"/dashboard?tab=dashboard"}>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Divider />
              </Link>
            )}
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
