import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, Image, Send, Upload, X, Loader2, Camera, Bot, User, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCourseContext?: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  activeCourseContext,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `أهلاً بك! أنا مدربك ومساعدك الأكاديمي الذكي لمنصة APEX. 
يمكنني مساعدتك في:
• شرح أي قاعدة نحوية أو زمن باللغة الإنجليزية (Grammar & Tenses).
• توضيح أسرار وأفخاخ امتحان تحديد المستوى (SVU Placement Test).
• حل الأسئلة الصعبة وتوضيح سبب اختيار الإجابة.
• تحليل صور أسئلة الامتحانات أو الملاحظات المصورة.

عن ماذا تود أن تسأل اليوم؟`,
      timestamp: Date.now(),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Image Analysis State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('قم بحل وشرح السؤال الموجود في هذه الصورة بدقة خطوة بخطوة مع توضيح القاعدة والأفخاخ.');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  if (!isOpen) return null;

  // Send Chat Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-8),
          currentCourseTitle: activeCourseContext,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || data.error || 'عذراً، لم أتمكن من الرد في هذه اللحظة.';

      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'تعذر الاتصال بالخادم. يرجى التأكد من اتصال الإنترنت أو إعداد مفتاح GEMINI_API_KEY.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageError(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Analyze Image
  const handleAnalyzeImage = async () => {
    if (!imagePreview) {
      setImageError('يرجى اختيار صورة أولاً');
      return;
    }

    setImageLoading(true);
    setImageError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/gemini/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          mimeType: imageFile?.type || 'image/jpeg',
          prompt: imagePrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setImageError(data.error || 'حدث خطأ أثناء تحليل الصورة');
      } else {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      setImageError('فشل الاتصال بخدمة التحليل الذكي');
    } finally {
      setImageLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        role: 'assistant',
        content: 'بدأنا محادثة جديدة! تفضل بطرح أي سؤال يتعلق بمادتك أو امتحان تحديد المستوى.',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      id="modal-ai-tutor"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[#0D2020] border border-[#1E7A72]/50 rounded-2xl shadow-2xl flex flex-col h-[90vh] max-h-[750px] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="modal-ai-tutor-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E7A72]/30 bg-[#060F0F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E5845] to-[#7FDCCE] flex items-center justify-center text-[#060F0F] shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Cairo'] font-bold text-base text-[#EAF6F4]">
                  المساعد الأكاديمي الذكي — APEX AI
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E7A72]/40 text-[#7FDCCE] border border-[#1E7A72]">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-[#9FC4BE]">
                {activeCourseContext ? `في سياق: ${activeCourseContext}` : 'مساعدك الشخصي للأسئلة والامتحانات'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'chat' && (
              <button
                onClick={clearChat}
                className="p-2 rounded-xl bg-[#0D2020] hover:bg-red-950/40 text-[#9FC4BE] hover:text-red-300 transition-colors"
                title="تفريغ المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#0D2020] text-[#9FC4BE] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#1E7A72]/30 bg-[#0D2020] px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-[#7FDCCE] text-[#7FDCCE]'
                : 'border-transparent text-[#9FC4BE] hover:text-white'
            }`}
            id="tab-ai-chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span>المحادثة والاستفسارات</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'image'
                ? 'border-[#7FDCCE] text-[#7FDCCE]'
                : 'border-transparent text-[#9FC4BE] hover:text-white'
            }`}
            id="tab-ai-image"
          >
            <Camera className="w-4 h-4" />
            <span>تحليل صور الأسئلة والمسائل</span>
          </button>
        </div>

        {/* TAB 1: CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#060F0F]">
            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4" id="chat-messages-thread">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                    m.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      m.role === 'user'
                        ? 'bg-[#1E7A72] text-white'
                        : 'bg-gradient-to-br from-[#0E5845] to-[#7FDCCE] text-[#060F0F]'
                    }`}
                  >
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#1E7A72] text-[#EAF6F4] rounded-tr-none'
                        : 'bg-[#0D2020] text-[#EAF6F4] border border-[#1E7A72]/30 rounded-tl-none shadow-md'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 max-w-[75%] ml-auto">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E5845] to-[#7FDCCE] text-[#060F0F] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#0D2020] border border-[#1E7A72]/30 text-xs text-[#7FDCCE] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>المساعد الذكي يكتب الإجابة...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 bg-[#0D2020]/70 border-t border-[#1E7A72]/20 flex flex-wrap gap-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => handleSendMessage('اشرح لي قاعدة Since و For مع أمثلة وسر حلها في الامتحان')}
                className="px-2.5 py-1 rounded-full bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#7FDCCE] border border-[#1E7A72]/30 shrink-0"
              >
                قاعدة Since & For
              </button>
              <button
                onClick={() => handleSendMessage('كيف أميز بين الجمل الشرطية الثلاثة (Conditionals 1, 2, 3)؟')}
                className="px-2.5 py-1 rounded-full bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#7FDCCE] border border-[#1E7A72]/30 shrink-0"
              >
                الجمل الشرطية (If)
              </button>
              <button
                onClick={() => handleSendMessage('ما هي الأسماء غير المعدودة الأكثر تكراراً في الامتحانات؟')}
                className="px-2.5 py-1 rounded-full bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#7FDCCE] border border-[#1E7A72]/30 shrink-0"
              >
                الأسماء غير المعدودة
              </button>
            </div>

            {/* Chat Input */}
            <div className="p-3 sm:p-4 bg-[#0D2020] border-t border-[#1E7A72]/30">
              <div className="flex items-center gap-2 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl px-3 py-1.5 focus-within:border-[#7FDCCE]">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="اكتب سؤالك الأكاديمي هنا..."
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#EAF6F4] placeholder-[#9FC4BE]/50 outline-none py-2"
                  id="input-ai-chat-text"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMsg.trim() || chatLoading}
                  className="p-2 rounded-lg bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-white disabled:opacity-40 hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] transition-all"
                  id="btn-ai-chat-send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMAGE ANALYSIS */}
        {activeTab === 'image' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#060F0F] space-y-5">
            <div className="text-center max-w-lg mx-auto">
              <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1">
                تحليل صور الأسئلة والمسائل عبر Gemini
              </h4>
              <p className="text-xs text-[#9FC4BE]">
                ارفع صورة لسؤال من امتحان أو كتاب ليقوم المساعد بحله وشرح الخطوات والقواعد المستفادة.
              </p>
            </div>

            {/* Upload Box */}
            <div className="border-2 border-dashed border-[#1E7A72]/50 hover:border-[#7FDCCE] rounded-2xl p-5 text-center bg-[#0D2020]/60 transition-all">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Uploaded question"
                    className="max-h-60 mx-auto rounded-xl object-contain border border-[#1E7A72]/40"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#060F0F] hover:bg-[#153F3A] text-xs font-bold text-[#7FDCCE] border border-[#1E7A72]/40 transition-colors">
                      <span>تغيير الصورة</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                        setAnalysisResult(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 text-xs font-bold border border-red-900/40"
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-3 py-6" id="label-upload-image">
                  <div className="w-14 h-14 rounded-2xl bg-[#060F0F] text-[#7FDCCE] border border-[#1E7A72]/40 flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#EAF6F4] block">
                      اضغط لاختيار صورة السؤال أو اسحبها هنا
                    </span>
                    <span className="text-[11px] text-[#9FC4BE]">
                      يدعم صور JPG, PNG, WEBP من الهاتف أو الكمبيوتر
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="input-ai-image-file"
                  />
                </label>
              )}
            </div>

            {/* Prompt input */}
            <div>
              <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                توجيه المساعد (أو سؤالك المحدد حول الصورة):
              </label>
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0D2020] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none focus:border-[#7FDCCE]"
                placeholder="مثال: حل السؤال رقم 3 واشرح لي لماذا تم اختيار C"
                id="input-image-prompt"
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeImage}
              disabled={!imagePreview || imageLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
              id="btn-start-image-analysis"
            >
              {imageLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تحليل السؤال والحل عبر Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تحليل واستخراج الحل الآن</span>
                </>
              )}
            </button>

            {/* Error */}
            {imageError && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200">
                {imageError}
              </div>
            )}

            {/* Analysis Result */}
            {analysisResult && (
              <div className="bg-[#0D2020] border border-[#7FDCCE]/40 rounded-2xl p-5 space-y-3 animate-in fade-in" id="box-image-analysis-result">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7FDCCE] pb-2 border-b border-[#1E7A72]/20">
                  <Sparkles className="w-4 h-4" />
                  <span>نتيجة التحليل والشرح الأكاديمي:</span>
                </div>
                <div className="text-xs sm:text-sm text-[#EAF6F4] leading-relaxed whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
