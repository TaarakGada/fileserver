'use client';
import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import PocketBase from 'pocketbase';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FileIcon } from 'lucide-react';
import QRCode from './qrCode';
import clsx from 'clsx';

export function Upload() {
    
    const [loading, setLoading] = useState(false);
    const [unique, setUnique] = useState<string>();
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


    useEffect(() => {
        if (isPWA() && 'launchQueue' in window) {
            (window as any).launchQueue.setConsumer(async (launchParams: any) => {
                if (launchParams.files.length) {
                    const fileHandles = await Promise.all(launchParams.files);
                    const file = await fileHandles[0].getFile();
                    setSelectedFiles([file]);
                    handleUpload([file]);
                }
            });
        }
    }, []);

    const isPWA = () => {
        return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    };



    const generateUniqueCode = (): string => {
        const alphabets = 'abcdefghijkmnopqrstuvwxyz';
        const twoAlphabets = alphabets[Math.floor(Math.random() * 25)] + alphabets[Math.floor(Math.random() * 25)];
        const twoNumbers = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10);
        return twoAlphabets + twoNumbers;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    const handleUpload = async (filesToUpload: File[] = selectedFiles) => {
        if (!filesToUpload.length) {
            toast.error('Please select files to upload');
            return;
        }
        setLoading(true);
        try {
            let newUnique;
            do {
                newUnique = generateUniqueCode();
            } while (await pb.collection('files').getFirstListItem(`unique="${newUnique}"`).catch(() => null));

            const formData = new FormData();
            filesToUpload.forEach(file => formData.append('file', file));
            formData.append('unique', newUnique);

            await pb.collection('files').create(formData);
            toast.success('Uploaded Successfully');
            setUnique(newUnique);
            setSelectedFiles([]);
        } catch (e: any) {
            console.error('Error Occurred:', e.message);
            toast.error('Sorry. We are unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = (index: number) => {
        setSelectedFiles(files => files.filter((_, i) => i !== index));
    };

    return (
        <>
            <Card className={"h-auto w-11/12 max-w-96 flex flex-col items-center justify-center m-auto"}>
                <CardContent className="p-4 m-auto text-center">
                    <h1 className="text-4xl font-bold">File Share</h1>
                    <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">Temporary File Server</p>
                </CardContent>

                <CardContent className="px-4 py-0 text-center">
                    {loading ? (
                        <div role="status">
                            {/* Your loading SVG here */}
                        </div>
                    ) : unique ? (
                        <div>
                            <div className="text-xl text-gray-700 dark:text-gray-200 font-mono">
                                Sharing Code <span className='text-primary'>{unique}</span>
                            </div>
                            <QRCode url={`https://fs.sujal.xyz/${unique}`} />
                        </div>
                    ) : null}
                </CardContent>

                <CardContent className="p-4 m-auto flex flex-col items-center w-full">
                    <label htmlFor="fileInput" className="m-2 file:text-white bg-background relative cursor-pointer w-full border border-gray-500 p-2 rounded-sm">
                        {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Select Files'}
                        <input type="file" id="fileInput" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                    <Button onClick={() => handleUpload()} variant='default' disabled={loading} className="w-full my-2 text-md">Upload</Button>
                    <Link href='/get' className="w-full m-2">
                        <Button variant='outline' className="w-full border border-gray-500 text-md">Get</Button>
                    </Link>
                </CardContent>

                {selectedFiles.length > 0 && (
                    <div className="m-2 w-full">
                        <ul className="p-2">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between p-2 my-2 h-auto w-full">
                                    <div className="flex items-center w-11/12">
                                        <FileIcon className="w-4 h-4 mx-1" />
                                        <div className="w-11/12 overflow-hidden text-ellipsis mx-1">{file.name}</div>
                                    </div>
                                    <Button onClick={() => deleteFile(index)} className="h-6 w-6 p-1 bg-transparent text-gray-500 border border-gray-500">X</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>
        </>
    );
}