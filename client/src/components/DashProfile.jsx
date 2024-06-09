import { Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import toast from "react-hot-toast";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const filePicker = useRef();

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = () => {
    const storage = getStorage(app);
    if (!imageFile || !imageFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      setImageFileUrl(currentUser?.photoURL);
      return;
    }
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        toast.error("error uploading image or please select image size less than 2MB");        
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
        });
      }
    );
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-5">
        <input
          type="file"
          accept="image/*"
          onChange={handleChangeImage}
          ref={filePicker}
          className="hidden"
        />
        <div
          className="w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden relative"
          onClick={() => filePicker.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root:{
                  with:'100%',
                  height:'100%',
                  position:'absolute',
                  top:0,
                  left:0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                }
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`}
            alt="user"
          />
        </div>
        <TextInput
          type="text"
          placeholder="Username"
          id="username"
          defaultValue={currentUser?.username}
        />
        <TextInput
          type="email"
          placeholder="email"
          id="Email"
          defaultValue={currentUser?.email}
        />
        <TextInput type="password" placeholder="Password" id="password" />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
          Update
        </Button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete Account</span>
        <span className="text-red-500 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
