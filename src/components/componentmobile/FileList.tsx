import React, { useEffect, useRef, useState } from 'react';
import {
    FileArchive,
    FileAudio,
    FileCode,
    FileIcon,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Sliders,
    X,
    Image,
} from 'lucide-react';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';

interface FileListProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileList: React.FC<FileListProps> = ({
    selectedFiles,
    setSelectedFiles,
}) => {
    const [listHeight, setListHeight] = useState('auto');
    const containerRef = useRef<HTMLDivElement>(null);

    const getIconForFileType = (name: string) => {
        const fileExt = name.split('.').pop()?.toLowerCase();
        switch (fileExt) {
            case 'pdf':
                return <FileIcon className="h-6 w-6 mr-2" />;
            case 'doc':
            case 'docx':
                return <FileText className="h-6 w-6 mr-2" />;
            case 'xls':
            case 'xlsx':
            case 'csv':
                return <FileSpreadsheet className="h-6 w-6 mr-2" />;
            case 'ppt':
            case 'pptx':
                return <Sliders className="h-6 w-6 mr-2" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'bmp':
            case 'tiff':
                return <Image className="h-6 w-6 mr-2" />;
            case 'mp4':
            case 'mkv':
            case 'webm':
            case 'avi':
                return <FileVideo className="h-6 w-6 mr-2" />;
            case 'mp3':
            case 'wav':
            case 'flac':
                return <FileAudio className="h-6 w-6 mr-2" />;
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
            case 'gz':
                return <FileArchive className="h-6 w-6 mr-2" />;
            case 'html':
            case 'css':
            case 'js':
            case 'jsx':
            case 'ts':
            case 'tsx':
            case 'json':
            case 'xml':
                return <FileCode className="h-6 w-6 mr-2" />;
            case 'txt':
            case 'md':
                return <FileText className="h-6 w-6 mr-2" />;
            default:
                return <FileIcon className="h-6 w-6 mr-2" />;
        }
    };

    const deleteFile = (index: number) => {
        setSelectedFiles((files) => {
            const updatedFiles = [...files];
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
    };

    return (
        <div
            ref={containerRef}
            className={`flex flex-col w-full h-full justify-center items-center p-2 rounded-xl ${
                selectedFiles.length > 0 ? 'bg-card' : ''
            }`}
        >
            {selectedFiles.length > 0 ? (
                <>
                    <CardContent className="p-2 text-center w-full flex flex-col border border-gray-500 rounded-xl max-h-[calc(100vh-370px)] min-h-[calc(100vh-370px)]">
                        <div className="w-full h-full overflow-y-auto">
                            <ul className="space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between py-2 px-3 border border-gray-600 rounded-lg bg-background/50"
                                    >
                                        <div className="flex items-center w-11/12 overflow-hidden">
                                            {getIconForFileType(file.name)}
                                            <div className="w-full overflow-hidden text-ellipsis mx-2 text-left">
                                                {file.name}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => deleteFile(index)}
                                            className="h-6 w-6 p-1 bg-primary/90 text-black border border-black rounded-lg hover:bg-primary/70 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <div className="w-full flex items-center justify-end mt-3">
                        <Button
                            variant="ghost"
                            onClick={() => setSelectedFiles([])}
                            className="opacity-80 bg-black font-bold border-primary border-2 "
                        >
                            Clear All Files
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center rounded-xl">
                    <p className="text-gray-500">
                        Select some files to upload.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FileList;
