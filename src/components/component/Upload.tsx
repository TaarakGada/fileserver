"use client";
import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent, Card } from "@/components/ui/card";
import PocketBase from 'pocketbase';
import { Input } from '../ui/input';
import Link from 'next/link';

export function Upload() {
  const [fileInput, setFileInput] = useState<FileList | null>(null);
  const [unique, setUnique] = useState<string[]>([]);

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
        const pb = new PocketBase('https://sujal.pockethost.io');
        let newUnique = generateUniqueName()
        setUnique(newUnique);
        console.log(unique)
        const formData = new FormData();
        for (let file of Array.from(fileInput)) {
          formData.append('file', file);
        }
        formData.append("unique", newUnique.join(" "))

        // Upload and create a new record
        const createdRecord = await pb.collection('files').create(formData);

        // Handle the response as needed
        console.log('Record created:', createdRecord);
        return;
      }
    } catch (e: any) {
      console.log("Error Occured: " + e.message)
    }
  };

  return (
    <Card key="1" className="w-full h-full max-w-3xl flex flex-col items-center justify-between my-[30lvh]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-5xl font-bold leading-none">File Server</h1>
            <p className="text-sm mt-4 leading-none text-gray-500 dark:text-gray-400">
              Temporary File Server
            </p>
          </div>
        </div>
      </CardContent>

      <CardContent className="p-6">
        <p className="text-sm mt-4 text-center leading-none text-gray-500 dark:text-gray-400">
          {!!unique.length && <div>Use these 3 magical words to access the uploaded documents<div className=' text-xl text-gray-700 dark:text-gray-200'> {unique.join(" ")} </div></div>}
        </p>
      </CardContent>

      <CardContent className="p-4 flex flex-col items-center">
        <Input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button onClick={handleUpload} variant={"default"} className="w-full">
          Upload
        </Button>

        <div className='w-full border m-4 border-gray-200' />
        <Link href={"/get"} className="w-full">
          <Button variant={"outline"} className="w-full" >
            Get
          </Button></Link>
      </CardContent>
    </Card>
  );
}
