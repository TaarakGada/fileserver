"use client";
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Download } from 'lucide-react';
import Link from 'next/link';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function GetFiles({ params }: { params: { id: string } }) {
    const { id } = params;
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [fileLinks, setFileLinks] = useState<string[]>([]);
    const [collectionID, setCollectionId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (id && id.length === 4 && !hasAttemptedFetch) {
            fetchFiles(id);
        }
    }, [id, hasAttemptedFetch]);

    const fetchFiles = async (uniqueId: string) => {
        setHasAttemptedFetch(true);
        setLoading(true);
        try {
            const res = await pb
                .collection('files')
                .getFirstListItem(`unique = "${uniqueId.trim().toLowerCase()}"`, {});

            setFileLinks(res.file);
            setCollectionId(res.id);
        } catch (error: any) {
            if(!error.toString().includes("ClientResponseError")){
                toast("Error: " + error?.toString())
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <Card className="w-auto max-w-lg m-4">
                <CardHeader>
                    <CardTitle>Your Shared Files</CardTitle>
                    <CardDescription>
                        Files associated with code: {id}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading files...</p>
                    ) : fileLinks.length > 0 ? (
                        fileLinks.map((link) => (
                            <div key={link} className="flex items-center mt-4 space-x-2">
                                <Download className="w-4 h-4" />
                                <a
                                    target="_blank"
                                    href={`https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`}
                                    download
                                >
                                    {link
                                        ? link.split('_')[0] +
                                        (link.includes('.') ? '.' + link.split('.')[1] : '')
                                        : ''}
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>No files found for this code.</p>
                    )}
                </CardContent>
                <CardContent className="flex items-center justify-center mt-4">
                    <Link href="/">
                        <Button variant="link">Upload More Files</Button>
                    </Link>
                </CardContent>
            </Card>
        </main>
    );
}