import React, { useCallback, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card';
import { FileSearch2, Link, UploadCloudIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { set, z } from 'zod';
import toast from 'react-hot-toast';
import PocketBase from 'pocketbase';
import Loader from '../ui/Loader';

interface FileViewProps {
    code?: string;
    fileLinks: string[];
    setFileLinks: React.Dispatch<React.SetStateAction<string[]>>;
    collectionID: string;
    setCollectionId: React.Dispatch<React.SetStateAction<string>>;
    textFileContent: string;
    setTextFileContent: React.Dispatch<React.SetStateAction<string>>;
    magicWord: string;
    setMagicWord: React.Dispatch<React.SetStateAction<string>>;
}

const RevisedFileGet: React.FC<FileViewProps> = ({
    setCollectionId,
    fileLinks,
    setFileLinks,
    textFileContent,
    setTextFileContent,
    collectionID,
    magicWord,
    setMagicWord,
}) => {
    const magicWordSchema = z
        .string()
        .length(4)
        .regex(
            /^[a-zA-Z]{2}[0-9]{2}$/,
            'Code must be 2 letters followed by 2 digits'
        );

    const pb = new PocketBase('https://sujal.pockethost.io');

    //states
    const [validation, setValidation] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = React.useState(false);

    //functions
    const fetchFiles = async (uniqueId: string) => {
        if (!magicWordSchema.safeParse(uniqueId).success) {
            toast.error('Invalid code');
            return;
        }
        setHasAttemptedFetch(true);
        setLoading(true);
        try {
            const res = await pb
                .collection('files')
                .getFirstListItem(
                    `unique = "${uniqueId.trim().toLowerCase()}"`,
                    {}
                );
            console.log(res);
            setFileLinks(res.file);
            setCollectionId(res.id);
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
            setMagicWord('');
            setHasAttemptedFetch(false);
        } catch (error: any) {
            if (error.toString().includes('ClientResponseError')) {
                toast.error('No files associated to this code!');
                setFileLinks([]);
                setCollectionId('');
                setMagicWord('');
                setHasAttemptedFetch(false);
            } else {
                toast.error('Error: ' + error?.toString());
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            magicWord &&
            magicWord.length === 4 &&
            magicWordSchema.safeParse(magicWord).success &&
            !hasAttemptedFetch
        ) {
            const timer = setTimeout(() => fetchFiles(magicWord), 200); // 200ms delay to ensure proper handling
            return () => clearTimeout(timer); // Clean up timeout on unmount
        }
    }, [magicWord, hasAttemptedFetch]);

    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleFetchFiles();
            }
        },
        [magicWord]
    );

    const handleFetchFiles = () => {
        if (magicWord.length <= 0) {
            toast.error('No word entered.');
            return;
        }
        fetchFiles(magicWord);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(textFileContent);
        toast.success('Copied to clipboard');
    };

    return (
        <>
            <Card className="flex flex-col items-center justify-evenly m-auto p-4 h-auto min-w-[200px] w-4/5 max-w-[400px]">
                <CardHeader>
                    <CardTitle>Enter the Shared Code</CardTitle>
                    <CardDescription>
                        Confused? Try uploading a file before receiving the code
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex w-full p-4">
                    <div className="grid w-full rounded-sm">
                        <Input
                            value={magicWord}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setMagicWord(e.target.value);
                                setValidation(
                                    magicWordSchema.safeParse(e.target.value)
                                        .success
                                );
                            }}
                            id="word3"
                            placeholder="XX00"
                            type="text"
                            className={`border font-semibold w-full ${
                                !validation && !!magicWord.length
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
                                Code must be 2 letters followed by 2 digits
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardContent className="px-4 m-auto flex flex-col items-center w-full pb-4">
                    <Button
                        className="w-full text-md my-2"
                        onClick={handleFetchFiles}
                    >
                        <FileSearch2 className="mr-2" /> Fetch Files
                    </Button>
                </CardContent>
            </Card>
            {loading && (
                <div className="absolute z-20 h-screen top-0 left-0 bg-black/85 flex flex-col justify-center items-center w-full">
                    <Loader />
                </div>
            )}
        </>
    );
};

export default RevisedFileGet;
