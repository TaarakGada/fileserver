import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download, FileIcon } from 'lucide-react';
import { useState } from 'react';
import PocketBase from 'pocketbase';
import toast from 'react-hot-toast';

export function FileView() {
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [showInstructions, setShowInstructions] = useState(false);
    const [fileLinks, setFilelinks] = useState<string[]>([]);
    const [magicWords, setMagicWords] = useState<string[]>([]);
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const fetchFiles = async () => {
        try {
            if (magicWords.length <= 0) {
                toast.error('No word entered.');
                return;
            }
            magicWords.forEach((word) => {
                if (word.length <= 0) {
                    toast.error('Please enter all the words');
                    return;
                }
            });

            setLoading(true);
            toast.success('Fetching files...');
            const res = await pb
                .collection('files')
                .getFirstListItem(
                    `unique = "${magicWords[0]
                        .trim()
                        .toLowerCase()} ${magicWords[1]
                        .trim()
                        .toLowerCase()} ${magicWords[2].trim().toLowerCase()}"`,
                    {}
                );

            setFilelinks(res.file);
            setCollectionId(res.id);
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Error fetching files. Please try again.');
        } finally {
            setLoading(false);
            setMagicWords((current) => []);
            // also clear any value in word inputs
            const word1Input = document.getElementById(
                'word1'
            ) as HTMLInputElement;
            const word2Input = document.getElementById(
                'word2'
            ) as HTMLInputElement;
            const word3Input = document.getElementById(
                'word3'
            ) as HTMLInputElement;

            if (word1Input && word2Input && word3Input) {
                word1Input.value = '';
                word2Input.value = '';
                word3Input.value = '';
            }
        }
    };

    const handleInputChange = (index: number, value: string) => {
        setMagicWords((current) => {
            const updatedWords = [...current];
            updatedWords[index] = value;
            return updatedWords;
        });

        // Move focus to the next input field if not the last input
        if (index < 2 && value.endsWith(' ')) {
            const nextInput = document.getElementById(`word${index + 2}`);
            nextInput?.focus();
        } else if (index == 2 && value.endsWith(' ')) {
            return fetchFiles();
        }
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
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
            <Card className="w-auto max-w-lg m-4">
                <CardHeader>
                    <CardTitle>Enter the 3 magical Words</CardTitle>
                    <CardDescription>
                        Enter the words to fetch the uploaded files.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div className="grid w-full">
                        <Input
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleInputChange(0, e.target.value)}
                            id="word1"
                            placeholder="moon"
                            type="text"
                            className="border border-gray-500"
                        />
                    </div>
                    <div className="grid w-full">
                        <Input
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => handleInputChange(1, e.target.value)}
                            id="word2"
                            placeholder="life"
                            type="text"
                            className="border border-gray-500"
                        />
                    </div>
                    <div className="grid w-full">
                        <Input
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setMagicWords((current) => [
                                    current[0],
                                    current[1],
                                    e.target.value,
                                ]);
                            }}
                            id="word3"
                            placeholder="nature"
                            type="text"
                            className="border border-gray-500"
                        />
                    </div>
                </CardContent>
                <CardContent className="flex items-center flex-col justify-center mt-4 gap-1">
                    <Button
                        className="w-full text-md"
                        onClick={fetchFiles}
                    >
                        {loading ? 'Loading...' : 'Fetch Files'}
                    </Button>
                    <Link href={'/'}>
                        <Button variant={'link'}>Upload Files Instead</Button>
                    </Link>
                </CardContent>
            </Card>
            {!!fileLinks.length && (
                <Card className="w-full max-w-lg m-4">
                    <CardContent>
                        {fileLinks.map((link) => (
                            <div
                                key={link}
                                className="flex items-center mt-4 space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <a
                                    target="_blank"
                                    href={`https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`}
                                    download
                                >
                                    {link
                                        ? link.split('_')[0] +
                                          (link.includes('.')
                                              ? '.' + link.split('.')[1]
                                              : '')
                                        : ''}
                                </a>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {showInstructions && (
                <div className="fixed top-0 left-0 w-full h-full z-5 flex justify-center items-center">
                    <div className="instructions-overlay bg-black p-4 rounded-lg border border-solid border-white/50 text-card-foreground shadow-sm">
                        <div className="flex justify-between items-center w-full">
                            <h1 className=" font-semibold text-gray-200 text-lg">
                                Instructions
                            </h1>
                            <Button onClick={toggleInstructions}>X</Button>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            To fetch your uploaded files, follow these steps:
                        </p>
                        <ol className="list-decimal list-inside mt-2 text-gray-400">
                            <li>
                                Enter three words in the input fields above.
                            </li>
                            <li>Click the "Fetch Files" button.</li>
                            <li>
                                If the words match, the uploaded files will be
                                displayed below.
                            </li>
                            <li>Click on the file links to download them.</li>
                        </ol>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                            If you want to upload files instead, you can click
                            the "Upload Files Instead" link.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
