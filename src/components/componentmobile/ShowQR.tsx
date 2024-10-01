import { UploadCloudIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import QRCode from '../componentdesktop/qrCode';

function ShowQR({
    unique,
    setIsUploaded,
}: {
    unique: string;
    setIsUploaded: any;
}) {
    return (
        <div className="relative w-full flex items-center justify-center">
            <Card
                className={
                    'flex flex-col items-center justify-evenly my-auto mx-4 py-4 px-0 h-auto w-full max-w-[450px] shadow-lg'
                }
            >
                <CardContent className="p-4 pt-0 m-auto text-center">
                    <h1 className="text-4xl font-bold">File Share</h1>
                    <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
                        File uploaded Successfully
                    </p>
                </CardContent>

                <CardContent className="px-4 py-0 flex flex-col flex-grow items-center justify-center w-full h-full">
                    <div className="text-xl text-gray-700 dark:text-gray-200 font-mono text-center">
                        <span className="text-primary">
                            {unique.toUpperCase()}
                        </span>
                    </div>
                    <div className="w-full flex items-center justify-center flex-grow">
                        <QRCode url={`https://fs.sujal.xyz/${unique}`} />
                    </div>
                </CardContent>
                <CardContent className="px-4 py-0 w-full">
                    <Button
                        onClick={() => setIsUploaded(false)}
                        variant="default"
                        className="w-full text-lg py-6"
                    >
                        <UploadCloudIcon
                            className="mr-2"
                            size={24}
                        />
                        Upload
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default ShowQR;
