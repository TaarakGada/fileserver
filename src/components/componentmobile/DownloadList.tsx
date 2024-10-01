import React from 'react';
import {
    FileArchive,
    FileAudio,
    FileCode,
    FileIcon,
    FileSpreadsheet,
    FileText,
    FileVideo,
    Sliders,
    Download,
    Image,
} from 'lucide-react';
import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import saveAs from 'file-saver';

interface FileListProps {
    fileLinks: string[];
    collectionID: string;
    magicWord: string;
}

const DownloadList: React.FC<FileListProps> = ({
    fileLinks,
    collectionID,
    magicWord,
}) => {
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

    return (
        <div className="bg-card flex flex-col w-full h-full max-h-[calc(100vh-350px)] min-h-[calc(100vh-300px)]">
            {fileLinks.length > 0 && (
                <>
                    <CardContent className="flex-grow overflow-hidden border border-gray-500 rounded-xl p-2">
                        <div className="h-full overflow-y-auto">
                            <ul className="space-y-2">
                                {fileLinks.map((link) => {
                                    const fileName = link
                                        ? link.split('_')[0] +
                                          (link.includes('.')
                                              ? '.' + link.split('.')[1]
                                              : '')
                                        : '';
                                    return (
                                        <li
                                            key={link}
                                            className="flex items-center justify-between py-2 px-3 border border-gray-600 rounded-lg bg-background/50"
                                        >
                                            <div className="flex items-center w-11/12 overflow-hidden">
                                                {getIconForFileType(fileName)}
                                                <div className="w-full overflow-hidden text-ellipsis mx-2 text-left">
                                                    {fileName}
                                                </div>
                                            </div>
                                            <a
                                                href={`https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-6 w-6 p-1 bg-primary/90 text-black border border-black rounded-lg hover:bg-primary/70 transition-colors flex items-center justify-center"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </CardContent>
                </>
            )}
        </div>
    );
};

export default DownloadList;
