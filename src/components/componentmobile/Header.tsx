import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

function Header() {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showInstallPrompt, setShowInstallPrompt] = useState(true);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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
    return (
        <div className="px-4 flex items-center justify-between w-full bg-card">
            <div className="w-full text-left font-semibold text-4xl bg-card py-4">
                File Server
            </div>
            <div>
                {showInstallPrompt && (
                    <button
                        onClick={handleInstall}
                        className="h-12 text-lg font-semibold rounded-lg flex items-center justify-center text-black bg-primary p-4"
                    >
                        <Download className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
