import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-5">
        <div className="w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden">
          <img
            src={currentUser?.profilePicture}
            className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
            alt="user"
          />
        </div>
        <TextInput type="text" placeholder="Username" id="username" defaultValue={currentUser?.username}/>
        <TextInput type="email" placeholder="email" id="Email" defaultValue={currentUser?.email}/>
        <TextInput type="password" placeholder="Password" id="password"/>
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>Update</Button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete Account</span>
        <span className="text-red-500 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
