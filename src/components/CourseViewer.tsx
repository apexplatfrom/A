import React, { useState, useRef, useEffect } from 'react';
import { Course } from '../types';
import { ArrowRight, Maximize2, Minimize2, RotateCcw, Sparkles, Key, Lock, ShieldCheck } from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  htmlContent?: string;
  isUnlocked: boolean;
  onBack: () => void;
  onOpenActivate: () => void;
  onOpenAiTutorWithContext: (courseTitle: string) => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  htmlContent,
  isUnlocked,
  onBack,
  onOpenActivate,
  onOpenAiTutorWithContext,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleRefresh = () => {
    if (iframeRef.current && htmlContent) {
      iframeRef.current.srcdoc = htmlContent;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-[#060F0F] transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen' : 'min-h-[85vh] rounded-2xl border border-[#1E7A72]/40 overflow-hidden shadow-2xl'
      }`}
      id="apex-course-viewer"
    >
      {/* Viewer Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D2020] border-b border-[#1E7A72]/40 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#EAF6F4] text-xs font-bold transition-all border border-[#1E7A72]/30"
            id="btn-viewer-back"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمنصة</span>
          </button>

          <div>
            <h2 className="font-['Cairo'] font-bold text-sm sm:text-base text-[#EAF6F4] flex items-center gap-2">
              <span>{course.title}</span>
              {isUnlocked && (
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#0E5845] text-[#7FDCCE] border border-[#7FDCCE]/40">
                  <ShieldCheck className="w-3 h-3" />
                  مفعلة
                </span>
              )}
            </h2>
          </div>
        </div>

        {/* Viewer Tools */}
        <div className="flex items-center gap-2">
          {/* Ask AI Tutor */}
          <button
            onClick={() => onOpenAiTutorWithContext(course.title)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] text-xs font-bold transition-all shadow-sm active:scale-95"
            id="btn-viewer-ai-tutor"
            title="سؤال المساعد الذكي عن هذه المادة أو درس محدد"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7FDCCE]" />
            <span className="hidden sm:inline">اسأل المساعد الذكي</span>
          </button>

          {/* Reload iframe */}
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-white transition-all text-xs border border-[#1E7A72]/30"
            title="إعادة تحميل المادة"
            id="btn-viewer-reload"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-white transition-all text-xs border border-[#1E7A72]/30"
            title={isFullscreen ? 'تصغير الشاشة' : 'ملء الشاشة'}
            id="btn-viewer-fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative flex-1 bg-black w-full h-full min-h-[600px] flex items-center justify-center">
        {isUnlocked && htmlContent ? (
          <iframe
            ref={iframeRef}
            srcDoc={htmlContent}
            title={course.title}
            className="w-full h-full border-0 absolute inset-0 bg-white dark:bg-[#060F0F]"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
            id="course-content-iframe"
          />
        ) : (
          /* Locked State Banner */
          <div className="max-w-md mx-auto p-6 text-center bg-[#0D2020] border border-[#1E7A72]/50 rounded-2xl shadow-xl m-4 animate-in fade-in" id="box-course-locked-notice">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/50 border border-amber-800/40 text-amber-300 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="font-['Cairo'] font-bold text-xl text-[#EAF6F4] mb-2">
              هذه المادة مقفلة
            </h3>

            <p className="text-xs sm:text-sm text-[#9FC4BE] leading-relaxed mb-6">
              محتوى مادة <b>{course.title}</b> متاح للطلاب المشتركين فقط عبر كود تفعيل صالح يُستخدم لمرة واحدة.
            </p>

            <button
              onClick={onOpenActivate}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              id="btn-locked-activate"
            >
              <Key className="w-4 h-4" />
              <span>إدخال كود التفعيل لفتح المادة</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
