"use client";
import { Upload } from "@/components/component/Upload";

export default function Home() {

  return (
    <main className="flex h-screen flex-col items-center justify-evenly">
      <Upload />
      <p className=" text-center text-gray-500 text-sm m-2">The files will be deleted after 1 to 2 hrs of uploading. <br/> There can be only 50 file ports active at a moment. <br/> Made by Sujal Choudhari</p>
    </main>
  );
}
