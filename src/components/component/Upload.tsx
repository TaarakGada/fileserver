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
    const [showInstructions, setShowInstructions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unique, setUnique] = useState<string>();
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        });
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

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
            <div className="flex justify-end items-center w-full fixed top-0">
                {!showInstructions && (
                    <>
                        {showInstallPrompt && (
                            <Button onClick={handleInstall} className="m-2">
                                Install App
                            </Button>
                        )}
                        <Button onClick={() => setShowInstructions(true)} className="m-2">?</Button>
                    </>
                )}
            </div>
            <Card className={clsx("h-auto w-11/12 max-w-96 flex flex-col items-center justify-center m-auto", showInstructions ? "blur-sm" : "")}>
                <CardContent className="p-4 m-auto text-center">
                    <h1 className="text-4xl font-bold">File Server</h1>
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
                            <QRCode url={`https://fs.sujal.xyz/get/${unique}`} />
                        </div>
                    ) : null}
                </CardContent>

                <CardContent className="p-4 m-auto flex flex-col items-center w-full">
                    <label htmlFor="fileInput" className="m-2 file:text-white bg-background relative cursor-pointer w-full border border-gray-500 p-2 rounded-sm">
                        {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Select Files'}
                        <input type="file" id="fileInput" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                    <Button onClick={() => handleUpload()} variant='default' className="w-full my-2 text-md">Upload</Button>
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

            {showInstructions && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="instructions-overlay bg-black p-4 rounded-lg border border-solid border-white/50 text-card-foreground shadow-sm m-2">
                        <div className="flex justify-between items-center w-full mb-1">
                            <h1 className="font-semibold text-gray-200 text-lg">Instructions</h1>
                            <Button onClick={() => setShowInstructions(false)}>X</Button>
                        </div>
                        <ul className="list-disc space-y-1 list-inside my-2 text-sm text-gray-500 dark:text-gray-400">
                            <li>Click the "Choose File" button to select one or more files for upload.</li>
                            <li>Click the "Upload" button to upload the selected files to the temporary file server.</li>
                            <li>After uploading, you will be provided with 3 magical words to access your documents.</li>
                            <li>Use these words to retrieve your documents later.</li>
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}