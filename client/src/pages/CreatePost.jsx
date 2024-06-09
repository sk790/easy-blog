import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center m-7">Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">Java Script</option>
            <option value="react">React</option>
            <option value="nextjs">Next Js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" required accept="image/*" />
          <Button
            className=""
            gradientDuoTone={"purpleToBlue"}
            size={"sm"}
            outline
          >
            Upload
          </Button>
        </div>
        <ReactQuill
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write something..."
          required
        />
        <Button type="submit" gradientDuoTone={"purpleToBlue"} size={"lg"}>
          Publish
        </Button>
      </form>
    </div>
  );
}
