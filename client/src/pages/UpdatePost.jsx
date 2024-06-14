import { Button, FileInput, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function UpdatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ content: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (data.success) {
          setFormData(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        return toast.error("Please select an image");
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          toast.error("Error uploading image");
          console.log(error);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      toast.error("Error uploading image");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      const res = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success) {
        setUpdateLoading(false);
        toast.success(data.message);
        navigate(`/post/${formData.slug}`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      setUpdateLoading(false);
      toast.error("Internal Server Error");
      console.log(error);
    }
  };

  const handleQuillChange = (value) => {
    setFormData((prevState) => ({ ...prevState, content: value }));
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center m-7">Update Post</h1>
      <form onSubmit={handleUpdatePost} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            value={formData.title}
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Java Script</option>
            <option value="react">React</option>
            <option value="nextjs">Next Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            className=""
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? `${imageUploadProgress}%` : "Upload Image"}
          </Button>
        </div>
        {formData.image && (
          <img
            src={formData.image}
            alt="uploaded image"
            className="w-full h-full object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write something..."
          required
          value={formData.content}
          onChange={handleQuillChange}
        />
        <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Updating....</span>
                </>
              ) : (
                "Update Post"
              )}
            </Button>
      </form>
    </div>
  );
}
