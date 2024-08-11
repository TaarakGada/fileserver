import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';

function generateUniqueCode() {
    const alphabets = 'abcdefghijkmnopqrstuvwxyz';
    const twoAlphabets = alphabets[Math.floor(Math.random() * 25)] + alphabets[Math.floor(Math.random() * 25)];
    const twoNumbers = Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10);
    return twoAlphabets + twoNumbers;
}

export async function POST(req: NextRequest) {
    let newUnique;
    try {
        const formData = await req.formData();
        const pb = new PocketBase('https://sujal.pockethost.io');

        do {
            newUnique = generateUniqueCode();
        } while (await pb.collection('files').getFirstListItem(`unique="${newUnique}"`).catch(() => null));

        formData.append('unique', newUnique);
        await pb.collection('files').create(formData);
        
        
    } catch (error: any) {
        console.error('Error handling shared content:', error?.message);
        
        // Redirect to home on failure
        return redirect('https://fs.sujal.xyz/');
    } finally {  
        // Redirect to the show-code URL on success
        return redirect("https://fs.sujal.xyz/show-" + newUnique);
    }
}
