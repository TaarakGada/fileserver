import React, { useState, ChangeEvent, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Loader from '../ui/Loader';
import { Package, UploadCloudIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CardComponentProps {
    activeTab: string;
    setActiveTab: (value: string) => void;
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
    handleUpload: () => void;
    loading: boolean;
    textInput: string;
    setTextInput: React.Dispatch<React.SetStateAction<string>>;
}

const ImprovedUploadCard: React.FC<CardComponentProps> = ({
    activeTab,
    setActiveTab,
    selectedFiles,
    setSelectedFiles,
    handleUpload,
    loading,
    textInput,
    setTextInput,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [showUploadButton, setShowUploadButton] = useState(false);

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

    const handleTabChange = (newTab: string) => {
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setSelectedFiles([]);
            setTextInput('');
        }
    };

    useEffect(() => {
        setShowUploadButton(selectedFiles.length > 0 || textInput.length > 0);
    }, [selectedFiles, textInput]);

    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();

            const items = e.clipboardData?.items;
            if (items) {
                if (activeTab === 'files') {
                    const files = Array.from(items)
                        .filter((item) => item.kind === 'file')
                        .map((item) => item.getAsFile())
                        .filter((file): file is File => file !== null);
                    if (files.length > 0) {
                        handleNewFiles(files);
                    }
                } else {
                    const textItem = Array.from(items).find(
                        (item) => item.kind === 'string'
                    );
                    if (textItem) {
                        textItem.getAsString((text) => {
                            setTextInput(textInput + text);
                        });
                    }
                }
            }
        };

        document.addEventListener('paste', handlePaste);

        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [activeTab, handleNewFiles, setTextInput]);

    return (
        <Card className="flex flex-col items-center justify-evenly my-auto mx-4 p-6 h-[600px] w-full max-w-[450px] shadow-lg">
            <CardContent className="p-0 mb-4 mx-auto text-center">
                <h1 className="text-4xl font-bold">File Share</h1>
                <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
                    Temporary File Server
                </p>
            </CardContent>

            <div className="w-full flex items-center justify-center rounded mb-6">
                <div className="p-2 bg-secondary rounded-xl flex justify-center items-center shadow-md">
                    <Button
                        onClick={() => handleTabChange('files')}
                        variant={activeTab === 'files' ? 'default' : 'ghost'}
                        className="w-24"
                    >
                        Files
                    </Button>
                    <Button
                        onClick={() => handleTabChange('text')}
                        variant={activeTab === 'text' ? 'default' : 'ghost'}
                        className="w-24"
                    >
                        Text
                    </Button>
                </div>
            </div>

            <div className="w-full flex-grow flex-col justify-center items-center">
                {activeTab === 'files' && (
                    <div className="flex flex-col h-full justify-center items-center">
                        <div className="w-full">
                            {loading ? (
                                <div className="absolute z-20 h-screen top-0 left-0 bg-black/85 flex flex-col justify-center items-center w-full">
                                    <Loader />
                                </div>
                            ) : null}
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full h-64 flex flex-grow items-center justify-center border-2 text-gray-500 bg-secondary/50 rounded-lg font-semibold cursor-pointer transition-colors duration-300 ${
                                isDragging
                                    ? 'border-primary border-dashed bg-primary/10'
                                    : 'border-gray-300 hover:border-primary hover:bg-secondary'
                            }`}
                            onClick={() =>
                                document.getElementById('fileInput')?.click()
                            }
                        >
                            <div className="text-center">
                                <Package
                                    size={48}
                                    className="mx-auto mb-4"
                                />
                                <p className="text-lg">
                                    {selectedFiles.length > 0
                                        ? `${selectedFiles.length} file(s) selected`
                                        : 'Click or drag files here'}
                                </p>
                            </div>
                        </motion.div>
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
                    </div>
                )}
                {activeTab === 'text' && (
                    <div className="w-full">
                        {loading ? (
                            <div className="absolute z-20 h-screen top-0 left-0 bg-black/85 flex flex-col justify-center items-center w-full">
                                <Loader />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <CardContent className="p-0 flex flex-col items-center w-full mt-6">
                <AnimatePresence>
                    {showUploadButton ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <Button
                                onClick={() => handleUpload()}
                                variant="default"
                                disabled={loading}
                                className="w-full text-lg py-6"
                            >
                                <UploadCloudIcon
                                    className="mr-2"
                                    size={24}
                                />
                                Upload
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-gray-500"
                        >
                            Select files or enter text to enable upload
                        </motion.p>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

export default ImprovedUploadCard;
