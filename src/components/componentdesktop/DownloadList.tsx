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
import { Card, CardHeader, CardContent } from '../ui/card';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import saveAs from 'file-saver';

interface FileListProps {
    fileLinks: string[];
    collectionID: string;
    magicWord: string;
}

const FileList: React.FC<FileListProps> = ({
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

    const handleDownloadAll = async () => {
        const zip = new JSZip();
        const folder = zip.folder(magicWord);

        if (!folder) {
            toast.error("Couldn't create folder");
            return;
        }

        const fileNameCount: { [key: string]: number } = {};

        try {
            for (const link of fileLinks) {
                let fileName = link
                    ? link.split('_')[0] +
                      (link.includes('.') ? '.' + link.split('.')[1] : '')
                    : '';

                if (fileName in fileNameCount) {
                    fileNameCount[fileName] += 1;
                    const [name, extension] = fileName.split('.');
                    fileName = `${name}(${fileNameCount[fileName]})${
                        extension ? '.' + extension : ''
                    }`;
                } else {
                    fileNameCount[fileName] = 0;
                }

                const response = await fetch(
                    `https://sujal.pockethost.io/api/files/files/${collectionID}/${link}`
                );
                const blob = await response.blob();
                folder.file(fileName, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${magicWord}_files.zip`);
            toast.success('All files downloaded successfully');
        } catch (error) {
            console.error('Error downloading files:', error);
            toast.error('Error downloading files');
        }
    };

    return (
        <div className="h-[600px] m-auto w-4/5">
            <Card className="h-full w-full flex flex-col m-auto p-4">
                <CardHeader className="p-0">
                    <h2 className="text-4xl font-semibold text-white">
                        Fetched Files
                    </h2>
                </CardHeader>
                <div className="flex flex-col flex-grow mt-4">
                    {fileLinks.length > 0 ? (
                        <>
                            <CardContent className="p-2 text-center w-full flex flex-col flex-grow border border-gray-500 rounded-xl">
                                <div className="w-full flex-grow max-h-[435px] overflow-y-auto">
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
                                                        {getIconForFileType(
                                                            fileName
                                                        )}
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
                            <div className="w-full flex items-center justify-end mt-4">
                                <Button
                                    onClick={handleDownloadAll}
                                    className="bg-primary text-black font-semibold py-2 px-4 rounded transition-colors"
                                >
                                    <Download className="mr-2 h-4 w-4" />{' '}
                                    Download All Files
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center border border-gray-500 rounded-xl">
                            <p className="text-gray-500">No files fetched</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default FileList;
