"use client";
import { Upload } from "@/components/component/Upload";

export default function Home() {

  return (
    <main className="flex h-[100lvh] flex-col items-center justify-between">
      <Upload />
      <p className=" text-center text-gray-500 text-sm fixed bottom-0">The files will be deleted after 1 to 2 hrs of uploading. <br/> There can be only 50 file ports active at a moment. </p>
    </main>
  );
}
