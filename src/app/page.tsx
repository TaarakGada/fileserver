"use client";
import { Upload } from "@/components/component/Upload";
import PocketBase from 'pocketbase';
import { useEffect } from "react";
const MAX_FILE_COUNT = 50;

export default function Home() {
  useEffect(() => {
    const pb = new PocketBase('https://sujal.pockethost.io');

    const clampTo50 = async () => {
      // you can also fetch all records at once via getFullList
      const records = await pb.collection('files').getFullList({
        sort: 'created',
      });

      if (records.length > MAX_FILE_COUNT) {
        let toRem = records.length - MAX_FILE_COUNT;
        for (let i = 0; i < toRem; i++) {
          await pb.collection('files').delete(records[i].id);
        }
      }

    }
    clampTo50();

  }, [])
  return (
    <main className="flex h-[100lvh] flex-col items-center justify-between">
      <Upload />
      <p className=" text-center text-gray-500 text-sm fixed bottom-0">The files will be deleted after 1 to 2 hrs of uploading. <br/> There can be only 50 file ports active at a moment. </p>
    </main>
  );
}
