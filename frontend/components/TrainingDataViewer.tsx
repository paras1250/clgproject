import { useState, useEffect } from 'react';
import { botsAPI } from '@/lib/api';

interface TrainingDataItem {
  id: number;
  type: string;
  filename: string;
  contentLength: number;
  chunksCount: number;
  content: string;
  fullContent: string;
  processedAt: string | null;
}

interface TrainingData {
  textTraining: TrainingDataItem[];
  documents: TrainingDataItem[];
  totalItems: number;
  totalContentLength: number;
}

interface TrainingDataViewerProps {
  botId: string;
}

export default function TrainingDataViewer({ botId }: TrainingDataViewerProps) {
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrainingData();
  }, [botId]);

  const loadTrainingData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await botsAPI.getTrainingData(botId);
      setTrainingData(response.trainingData);
    } catch (err: any) {
      setError(err.message || 'Failed to load training data');
      console.error('Error loading training data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading training data: {error}</p>
        <button
          onClick={loadTrainingData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!trainingData || trainingData.totalItems === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ No training data found. Please add training text or upload documents.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Training Data</h3>
        <button
          onClick={loadTrainingData}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Items</div>
          <div className="text-2xl font-bold text-blue-600">{trainingData.totalItems}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Content</div>
          <div className="text-2xl font-bold text-green-600">
            {formatBytes(trainingData.totalContentLength)}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Text Items</div>
          <div className="text-2xl font-bold text-purple-600">
            {trainingData.textTraining.length}
          </div>
        </div>
      </div>

      {/* Text Training Data */}
      {trainingData.textTraining.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            📝 Training Text ({trainingData.textTraining.length})
          </h4>
          <div className="space-y-3">
            {trainingData.textTraining.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Text Training #{item.id + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatBytes(item.contentLength)} • {item.chunksCount} chunks
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="text-xs font-semibold text-gray-500 mb-1">📄 Extracted Text:</div>
                      {expandedItems.has(item.id) ? (
                        <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border max-h-96 overflow-y-auto font-mono text-xs">
                          {item.fullContent || item.content || 'No content extracted'}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded border">
                          <span className="font-mono text-xs">{item.content || 'No content extracted'}</span>
                          {item.contentLength > 500 && (
                            <span className="text-blue-600 ml-2">...</span>
                          )}
                        </div>
                      )}
                    </div>
                    {item.processedAt && (
                      <div className="text-xs text-gray-400">
                        Processed: {formatDate(item.processedAt)}
                      </div>
                    )}
                  </div>
                  {item.contentLength > 500 && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedItems.has(item.id) ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Documents */}
      {trainingData.documents.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            📄 Uploaded Documents ({trainingData.documents.length})
          </h4>
          <div className="space-y-3">
            {trainingData.documents.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        📎 {item.filename}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatBytes(item.contentLength)} • {item.chunksCount} chunks
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <div className="text-xs font-semibold text-gray-500 mb-1">📄 Extracted Text:</div>
                      {expandedItems.has(item.id) ? (
                        <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border max-h-96 overflow-y-auto font-mono text-xs">
                          {item.fullContent || item.content || 'No content extracted'}
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-3 rounded border">
                          <span className="font-mono text-xs">{item.content || 'No content extracted'}</span>
                          {item.contentLength > 500 && (
                            <span className="text-blue-600 ml-2">...</span>
                          )}
                        </div>
                      )}
                    </div>
                    {item.processedAt && (
                      <div className="text-xs text-gray-400">
                        Processed: {formatDate(item.processedAt)}
                      </div>
                    )}
                  </div>
                  {item.contentLength > 500 && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {expandedItems.has(item.id) ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

