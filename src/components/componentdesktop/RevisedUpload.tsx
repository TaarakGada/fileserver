'use client';
import React, {
    useEffect,
    useState,
    DragEvent,
    useCallback,
    useRef,
} from 'react';
import RevisedUploadCard from './RevisedUploadCard';
import toast from 'react-hot-toast';
import PocketBase from 'pocketbase';
import RandomFact from './RandomFact';
import { CardContent } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import FileList from './FileList';
import ShowCode from './ShowCode';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

function RevisedUpload() {
    const pb = new PocketBase('https://sujal.pockethost.io');
    const [activeTab, setActiveTab] = useState('files');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [textInput, setTextInput] = useState('');
    const [isUploaded, setIsUploaded] = useState(false);
    const [uniqueCode, setUniqueCode] = useState<string>();
    const [isDragging, setIsDragging] = useState(false);
    const dragCounter = useRef(0);
    const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                newUnique = generateUniqueCode().toLowerCase();
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

            formData.append('unique', newUnique.toLowerCase());

            await pb.collection('files').create(formData);
            toast.success('Uploaded Successfully');
            setUniqueCode(newUnique);
            setSelectedFiles([]);
            setTextInput('');

            deleteOldFiles();
        } catch (e: any) {
            console.error('Error Occurred:', e.message);
            toast.error('Sorry. We are unable to connect to server.');
        } finally {
            setLoading(false);
            setIsUploaded(true);
            setActiveTab('files');
        }
    };

    const handleNewFiles = useCallback((newFiles: File[]) => {
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
    }, []);

    const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounter.current++;
        if (dragCounter.current === 1) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragTimeoutRef.current) {
            clearTimeout(dragTimeoutRef.current);
        }
        dragTimeoutRef.current = setTimeout(() => {
            if (dragCounter.current === 0) {
                setIsDragging(false);
            }
        }, 100);
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            dragCounter.current = 0;
            const files = Array.from(e.dataTransfer.files);

            if (activeTab === 'text') {
                setActiveTab('files');
            }
            handleNewFiles(files);
        },
        [activeTab, handleNewFiles]
    );

    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="w-full flex justify-center items-center min-w-[700px] overflow-auto m-8"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="absolute inset-0 bg-black/90 border-4 border-dashed border-white rounded-lg flex items-center justify-center z-50 w-screen min-h-screen"
                    >
                        <div className="text-center">
                            <PackageOpen
                                size={64}
                                className="mx-auto mb-4 text-white"
                            />
                            <h2 className="text-2xl font-bold text-white">
                                Drop your files anywhere
                            </h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="w-2/5 flex flex-col justify-center items-center flex-grow">
                {!isUploaded && (
                    <RevisedUploadCard
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        handleUpload={handleUpload}
                        loading={loading}
                        textInput={textInput}
                        setTextInput={setTextInput}
                    />
                )}
                {isUploaded && uniqueCode && (
                    <ShowCode
                        unique={uniqueCode}
                        setIsUploaded={setIsUploaded}
                    />
                )}
            </div>
            <div className="w-3/5 flex-col justify-center items-center flex-grow">
                {(selectedFiles.length == 0 || isUploaded) &&
                    activeTab !== 'text' && (
                        <CardContent className="flex px-[10%] justify-center items-center text-3xl ">
                            <RandomFact />
                        </CardContent>
                    )}
                {activeTab === 'files' && selectedFiles.length > 0 && (
                    <div className="flex flex-col justify-center items-center">
                        <FileList
                            selectedFiles={selectedFiles}
                            setSelectedFiles={setSelectedFiles}
                        />
                    </div>
                )}
                {activeTab === 'text' && !isUploaded && (
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative w-4/5">
                            <Textarea
                                className="w-full h-[600px] "
                                placeholder="Paste the text you want to share here."
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                                wrap="off"
                            />
                            <div className="absolute top-3 right-3 text-sm text-gray-500">
                                {textInput.length} characters
                            </div>
                            {textInput && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setTextInput('')}
                                    className="absolute bottom-2 right-2 opacity-80 bg-black font-bold border-primary border-2"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RevisedUpload;
