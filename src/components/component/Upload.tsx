'use client';
import React, { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import PocketBase from 'pocketbase';
import { Input } from '../ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Download, FileIcon } from 'lucide-react';

export function Upload() {
    const [showInstructions, setShowInstructions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unique, setUnique] = useState<string[]>([]);
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    };
    const generateUniqueName = () => {
        const word1: string[] = [
            'blue',
            'rose',
            'moon',
            'star',
            'lake',
            'leaf',
            'cloud',
            'bird',
            'tree',
            'sun',
            'rain',
            'gold',
            'fire',
            'pink',
            'mind',
            'open',
            'wind',
            'warm',
            'pure',
            'soft',
            'calm',
            'song',
            'hope',
            'wise',
            'free',
            'true',
            'kind',
            'fair',
            'cool',
            'bold',
        ];
        const word2: string[] = [
            'swift',
            'crisp',
            'clear',
            'gleam',
            'grace',
            'charm',
            'gleam',
            'swift',
            'whale',
            'shiny',
            'calm',
            'wise',
            'star',
            'rose',
            'bold',
            'true',
            'kind',
            'free',
            'warm',
            'soft',
            'open',
            'blue',
            'moon',
            'leaf',
            'lake',
            'bird',
            'fire',
            'gold',
            'pink',
            'rain',
        ];
        const word3: string[] = [
            'song',
            'hope',
            'mind',
            'pure',
            'fair',
            'cool',
            'wise',
            'free',
            'soft',
            'calm',
            'bold',
            'true',
            'kind',
            'star',
            'gold',
            'fire',
            'pink',
            'moon',
            'rose',
            'lake',
            'leaf',
            'cloud',
            'bird',
            'tree',
            'sun',
            'rain',
            'warm',
            'open',
            'wind',
        ];
        return [
            word1[Math.floor(Math.random() * word1.length)],
            word2[Math.floor(Math.random() * word2.length)],
            word3[Math.floor(Math.random() * word3.length)],
        ];
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            if (selectedFiles.length > 0) {
                let newFiles = Array.from(event.target.files);
                setSelectedFiles(
                    Array.from(new Set([...selectedFiles, ...newFiles]))
                );
            } else {
                setSelectedFiles(Array.from(event.target.files));
            }
        }
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    const handleUpload = async () => {
        try {
            if (!selectedFiles || selectedFiles.length === 0) {
                toast.error('Please select files to upload');
                return;
            }
            if (selectedFiles && selectedFiles.length > 0) {
                setLoading(true);
                let newUnique = generateUniqueName();
                console.log(unique);
                const formData = new FormData();
                for (let file of selectedFiles) {
                    formData.append('file', file);
                }

                formData.append('unique', newUnique.join(' '));
                await pb.collection('files').create(formData);
                toast.success('Uploaded Successfully');
                setLoading(false);
                setSelectedFiles([]);
                setUnique(newUnique);

                return;
            }
        } catch (e: any) {
            console.log('Error Occured: ' + e.message);
            toast.error('Sorry. We are unable to connect to server.');
        } finally {
            try {
                purgeOldFiles();
            } finally {
            }
        }
    };

    const deleteFile = (index: number) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    return (
        <>
            <div className="flex justify-end items-center w-full fixed top-0">
                {!showInstructions && (
                    <>
                        <Button
                            onClick={toggleInstructions}
                            className="m-2"
                        >
                            ?
                        </Button>
                    </>
                )}
            </div>
            <Card
                key="1"
                className=" h-auto w-11/12 max-w-96 flex flex-col items-center justify-center m-auto"
            >
                <CardContent className="p-4 m-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                            <h1 className="text-4xl font-bold leading-none">
                                File Server
                            </h1>
                            <p className="text-sm mt-4 leading-none text-gray-500 dark:text-gray-400">
                                Temporary File Server
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardContent className="px-4 py-0">
                    <div className="text-sm text-center leading-none text-gray-500 dark:text-gray-400">
                        {loading && (
                            <div role="status">
                                <svg
                                    aria-hidden="true"
                                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                        {!!unique.length && !loading && (
                            <div>
                                Use these 3 magical words to access the uploaded
                                documents
                                <div className=" text-xl text-gray-700 dark:text-gray-200">
                                    {unique.join(' ')}
                                </div>
                            </div>
                        )}
                        {/* {!!unique.length && (
                            <div>
                                Use these 3 magical words to access the uploaded
                                documents
                                <div className=" text-xl text-gray-700 dark:text-gray-200">
                                    {unique.join(' ')}
                                </div>
                            </div>
                        )} */}
                    </div>
                </CardContent>

                <CardContent className="p-4 m-auto flex flex-col items-center w-full">
                    <label
                        htmlFor="fileInput"
                        className="m-2 file:text-white bg-background relative cursor-pointer w-full border border-gray-500 p-2 rounded-sm"
                    >
                        {selectedFiles.length > 0
                            ? `${selectedFiles.length} file(s) selected`
                            : 'Select Files'}
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <Button
                        onClick={handleUpload}
                        variant={'default'}
                        className="w-full my-2 text-md"
                    >
                        Upload
                    </Button>

                    <Link
                        href={'/get'}
                        className="w-full m-2"
                    >
                        <Button
                            variant={'outline'}
                            className="w-full border border-gray-500 text-md"
                        >
                            Get
                        </Button>
                    </Link>
                </CardContent>

                {selectedFiles.length > 0 && (
                    <div className="m-2 w-full">
                        <ul className="p-2">
                            {selectedFiles.map((file, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between p-2 my-2 h-auto w-full"
                                >
                                    <div className="flex items-center w-11/12">
                                        <div className="w-1/12 flex justify-center items-center mx-1 ">
                                            <FileIcon className="w-4 h-4 " />
                                        </div>
                                        <div className="w-11/12 flex flex-wrap mx-1">
                                            {file.name}
                                        </div>
                                    </div>
                                    <div className="w-1/12 flex items-center justify-center">
                                        <Button
                                            onClick={() => deleteFile(index)}
                                            className="h-6 w-6 p-1 bg-transparent text-gray-500 border border-gray-500"
                                        >
                                            X
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>

            {showInstructions && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
                    <div className="instructions-overlay bg-black p-4 rounded-lg border border-solid border-white/50 text-card-foreground shadow-sm m-2">
                        <div className="flex justify-between items-center w-full mb-1">
                            <h1 className=" font-semibold text-gray-200 text-lg">
                                Instructions
                            </h1>
                            <Button onClick={toggleInstructions}>X</Button>
                        </div>
                        <div className="m-1 text-sm space-y-2 leading-none text-gray-500 dark:text-gray-400">
                            <ul className="list-disc space-y-1 list-inside my-2">
                                <li className="text-sm">
                                    Click the "Choose File" button to select one
                                    or more files for upload.
                                </li>
                                <li className="text-sm">
                                    Click the "Upload" button to upload the
                                    selected files to the temporary file server.
                                </li>
                                <li className="text-sm">
                                    After uploading, you will be provided with 3
                                    magical words to access your documents.
                                </li>
                                <li className="text-sm">
                                    Use these words to retrieve your documents
                                    later.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
