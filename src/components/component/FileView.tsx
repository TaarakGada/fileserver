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
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import toast from 'react-hot-toast';

interface FileViewProps {
    code?: string;
}

export function FileView({ code = '' }: FileViewProps) {
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [fileLinks, setFileLinks] = useState<string[]>([]);
    const [magicWord, setMagicWord] = useState<string>(code.length == 4 ? code : '');
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (code && code.length === 4 && !hasAttemptedFetch) {
            fetchFiles(code);
        }
    }, [code, hasAttemptedFetch]);

    const fetchFiles = async (uniqueId: string) => {
        setHasAttemptedFetch(true);
        setLoading(true);
        try {
            toast.success('Fetching files...');
            const res = await pb
                .collection('files')
                .getFirstListItem(`unique = "${uniqueId.trim().toLowerCase()}"`, {});

            setFileLinks(res.file);
            setCollectionId(res.id);
        } catch (error: any) {
            if (!error.toString().includes("ClientResponseError")) {
                toast.error("Error: " + error?.toString());
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setMagicWord(e.target.value);
                            }}
                            id="word3"
                            placeholder="xx00"
                            type="text"
                            className="border border-gray-500"
                        />
                    </div>
                </CardContent>
                <CardContent className="flex items-center flex-col justify-center mt-4 gap-1">
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
        </>
    );
}