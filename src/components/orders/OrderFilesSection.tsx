import { useState, useEffect, useCallback, useRef } from 'react';
import { listOrderFiles, uploadOrderFile, deleteOrderFile } from '../../api/orderFiles';
import type { OrderFile } from '../../api/orderFiles';
import Spinner from '../ui/Spinner';

interface Props {
  orderId: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OrderFilesSection({ orderId }: Props) {
  const [files, setFiles] = useState<OrderFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    try {
      const data = await listOrderFiles(orderId);
      setFiles(data);
    } catch {
      // Silently handle - files section is supplementary
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(fileList)) {
        await uploadOrderFile(orderId, file);
      }
      await fetchFiles();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteOrderFile(orderId, fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="rounded-lg border bg-white p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Files</h3>

      {/* File List */}
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <Spinner className="h-5 w-5 text-teak-dark" />
        </div>
      ) : files.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between py-2">
              <div className="min-w-0 flex-1">
                <a
                  href={file.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-teak-dark hover:text-teak truncate block"
                >
                  {file.filename}
                </a>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.file_size_bytes)}
                  {file.file_category && (
                    <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                      {file.file_category}
                    </span>
                  )}
                  <span className="ml-2">
                    {new Date(file.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDelete(file.id)}
                className="ml-3 shrink-0 rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No files attached.</p>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragOver
            ? 'border-teak bg-teak/10'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Spinner className="h-4 w-4 text-teak-dark" /> Uploading...
          </div>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">
              Drop files here or click to upload
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PDF, images, or any relevant order files
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>
    </div>
  );
}
