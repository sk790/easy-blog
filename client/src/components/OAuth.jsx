import React from "react";
import { Button, Toast } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoUrl: result.user.photoURL
        }),
      })
      const data = await res.json();
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate("/");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error); 
    }
  };
  return (
    <Button className="bg-gradient-to-r from-green-500 via-indigo-600 to-blue-500" outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6 h-6 mx-2" />
      <span>Continue with Google</span>
    </Button>
  );
}
