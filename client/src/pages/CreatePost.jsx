import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import hljs from "highlight.js";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreatePost() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (formData.image) {
      toast.success("Image uploaded successfully");
    }
  }, [formData.image]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        return toast.error("Please select an image");
      }
      if (formData.image) {
        return toast.error("Image already uploaded");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        navigate(`/post/${data.post.slug}`);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error);
    }
  };
  // const formats = [
  //   'font','size',
  //   'bold','italic','underline','strike',
  //   'color','background',
  //   'script',
  //   'header','blockquote','code-block',
  //   'indent','list',
  //   'direction','align',
  //   'link','image','video','formula',
  // ]
  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  const module = {
    toolbar: toolbarOptions,
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center m-7">Create Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
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
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Java Script</option>
            <option value="React.js">React</option>
            <option value="Next.js">Next Js</option>
            <option value="other">other</option>
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
          modules={module}
          className="h-72 mb-12"
          placeholder="Write something..."
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
          // formats={formats}
        />
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-500 via-indigo-600 to-blue-500 mt-5"
          size={"lg"}
        >
          Publish
        </Button>
      </form>
    </div>
  );
}
