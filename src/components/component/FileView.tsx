import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from '@/components/ui/card';

import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import toast from 'react-hot-toast';

interface FileViewProps {
    code?: string;
}

export function FileView({ code = '' }: FileViewProps) {
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [fetchedCode, setFetchedCode] = useState<string>('');
    const [fileLinks, setFileLinks] = useState<string[]>([]);
    const [magicWord, setMagicWord] = useState<string>(
        code.length == 4 ? code : ''
    );
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    const [validation, setValidation] = useState(true);

    const magicWordSchema = z
        .string()
        .length(4)
        .regex(
            /^[a-zA-Z]{2}[0-9]{2}$/,
            'Code must be 2 letters followed by 2 digits'
        );

    useEffect(() => {
        if (
            code &&
            code.length === 4 &&
            magicWordSchema.safeParse(code).success &&
            !hasAttemptedFetch
        ) {
            const timer = setTimeout(() => fetchFiles(code), 200); // 200ms delay to ensure proper handling
            return () => clearTimeout(timer); // Clean up timeout on unmount
        }
    }, [code, hasAttemptedFetch]);

    const fetchFiles = async (uniqueId: string) => {
        if (!magicWordSchema.safeParse(uniqueId).success) {
            toast.error('Invalid code');
            return;
        }
        setHasAttemptedFetch(true);
        setLoading(true);
        toast.success('Fetching files...');
        try {
            const res = await pb
                .collection('files')
                .getFirstListItem(
                    `unique = "${uniqueId.trim().toLowerCase()}"`,
                    {}
                );
            toast.success('Files found');
            setFileLinks(res.file);
            setCollectionId(res.id);
            setFetchedCode(magicWord);
            setMagicWord('');
        } catch (error: any) {
            if (error.toString().includes('ClientResponseError')) {
                toast.error('No files associated to this code!');
                setFileLinks([]);
                setCollectionId('');
                setMagicWord('');
            } else {
                toast.error('Error: ' + error?.toString());
            }
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

    return (
        <>
            <Card className="h-auto w-11/12 max-w-96 flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle>Enter the Shared Code</CardTitle>
                    <CardDescription>
                        Confused? Try uploading a file before receiving the code
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <div className="grid w-full">
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
                            placeholder="xx00"
                            type="text"
                            className={`border ${
                                !validation && !!magicWord.length
                                    ? 'border-red-500 text-red-500'
                                    : 'border-gray-500 text-primary/90'
                            }`}
                            maxLength={4}
                            minLength={4}
                        />
                        {!validation && !!magicWord.length && (
                            <p className="text-red-500 text-sm mt-4">
                                Code must be 2 letters followed by 2 digits
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardContent className="flex items-center flex-col justify-center gap-1">
                    <Button
                        className="w-full text-md"
                        onClick={handleFetchFiles}
                    >
                        {loading ? 'Loading...' : 'Fetch Files'}
                    </Button>
                    <Link href={'/'}>
                        <Button variant={'link'}>Upload Files Instead</Button>
                    </Link>
                </CardContent>
            </Card>
            {!!fileLinks.length && (
                <Card className="w-11/12 max-w-96 m-4">
                    <CardHeader>
                        <CardTitle>Files for code : {fetchedCode}</CardTitle>
                    </CardHeader>
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
        </>
    );
}
