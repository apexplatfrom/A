import React, { useState } from 'react';
import { Key, X, CheckCircle, AlertCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface CodeActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (courseId: string, courseTitle: string, unlockToken: string) => void;
}

export const CodeActivationModal: React.FC<CodeActivationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    courseId: string;
    courseTitle: string;
    unlockToken: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleActivate = async (codeToUse?: string) => {
    const codeVal = (codeToUse || inputCode).trim().toUpperCase();
    if (!codeVal) {
      setErrorMsg('يرجى كتابة أو لصق كود التفعيل أولاً');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessInfo(null);

    try {
      const res = await fetch('/api/codes/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeVal }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'فشل تفعيل الكود');
        return;
      }

      setSuccessInfo({
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        unlockToken: data.unlockToken,
      });

      onSuccess(data.courseId, data.courseTitle, data.unlockToken);
    } catch (err: any) {
      setErrorMsg('حدث خطأ في الاتصال بالخادم. يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      id="modal-code-activation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#0D2020] border border-[#1E7A72]/50 rounded-2xl shadow-2xl p-6 sm:p-7 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="modal-activation-card"
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7FDCCE]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-[#060F0F] text-[#9FC4BE] hover:text-white hover:bg-[#153F3A] transition-colors"
          id="btn-close-activation-modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0E5845] to-[#1E7A72] flex items-center justify-center text-[#7FDCCE] shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Cairo'] font-bold text-lg text-[#EAF6F4]">
              تفعيل كود المادة الدراسية
            </h3>
            <p className="text-xs text-[#9FC4BE]">
              أدخل الرمز الذي استلمته بعد إتمام الدفع
            </p>
          </div>
        </div>

        {/* Success State */}
        {successInfo ? (
          <div className="p-4 rounded-xl bg-[#0E5845]/30 border border-[#7FDCCE]/40 text-center mb-4 animate-in zoom-in-95 duration-200">
            <CheckCircle className="w-10 h-10 text-[#7FDCCE] mx-auto mb-2" />
            <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1">
              تم التفعيل بنجاح!
            </h4>
            <p className="text-xs text-[#9FC4BE] mb-3">
              تم فتح مادة <b className="text-[#7FDCCE]">{successInfo.courseTitle}</b> لجهازك بالكامل.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1E7A72] to-[#7FDCCE] text-[#060F0F] font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              id="btn-goto-unlocked-course"
            >
              <span>الدخول للمادة الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Input form */}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-[#EAF6F4] mb-1.5">
                  كود التفعيل (رمز التحقق):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value.toUpperCase());
                      setErrorMsg(null);
                    }}
                    placeholder="مثال: APEX-SVU-2026"
                    className="w-full px-4 py-3 bg-[#060F0F] border border-[#1E7A72]/40 focus:border-[#7FDCCE] rounded-xl text-[#EAF6F4] font-mono text-sm tracking-wider placeholder-[#9FC4BE]/40 outline-none transition-all text-center"
                    dir="ltr"
                    id="input-activation-code"
                    autoFocus
                  />
                  <Key className="absolute right-3.5 top-3.5 w-4 h-4 text-[#9FC4BE]/60" />
                </div>
              </div>

              {/* Error Notification */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2 leading-relaxed animate-in fade-in" id="box-activation-error">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={() => handleActivate()}
                disabled={loading || !inputCode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
                id="btn-submit-activate"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق الذري من الخادم...</span>
                  </>
                ) : (
                  <>
                    <span>تأكيد وتفعيل الكود</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick test codes for evaluation */}
            <div className="pt-3 border-t border-[#1E7A72]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#9FC4BE] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#7FDCCE]" />
                  أكواد تجريبية سريعة للفحص:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('APEX-SVU-2026');
                    handleActivate('APEX-SVU-2026');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#060F0F] hover:bg-[#153F3A] border border-[#1E7A72]/40 text-[11px] font-mono text-[#7FDCCE] transition-colors"
                  id="btn-sample-code-valid"
                  title="كود صالح لمادة تحديد المستوى الإنجليزي"
                >
                  APEX-SVU-2026 (صالح)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('APEX-TEST-USED');
                    handleActivate('APEX-TEST-USED');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#060F0F] hover:bg-red-950/40 border border-red-900/40 text-[11px] font-mono text-red-300 transition-colors"
                  id="btn-sample-code-used"
                  title="كود مستخدم مسبقاً لاختبار رسالة الرفض"
                >
                  APEX-TEST-USED (مستخدم مسبقاً)
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
