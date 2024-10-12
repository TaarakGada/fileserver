'use client';
import React, { useState } from 'react';
import RevisedFileGet from './RevisedFileGet';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import RandomFact from './RandomFact';
import DownloadList from './DownloadList';
import toast from 'react-hot-toast';

const RevisedFileView = ({ code = '' }) => {
    //states
    const [fileLinks, setFileLinks] = useState<string[]>([]);
    const [collectionID, setCollectionId] = useState<string>('');
    const [textFileContent, setTextFileContent] = useState<string>('');
    const [magicWord, setMagicWord] = useState<string>(
        code.length == 4 ? code : ''
    );

    //functions
    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(textFileContent);
        toast.success('Copied to clipboard');
    };

    

    return (
        <div className="w-full my-4 flex justify-center items-center">
            <div className="w-2/5 flex flex-col justify-center items-center">
                <RevisedFileGet
                    magicWord={magicWord}
                    setFileLinks={setFileLinks}
                    setCollectionId={setCollectionId}
                    setTextFileContent={setTextFileContent}
                    collectionID={collectionID}
                    fileLinks={fileLinks}
                    textFileContent={''}
                    setMagicWord={setMagicWord}
                />
            </div>
            <div className="w-3/5 flex-col justify-center items-center">
                {fileLinks.length == 0 && textFileContent.length == 0 && (
                    <CardContent className="flex px-[10%] justify-center items-center text-3xl ">
                        <RandomFact />
                    </CardContent>
                )}
                {fileLinks.length != 0 && textFileContent.length == 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <DownloadList
                            fileLinks={fileLinks}
                            collectionID={collectionID}
                            magicWord={magicWord}
                        />
                    </div>
                )}
                {textFileContent.length != 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative w-4/5">
                            <Textarea
                                className="w-full h-[600px] "
                                placeholder="Paste the text you want to share here."
                                value={textFileContent}
                                wrap="off"
                            />
                            <div className="absolute top-3 right-3 text-sm text-gray-500">
                                {textFileContent.length} characters
                            </div>
                            {textFileContent && (
                                <Button
                                    variant="ghost"
                                    onClick={() => handleCopyToClipboard()}
                                    className="absolute bottom-2 right-2 opacity-80 bg-black font-bold border-primary border-2"
                                >
                                    Copy to Clipboard
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevisedFileView;
