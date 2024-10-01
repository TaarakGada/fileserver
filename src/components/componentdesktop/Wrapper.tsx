'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { DownloadIcon, HelpCircle, Share, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Wrapper({ children }: { children: React.ReactNode }) {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showInstallPrompt, setShowInstallPrompt] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallPrompt(true);
        };
        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallPrompt
        );
        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt
            );
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallPrompt(false);
            }
            setDeferredPrompt(null);
        }
    };

    const commonLinkClasses =
        'h-12 text-lg font-semibold rounded-lg flex items-center justify-center m-2';

    return (
        <>
            <div
                className={clsx(
                    showInstructions ? 'blur-sm' : '',
                    'flex justify-evenly items-center w-full bg-card'
                )}
            >
                <div className="flex justify-start w-1/3">
                    <img
                        src="/icons/IconText.png"
                        alt="Icon"
                        className="w-[50px] h-[50px] mx-2"
                    />
                </div>
                <div className="flex justify-end w-2/3 items-center">
                    <Link
                        href="/"
                        passHref
                        className={clsx(
                            commonLinkClasses,
                            pathname === '/'
                                ? 'text-black bg-primary px-4'
                                : 'text-white hover:text-primary hover:bg-gray-100/10 px-4'
                        )}
                    >
                        Upload
                    </Link>
                    <Link
                        href="/get"
                        passHref
                        className={clsx(
                            commonLinkClasses,
                            pathname === '/get'
                                ? 'text-black bg-primary px-4'
                                : 'text-white hover:text-primary hover:bg-gray-100/10 px-4'
                        )}
                    >
                        Get
                    </Link>
                    {showInstallPrompt && (
                        <Button
                            onClick={handleInstall}
                            className="mx-2 md:hidden h-12 text-lg font-semibold rounded-lg"
                        >
                            <DownloadIcon className="mr-2" /> Install App
                        </Button>
                    )}
                    <Button
                        onClick={() => setShowInstructions(true)}
                        className="m-2 px-4 h-12 text-lg font-semibold rounded-lg"
                    >
                        <HelpCircle className="mr-2" /> Help
                    </Button>
                </div>
            </div>
            <div
                className={clsx(
                    showInstructions ? 'blur-sm' : '',
                    'flex flex-grow overflow-auto'
                )}
            >
                {children}
            </div>
            {showInstructions && (
                <div className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-50">
                    <div className="instructions-overlay bg-black p-4 rounded-lg border border-solid border-white/50 text-card-foreground shadow-sm m-2">
                        <div className="flex justify-between items-center w-full mb-1">
                            <h1 className="font-semibold text-gray-200 text-lg text-center">
                                <Share className="inline-block mr-2 mb-1" /> How
                                to use File Share
                            </h1>
                            <Button
                                onClick={() => setShowInstructions(false)}
                                className="p-2 h-12 text-lg font-semibold rounded-lg"
                            >
                                <X />
                            </Button>
                        </div>
                        <ul className="list-disc space-y-1 list-inside my-2 text-sm text-gray-500 dark:text-gray-400">
                            <li>
                                Click the "Choose File" button to select one or
                                more files for upload.
                            </li>
                            <li>
                                Click the "Upload" button to upload the selected
                                files to the temporary server.
                            </li>
                            <li>
                                After uploading, you will be provided with a
                                shareable code.
                            </li>
                            <li>
                                Use the code to retrieve your documents later.
                            </li>
                        </ul>
                        <p className="text-center text-gray-500 text-sm mt-4">
                            Files will be deleted 24 hrs after upload.
                            <br />
                            <a
                                href="https://www.sujal.xyz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-1 text-gray-400 hover:text-white"
                            >
                                Sujal Choudhari
                            </a>
                            {' | '}
                            <a
                                href="https://github.com/TaarakGada"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-1 text-gray-400 hover:text-white"
                            >
                                Taarak Gada
                            </a>
                            .
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Wrapper;
