'use client';
import { Upload } from '@/components/component/Upload';

export default function Home() {
   

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-4">
            <Upload />
            <p className=" text-center text-gray-500 text-sm mt-4">
                The files will be deleted after 1 to 2 hrs of uploading. <br />{' '}
                There can be only 50 file ports active at a moment. <br /> Made
                by{' '}
                <a
                    href="https://www.sujal.xyz/"
                    target="_blank"
                    className=" underline underline-offset-1 text-gray-400 hover:text-white"
                >
                    Sujal Choudhari
                </a>
                . Updated by{' '}
                <a
                    href="https://github.com/TaarakGada"
                    target="_blank"
                    className=" underline underline-offset-1 text-gray-400 hover:text-white"
                >
                    Taarak Gada
                </a>
                .
            </p>
        </main>
    );
}
