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
import React from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent } from '../ui/card';

interface FileListProps {
    selectedFiles: File[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileList: React.FC<FileListProps> = ({
    selectedFiles,
    setSelectedFiles,
}) => {
    //functions
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
            case 'xls':
            case 'xlsx':
                return <FileSpreadsheet className="h-6 w-6 mr-2" />;
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
        <div className="h-[600px] m-auto w-4/5">
            <Card className="h-full w-full  flex flex-col m-auto p-4">
                <CardHeader className="p-0">
                    <h2 className="text-4xl font-semibold text-white">
                        Selected Files
                    </h2>
                </CardHeader>
                <div className="flex flex-col flex-grow mt-4">
                    {selectedFiles.length > 0 ? (
                        <>
                            <CardContent className="p-2 text-center w-full flex flex-col flex-grow border border-gray-500 rounded-xl">
                                <div className="w-full flex-grow max-h-[435px] overflow-y-auto">
                                    <ul className="space-y-2">
                                        {selectedFiles.map((file, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between py-2 px-3 border border-gray-600 rounded-lg bg-background/50"
                                            >
                                                <div className="flex items-center w-11/12 overflow-hidden">
                                                    {getIconForFileType(
                                                        file.name
                                                    )}
                                                    <div className="w-full overflow-hidden text-ellipsis mx-2 text-left">
                                                        {file.name}
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        deleteFile(index)
                                                    }
                                                    className="h-6 w-6 p-1 bg-primary/90 text-black border border-black rounded-lg hover:bg-primary/70 transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                            <div className="w-full px-3 flex items-center justify-end mt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedFiles([])}
                                    className="opacity-80 bg-black font-bold border-primary border-2"
                                >
                                    Clear All Files
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center border border-gray-500 rounded-xl">
                            <p className="text-gray-500">No files selected</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
export default FileList;
