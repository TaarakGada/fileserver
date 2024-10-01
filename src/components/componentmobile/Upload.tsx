'use client';
import React, { ChangeEvent, useState } from 'react';
import PocketBase from 'pocketbase';
import FileList from './FileList';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import toast from 'react-hot-toast';
import ShowQr from './ShowQR';
import Loader from '../ui/Loader';
import { UploadCloud } from 'lucide-react';

function Upload() {
    const [loading, setLoading] = useState(false);
    const [uniqueCode, setUniqueCode] = useState<string>('');
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [activeTab, setActiveTab] = useState('files');
    const [textInput, setTextInput] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);

    const handleTabChange = (newTab: string) => {
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setSelectedFiles([]);
            setTextInput('');
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            handleNewFiles(newFiles);
        }
    };

    const handleNewFiles = (newFiles: File[]) => {
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

    const deleteOldFiles = async () => {
        const pb = new PocketBase('https://sujal.pockethost.io');
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 1);
        const formattedDate =
            tenDaysAgo.toISOString().split('T')[0] + ' 00:00:00';
        const resultList = await pb.collection('files').getList(1, 50, {
            filter: `created <= "${formattedDate}"`,
        });
        resultList.items.forEach(async (file) => {
            await pb.collection('files').delete(file.id);
        });
    };

    const handleUpload = async (filesToUpload: File[] = selectedFiles) => {
        if (!filesToUpload.length && !textInput.trim()) {
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

            if (textInput.trim()) {
                const textBlob = new Blob([textInput], { type: 'text/plain' });
                const textFile = new File([textBlob], 'user_input.txt', {
                    type: 'text/plain',
                });
                formData.append('file', textFile);
            }

            formData.append('unique', newUnique);

            await pb.collection('files').create(formData);
            toast.success('Uploaded Successfully');
            setUniqueCode(newUnique);
            setSelectedFiles([]);
            setTextInput('');
            setIsUploaded(true);
            deleteOldFiles();
        } catch (e: any) {
            console.error('Error Occurred:', e.message);
            toast.error('Sorry. We are unable to connect to server.');
            setIsUploaded(false);
        } finally {
            setLoading(false);
            setActiveTab('files');
        }
    };

    return (
        <>
            {!isUploaded && (
                <div className="flex flex-col flex-grow justify-center w-full p-2 py-4">
                    <div className="w-full flex justify-center rounded">
                        <div className="p-2 bg-card rounded-xl flex justify-center items-center shadow-md">
                            <Button
                                onClick={() => handleTabChange('files')}
                                variant={
                                    activeTab === 'files' ? 'default' : 'ghost'
                                }
                                className="w-28 text-lg font-semibold h-12 rounded-lg"
                            >
                                Files
                            </Button>
                            <Button
                                onClick={() => handleTabChange('text')}
                                variant={
                                    activeTab === 'text' ? 'default' : 'ghost'
                                }
                                className="w-28 text-lg font-semibold h-12 rounded-lg"
                            >
                                Text
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-grow flex-col justify-center items-center w-full py-4">
                        {activeTab === 'text' && (
                            <div className="relative w-full h-full">
                                <Textarea
                                    className="w-full h-full"
                                    placeholder="Paste the text you want to share here."
                                    value={textInput}
                                    onChange={(e) =>
                                        setTextInput(e.target.value)
                                    }
                                    wrap="off"
                                />
                                {textInput && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setTextInput('')}
                                        className="absolute bottom-2 right-2 opacity-80 bg-black font-bold border-primary border-2 h-12 rounded-lg text-lg"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        )}
                        {activeTab === 'files' && (
                            <FileList
                                selectedFiles={selectedFiles}
                                setSelectedFiles={setSelectedFiles}
                            />
                        )}
                    </div>
                    <div className="w-full flex items-center justify-center">
                        {activeTab === 'files' && (
                            <>
                                {selectedFiles.length > 0 && (
                                    <Button
                                        className="w-4/5 h-12 text-lg font-semibold rounded-lg mr-2"
                                        onClick={() => handleUpload()}
                                    >
                                        <UploadCloud className="mr-2" />
                                        Upload
                                    </Button>
                                )}

                                <label
                                    htmlFor="fileInput"
                                    className="flex flex-grow justify-center items-center bg-primary/90 text-black h-12 rounded-lg cursor-pointer text-lg font-semibold"
                                >
                                    <Plus className="" />
                                    {selectedFiles.length === 0
                                        ? 'Add Files'
                                        : ''}
                                    <input
                                        type="file"
                                        id="fileInput"
                                        multiple
                                        onChange={(event) => {
                                            handleFileChange(event);
                                            event.target.value = '';
                                        }}
                                        className="hidden"
                                    />
                                </label>
                            </>
                        )}
                        {activeTab === 'text' && (
                            <Button
                                className="w-full h-12 text-lg font-semibold rounded-lg text-black"
                                onClick={() => handleUpload()}
                            >
                                <UploadCloud className="mr-2" />
                                Upload
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {isUploaded && (
                <ShowQr
                    unique={uniqueCode}
                    setIsUploaded={setIsUploaded}
                />
            )}
            {loading && (
                <div className="absolute z-20 h-screen top-0 left-0 bg-black/85 flex flex-col justify-center items-center w-full">
                    <Loader />
                </div>
            )}
        </>
    );
}

export default Upload;
