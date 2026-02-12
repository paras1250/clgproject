import { useRef, useState } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
    onFilesSelected: (files: FileList | null) => void;
    uploadedFiles: File[];
    onFileRemove: (index: number) => void;
    accept?: string;
    maxSizeMB?: number;
}

export default function FileUploader({
    onFilesSelected,
    uploadedFiles,
    onFileRemove,
    accept = ".pdf,.doc,.docx,.txt",
    maxSizeMB = 10
}: FileUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        onFilesSelected(e.dataTransfer.files);
    };

    return (
        <div className="w-full">
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-[#0A0807] bg-gray-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept={accept}
                    onChange={(e) => onFilesSelected(e.target.files)}
                />

                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <Upload size={24} />
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">Click to upload or drag and drop</h3>
                <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX, TXT (Max {maxSizeMB}MB)</p>

                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                    <span>Target size: &lt; 5MB</span>
                    <span>•</span>
                    <span>We'll clarify heavily scanned docs</span>
                </div>
            </div>

            {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg group">
                            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <FileText size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button
                                onClick={() => onFileRemove(index)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Remove file"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
