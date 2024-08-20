"use server";
const fileFacts: string[] = [
    "The first file systems were introduced in the 1960s with the advent of digital computers.",
    "The term 'file' comes from the Latin word 'filum', meaning 'thread', as early files were stored on thread-like paper tapes.",
    "The FAT (File Allocation Table) file system, introduced by Microsoft in 1977, was one of the first widely used file systems.",
    "In Unix-based systems, files are treated as streams of bytes, and everything is considered a file, including devices and processes.",
    "The NTFS (New Technology File System) introduced by Microsoft in 1993 supports large files, file compression, and encryption.",
    "The most common file extension in the world is '.txt', used for plain text files.",
    "The maximum file size for FAT32 file system is 4 GB.",
    "In computing, a 'file' is a digital container for data that is stored on a physical or virtual storage medium.",
    "The concept of file permissions in Unix-like operating systems allows users to set read, write, and execute permissions for files and directories.",
    "The MIME type 'application/octet-stream' is used to denote binary files whose exact type is unknown.",
    "File systems manage how data is stored and retrieved, ensuring that files are organized and accessible on a storage device.",
    "File fragmentation can occur when files are split into pieces and scattered across a storage device, which can slow down access times.",
    "The 'root' directory is the top-level directory in a file system hierarchy, from which all other directories branch out.",
    "With the introduction of cloud storage services, files can now be stored and accessed over the internet, allowing for remote data management.",
    "In programming, a file descriptor is an integer handle used to access an open file or other input/output resources.",
    "FTP (File Transfer Protocol) was developed in the early 1970s for transferring files between systems over a network.",
    "The FTP protocol uses port 21 by default for control commands and port 20 for data transfer.",
    "SFTP (Secure File Transfer Protocol) is a secure version of FTP that uses SSH (Secure Shell) to encrypt the transfer of files.",
    "Cloud storage services like Dropbox, Google Drive, and OneDrive allow users to store and share files in a cloud environment.",
    "The concept of 'cloud storage' refers to the practice of storing digital files on remote servers accessible via the internet.",
    "File extensions are suffixes added to filenames, typically consisting of three or four characters, indicating the file type (e.g., '.jpg', '.pdf').",
    "Common file extensions include '.docx' for Microsoft Word documents, '.xlsx' for Excel spreadsheets, and '.html' for HTML files.",
    "Some file systems, like ext4, support journaling, which helps recover data in case of a system crash or power failure.",
    "In the early days of computing, files were often stored on magnetic tapes, which could only be accessed sequentially.",
    "Network-attached storage (NAS) devices are specialized hardware that connects to a network to provide file storage and sharing services.",
    "Distributed file systems, such as Hadoop HDFS, store files across multiple machines to improve performance and reliability.",
    "The 'last modified' timestamp of a file indicates the most recent date and time the file was changed.",
    "File compression formats, such as '.zip' and '.rar', are used to reduce the size of files for storage or transmission.",
    "Version control systems like Git track changes to files over time, allowing users to revert to previous versions and collaborate on code.",
    "In Unix-like systems, the 'ls' command is used to list the files and directories in a specified directory.",
    "File integrity checksums, such as MD5 or SHA-256, are used to verify the integrity of files and detect corruption or tampering.",
    "The 'hidden' attribute can be set on files or directories to prevent them from being displayed in file explorers by default.",
    "In a file system hierarchy, symbolic links (symlinks) are special files that point to other files or directories, allowing for flexible file management.",
    "The 'disk quota' feature limits the amount of disk space a user or group can consume on a file system, helping to manage storage resources.",
    "The file system of a USB flash drive is often formatted with FAT32 or exFAT to ensure compatibility across different operating systems."
];

// Function to get a random file-related fact
export async function getRandomFileFact(): Promise<string> {
    const randomIndex = Math.floor(Math.random() * fileFacts.length);
    return fileFacts[randomIndex];
}

