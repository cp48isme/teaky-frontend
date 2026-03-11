import { useState, useRef, useEffect, useCallback } from 'react';
import { usePreview, type ViewportSize } from '../../context/PreviewContext';

interface Props {
  leftContent: React.ReactNode;
  previewUrl: string;
  onRefresh?: () => void; // Optional callback for auto-refresh
}

const VIEWPORT_WIDTHS: Record<ViewportSize, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
};

export default function SplitScreenLayout({ leftContent, previewUrl, onRefresh }: Props) {
  const { splitMode, splitRatio, viewportSize, setSplitMode, setSplitRatio, setViewportSize, toggleSplitMode, refreshTrigger } = usePreview();
  const [isResizing, setIsResizing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mobile detection (< 1024px)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Refresh iframe
  const refreshPreview = useCallback(() => {
    if (iframeRef.current) {
      // Try direct reload first
      try {
        iframeRef.current.contentWindow?.location.reload();
      } catch {
        // Fallback: cache-bust
        const url = new URL(previewUrl, window.location.origin);
        url.searchParams.set('t', Date.now().toString());
        iframeRef.current.src = url.toString();
      }
    }
    onRefresh?.();
  }, [previewUrl, onRefresh]);

  // Keyboard shortcut: Alt+P to toggle preview
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        toggleSplitMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSplitMode]);

  // Auto-refresh when refreshTrigger changes (debounced from PreviewContext)
  useEffect(() => {
    if (refreshTrigger > 0 && splitMode) {
      refreshPreview();
    }
  }, [refreshTrigger, splitMode, refreshPreview]);

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startRatio = splitRatio;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const containerWidth = containerRef.current.offsetWidth;
      const deltaRatio = (deltaX / containerWidth) * 100;
      const newRatio = Math.max(30, Math.min(70, startRatio + deltaRatio));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [splitRatio]);

  // Mobile: hide split screen entirely
  if (isMobile) {
    return (
      <div className="w-full">
        {leftContent}

        {/* Mobile: "View Live Store" button only */}
        <div className="fixed bottom-4 right-4 z-50">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-teak px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-teak-dark"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Live Store
          </a>
        </div>
      </div>
    );
  }

  // Desktop: split mode toggle
  if (!splitMode) {
    return (
      <div className="w-full">
        {/* Preview toggle button */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setSplitMode(true)}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Enable live preview (Alt+P)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Enable Preview
          </button>
        </div>
        {leftContent}
      </div>
    );
  }

  // Desktop: split screen mode
  return (
    <div ref={containerRef} className="flex h-full gap-0">
      {/* Left panel: Admin content */}
      <div
        className="overflow-y-auto"
        style={{ width: `${splitRatio}%` }}
      >
        {/* Close button */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={refreshPreview}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Refresh preview"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Preview
          </button>
          <button
            onClick={() => setSplitMode(false)}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            title="Close preview (Alt+P)"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close Preview
          </button>
        </div>
        {leftContent}
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`w-1 cursor-col-resize bg-gray-300 hover:bg-teak transition-colors ${
          isResizing ? 'bg-teak' : ''
        }`}
        title="Drag to resize"
      />

      {/* Right panel: Preview iframe */}
      <div
        className="flex flex-col bg-gray-100"
        style={{ width: `${100 - splitRatio}%` }}
      >
        {/* Preview toolbar */}
        <div className="sticky top-0 border-b border-gray-300 bg-white px-3 py-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">Live Preview</p>

            {/* Viewport Switcher */}
            <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-gray-50 p-0.5">
              {(['desktop', 'tablet', 'mobile'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setViewportSize(size)}
                  className={`rounded px-2 py-1 text-xs font-medium transition ${
                    viewportSize === size
                      ? 'bg-white text-teak shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={`${size.charAt(0).toUpperCase() + size.slice(1)} (${VIEWPORT_WIDTHS[size]}px)`}
                >
                  {size === 'desktop' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {size === 'tablet' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                  {size === 'mobile' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Iframe container with viewport sizing */}
        <div className="flex flex-1 items-start justify-center overflow-auto bg-gray-200 p-4">
          <div
            className="bg-white shadow-lg transition-all duration-300"
            style={{
              width: viewportSize === 'desktop' ? '100%' : `${VIEWPORT_WIDTHS[viewportSize]}px`,
              maxWidth: '100%',
              height: '100%',
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="h-full w-full border-0"
              title="Portal Preview"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
