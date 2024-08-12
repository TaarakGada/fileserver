'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DownloadCloudIcon, Sliders, UploadCloudIcon, X } from 'lucide-react';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from './qrCode';

import {
    FileArchive,
    FileAudio,
    FileCode,
    FileIcon,
    FileSearch,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Image,
} from 'lucide-react';

const getIconForFileType = (name: string) => {
    const fileExt = name.split('.').pop()?.toLowerCase();
    switch (fileExt) {
        case 'pdf':
            return <FileIcon className="h-6 w-6 mr-2" />;
        case 'doc':
        case 'docx':
            return <FileText className="h-6 w-6 mr-2" />;
        case 'xls':
        case 'xlsx':
        case 'csv':
            return <FileSpreadsheet className="h-6 w-6 mr-2" />;
        case 'ppt':
        case 'pptx':
            return <Sliders className="h-6 w-6 mr-2" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'tiff':
            return <Image className="h-6 w-6 mr-2" />;
        case 'mp4':
        case 'mkv':
        case 'webm':
        case 'avi':
            return <FileVideo className="h-6 w-6 mr-2" />;
        case 'mp3':
        case 'wav':
        case 'flac':
            return <FileAudio className="h-6 w-6 mr-2" />;
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
            return <FileArchive className="h-6 w-6 mr-2" />;
        case 'html':
        case 'css':
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'json':
        case 'xml':
            return <FileCode className="h-6 w-6 mr-2" />;
        case 'txt':
        case 'md':
            return <FileText className="h-6 w-6 mr-2" />;
        case 'xls':
        case 'xlsx':
            return <FileSpreadsheet className="h-6 w-6 mr-2" />;
        default:
            return <FileIcon className="h-6 w-6 mr-2" />;
    }
};

const deleteOldFiles = async () => {
    // delete 10 days old files
    const pb = new PocketBase('https://sujal.pockethost.io');
    // Get the current date and subtract 10 days
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 1);

    // Format the date as a string that matches your date format (e.g., "YYYY-MM-DD HH:mm:ss")
    const formattedDate = tenDaysAgo.toISOString().split('T')[0] + ' 00:00:00';

    // Fetch the files created 10 days ago or earlier
    const resultList = await pb.collection('files').getList(1, 50, {
        filter: `created <= "${formattedDate}"`,
    });

    resultList.items.forEach(async (file) => {
        await pb.collection('files').delete(file.id);
    });
};

export function Upload() {
    const [loading, setLoading] = useState(false);
    const [uniqueCode, setUniqueCode] = useState<string>();
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    useEffect(() => {
        if (isPWA() && 'launchQueue' in window) {
            (window as any).launchQueue.setConsumer(
                async (launchParams: any) => {
                    if (launchParams.files.length) {
                        const fileHandles = await Promise.all(
                            launchParams.files
                        );
                        const file = await fileHandles[0].getFile();
                        setSelectedFiles([file]);
                        handleUpload([file]);
                    }
                }
            );
        }
    }, []);

    const isPWA = () => {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
        );
    };

    const generateUniqueCode = (): string => {
        const alphabets = 'abcdefghijkmnopqrstuvwxyz';
        const twoAlphabets =
            alphabets[Math.floor(Math.random() * 25)] +
            alphabets[Math.floor(Math.random() * 25)];
        const twoNumbers =
            Math.floor(Math.random() * 10) +
            '' +
            Math.floor(Math.random() * 10);
        return twoAlphabets + twoNumbers;
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);

            setSelectedFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];

                newFiles.forEach((newFile) => {
                    const isDuplicate = updatedFiles.some(
                        (existingFile) =>
                            existingFile.name === newFile.name &&
                            existingFile.size === newFile.size &&
                            existingFile.type === newFile.type
                    );

                    if (!isDuplicate) {
                        updatedFiles.push(newFile);
                    }
                });

                return updatedFiles;
            });
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
            } while (
                await pb
                    .collection('files')
                    .getFirstListItem(`unique="${newUnique}"`)
                    .catch(() => null)
            );

            const formData = new FormData();
            filesToUpload.forEach((file) => formData.append('file', file));
            formData.append('unique', newUnique);

            await pb.collection('files').create(formData);
            toast.success('Uploaded Successfully');
            setUniqueCode(newUnique);
            setSelectedFiles([]);

            deleteOldFiles();
        } catch (e: any) {
            console.error('Error Occurred:', e.message);
            toast.error('Sorry. We are unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = (index: number) => {
        setSelectedFiles((files) => files.filter((_, i) => i !== index));
    };

    return (
        <>
            <Card
                className={
                    'h-auto w-11/12 max-w-96 flex flex-col items-center justify-center m-auto'
                }
            >
                <CardContent className="p-4 m-auto text-center">
                    <h1 className="text-4xl font-bold">File Share</h1>
                    <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
                        Temporary File Server
                    </p>
                </CardContent>

                <CardContent className="px-4 py-0 text-center">
                    {loading ? (
                        <div role="status">
                            <svg
                                aria-hidden="true"
                                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary/90"
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
                    ) : uniqueCode && !selectedFiles.length ? (
                        <div>
                            <div className="text-xl text-gray-700 dark:text-gray-200 font-mono">
                                Sharing Code{' '}
                                <span className="text-primary">
                                    {uniqueCode}
                                </span>
                            </div>
                            <QRCode
                                url={`https://fs.sujal.xyz/${uniqueCode}`}
                            />
                        </div>
                    ) : null}
                </CardContent>

                <CardContent className="p-4 m-auto flex flex-col items-center w-full">
                    <label
                        htmlFor="fileInput"
                        className="m-2 file:text-white bg-background relative cursor-pointer w-full border border-gray-500 p-2 rounded-sm"
                    >
                        {' '}
                        <FileSearch className="inline-block mr-2" />
                        {selectedFiles.length > 0
                            ? `${selectedFiles.length} file(s) selected`
                            : 'Click here to select files'}
                        <input
                            type="file"
                            id="fileInput"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <Button
                        onClick={() => handleUpload()}
                        variant="default"
                        disabled={loading}
                        className="w-full my-2 text-md"
                    >
                        <UploadCloudIcon className="mr-2" />
                        Upload
                    </Button>
                    <Link
                        href="/get"
                        className="w-full m-2"
                    >
                        <Button
                            variant="outline"
                            className="w-full border border-gray-500 text-md"
                        >
                            <DownloadCloudIcon className="mr-2" /> Get
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
                                        {getIconForFileType(file.name)}
                                        <div className="w-11/12 overflow-hidden text-ellipsis mx-1">
                                            {file.name}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => deleteFile(index)}
                                        className="h-6 w-6 p-1 bg-primary/90 text-black border border-black"
                                    >
                                        <X />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Card>
        </>
    );
}
