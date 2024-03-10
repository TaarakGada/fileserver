"use client";
import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import PocketBase from 'pocketbase';
import { Input } from '../ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
export function Upload() {
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [unique, setUnique] = useState<string[]>([]);
  const pb = new PocketBase('https://sujal.pockethost.io');

  const purgeOldFiles = async () => {
    const MAX_FILE_COUNT = 50;
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
  const generateUniqueName = () => {
    const word1: string[] = ['blue', 'rose', 'moon', 'star', 'lake', 'leaf', 'cloud', 'bird', 'tree', 'sun', 'rain', 'gold', 'fire', 'pink', 'mind', 'open', 'wind', 'warm', 'pure', 'soft', 'calm', 'song', 'hope', 'wise', 'free', 'true', 'kind', 'fair', 'cool', 'bold'];
    const word2: string[] = ['swift', 'crisp', 'clear', 'gleam', 'grace', 'charm', 'gleam', 'swift', 'whale', 'shiny', 'calm', 'wise', 'star', 'rose', 'bold', 'true', 'kind', 'free', 'warm', 'soft', 'open', 'blue', 'moon', 'leaf', 'lake', 'bird', 'fire', 'gold', 'pink', 'rain'];
    const word3: string[] = ['song', 'hope', 'mind', 'pure', 'fair', 'cool', 'wise', 'free', 'soft', 'calm', 'bold', 'true', 'kind', 'star', 'gold', 'fire', 'pink', 'moon', 'rose', 'lake', 'leaf', 'cloud', 'bird', 'tree', 'sun', 'rain', 'warm', 'open', 'wind'];
    return [
      word1[Math.floor(Math.random() * word1.length)],
      word2[Math.floor(Math.random() * word2.length)],
      word3[Math.floor(Math.random() * word3.length)]
    ];
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFileInput(event.target.files);
    }
  };

  const handleUpload = async () => {
    try {
      if (fileInput && fileInput.length > 0) {
        let newUnique = generateUniqueName()
        setUnique(newUnique);
        console.log(unique)
        const formData = new FormData();
        for (let file of Array.from(fileInput)) {
          formData.append('file', file);
        }
        formData.append("unique", newUnique.join(" "))

        // Upload and create a new record
        await pb.collection('files').create(formData);
        toast.success("Uploaded Successfully");
        return;
      }
    } catch (e: any) {
      console.log("Error Occured: " + e.message)
      toast.error("Sorry. We are unable to connect to server.")
    } finally {
      try {
        purgeOldFiles();
      }
      finally {
        // Ignore
      }
    }
  };

  return (
    <Card key="1" className=" w-auto h-5/6 max-w-3xl flex flex-col items-center justify-center my-auto">
      <CardContent className="p-4 m-auto">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold leading-none">File Server</h1>
            <p className="text-sm mt-4 leading-none text-gray-500 dark:text-gray-400">
              Temporary File Server
            </p>
          </div>
        </div>
      </CardContent>

      <CardContent className="px-4 py-0">
        <p className="text-sm text-center leading-none text-gray-500 dark:text-gray-400">
          {!!unique.length && (
            <div>
              Use these 3 magical words to access the uploaded documents
              <div className=' text-xl text-gray-700 dark:text-gray-200'>
                {unique.join(" ")}
              </div>
            </div>
          )}
        </p>
      </CardContent>

      <CardContent className="p-4 m-auto flex flex-col items-center">
        <Input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className="mb-4 file:text-white bg-background-black"
        />
        <Button onClick={handleUpload} variant={"default"} className="w-full">
          Upload
        </Button>

        <div className='w-full border m-4 border-gray-200' />

        <p className="text-sm mt-4 mb-4 space-y-2 leading-none  text-gray-500 dark:text-gray-400">
          Instructions for Use:
          <ul className="list-disc space-y-1 list-inside my-2">
            <li className='text-sm'>Click the "Choose File" button to select one or more files for upload.</li>
            <li className='text-sm'>Click the "Upload" button to upload the selected files to the temporary file server.</li>
            <li className='text-sm'>After uploading, you will be provided with 3 magical words to access your documents.</li>
            <li className='text-sm'>Use these words to retrieve your documents later.</li>
          </ul>
        </p>

        <Link href={"/get"} className="w-full">
          <Button variant={"outline"} className="w-full" >
            Get
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
