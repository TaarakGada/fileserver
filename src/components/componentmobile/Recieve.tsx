'use client';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { z } from 'zod';
import toast from 'react-hot-toast';
import PocketBase from 'pocketbase';
import DownloadList from './DownloadList';
import { Button } from '../ui/button';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription } from '../ui/card';
import Loader from '../ui/Loader';
import { FileSearch } from 'lucide-react';

interface RecieveProps {
    code?: string;
}

export function Recieve({ code = '' }: RecieveProps) {
    const [magicWord, setMagicWord] = useState<string>(
        code.length == 4 ? code : ''
    );
    const [validation, setValidation] = useState(true);
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
    const [textFileContent, setTextFileContent] = useState<string>('');
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [fetchedCode, setFetchedCode] = useState<string>('');
    const [fileLinks, setFileLinks] = useState<string[]>([]);

    const magicWordSchema = z
        .string()
        .length(4)
        .regex(
            /^[a-zA-Z]{2}[0-9]{2}$/,
            'Code must be 2 letters followed by 2 digits'
        );

    const fetchFiles = async (uniqueId: string) => {
        if (!magicWordSchema.safeParse(uniqueId).success) {
            toast.error('Invalid code');
            return;
        }

        setLoading(true);
        toast.success('Fetching files...');
        try {
            const res = await pb
                .collection('files')
                .getFirstListItem(
                    `unique = "${uniqueId.trim().toLowerCase()}"`,
                    {}
                );
            console.log(res);
            toast.success('Files found');
            setFileLinks(res.file);
            setCollectionId(res.id);
            setFetchedCode(magicWord);
            setMagicWord('');
            const userInputFile = res.file.find((file: string) =>
                file.startsWith('user_input')
            );
            if (userInputFile) {
                const fileUrl = `https://sujal.pockethost.io/api/files/files/${res.id}/${userInputFile}`;
                const response = await fetch(fileUrl);
                const text = await response.text();
                setTextFileContent(text);
            } else {
                setTextFileContent('');
            }
            setHasAttemptedFetch(true);
        } catch (error: any) {
            if (error.toString().includes('ClientResponseError')) {
                toast.error('No files associated to this code!');
                setFileLinks([]);
                setCollectionId('');
                setMagicWord('');
            } else {
                toast.error('Error: ' + error?.toString());
            }
            setHasAttemptedFetch(false);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchFiles = () => {
        if (magicWord.length <= 0) {
            toast.error('No word entered.');
            return;
        }
        fetchFiles(magicWord);
    };

    const handleDownloadAll = async () => {
        const zip = new JSZip();
        const folder = zip.folder(magicWord);

        if (!folder) {
            toast.error("Couldn't create folder");
            return;
        }

        const fileNameCount: { [key: string]: number } = {};

        try {
            for (const link of fileLinks) {
                let fileName = link
                    ? link.split('_')[0] +
                      (link.includes('.') ? '.' + link.split('.')[1] : '')
                    : '';

                if (fileName in fileNameCount) {
                    fileNameCount[fileName] += 1;
                    const [name, extension] = fileName.split('.');
                    fileName = `${name}(${fileNameCount[fileName]})${
                        extension ? '.' + extension : ''
                    }`;
                } else {
                    fileNameCount[fileName] = 0;
                }

                const response = await fetch(
                    `https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`
                );
                const blob = await response.blob();
                folder.file(fileName, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${magicWord}_files.zip`);
            toast.success('All files downloaded successfully');
        } catch (error) {
            console.error('Error downloading files:', error);
            toast.error('Error downloading files');
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(textFileContent);
        toast.success('Copied to clipboard');
    };

    return (
        <>
            <div className="flex flex-col flex-grow justify-center w-full p-2">
                {!hasAttemptedFetch && (
                    <div className="flex flex-col flex-grow items-center h-full">
                        <div className="w-full flex-grow items-center justify-center flex flex-col">
                            <Card className="max-w-[400px]">
                                <CardContent className="p-6">
                                    <div className="w-full py-2 flex flex-col flex-grow justify-center">
                                        <h1 className="text-4xl font-bold mb-4">
                                            Enter the code:{' '}
                                        </h1>
                                        <CardDescription>
                                            Confused? Try uploading a file
                                            before receiving the code
                                        </CardDescription>
                                        <Input
                                            value={magicWord}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                setMagicWord(e.target.value);
                                                setValidation(
                                                    magicWordSchema.safeParse(
                                                        e.target.value
                                                    ).success
                                                );
                                            }}
                                            id="word3"
                                            placeholder="XX00"
                                            type="text"
                                            className={`border font-semibold w-full mt-4 ${
                                                !validation &&
                                                !!magicWord.length
                                                    ? 'border-red-500 text-red-500'
                                                    : 'border-gray-500 text-primary/90'
                                            }`}
                                            maxLength={4}
                                            minLength={4}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleFetchFiles();
                                                }
                                            }}
                                        />
                                        {!validation && !!magicWord.length && (
                                            <p className="text-red-500 text-sm mt-4 text-center">
                                                Code must be 2 letters followed
                                                by 2 digits
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <Button
                            onClick={handleFetchFiles}
                            className="bg-primary text-black text-lg font-semibold h-12 rounded-lg w-full"
                        >
                            <FileSearch className="mr-2 h-6 w-6" />
                            Fetch Files
                        </Button>
                    </div>
                )}
                {hasAttemptedFetch && (
                    <>
                        <h1 className="text-4xl font-bold">Fetched data:</h1>

                        <div className="flex flex-grow flex-col justify-center items-center w-full py-2">
                            {!textFileContent && (
                                <DownloadList
                                    fileLinks={fileLinks}
                                    collectionID={collectionID}
                                    magicWord={magicWord}
                                />
                            )}
                            {textFileContent && (
                                <Textarea
                                    value={textFileContent}
                                    disabled
                                    className="w-full flex-grow"
                                />
                            )}
                        </div>
                        <div className="w-full flex items-center justify-center py-2">
                            {!textFileContent && fileLinks.length > 0 && (
                                <div className="flex justify-evenly items-center w-full">
                                    <Button
                                        onClick={handleDownloadAll}
                                        className="bg-primary text-black font-semibold h-12 rounded-lg text-lg flex-grow mr-2"
                                    >
                                        <Download className="mr-2 h-4 w-4" />{' '}
                                        Download All Files
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setFileLinks([]);
                                            setCollectionId('');
                                            setMagicWord('');
                                            setHasAttemptedFetch(false);
                                        }}
                                        className="bg-primary text-black font-semibold h-12 rounded-lg text-lg"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                        Back
                                    </Button>
                                </div>
                            )}
                            {textFileContent && (
                                <div className="flex justify-evenly items-center w-full">
                                    <Button
                                        onClick={handleCopyToClipboard}
                                        className="bg-primary text-black font-semibold h-12 rounded-lg text-lg flex-grow mr-2"
                                    >
                                        <Copy className="mr-2 h-4 w-4" /> Copy
                                        to Clipboard
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setFileLinks([]);
                                            setCollectionId('');
                                            setMagicWord('');
                                            setHasAttemptedFetch(false);
                                        }}
                                        className="bg-primary text-black font-semibold h-12 rounded-lg text-lg"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                        Back
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {loading && (
                <div className="absolute z-20 h-screen top-0 left-0 bg-black/80 flex flex-col justify-center items-center w-full">
                    <Loader />
                </div>
            )}
        </>
    );
}

export default Recieve;
