import React from 'react';
import { Key, Sparkles, BookOpen, CheckCircle, GraduationCap } from 'lucide-react';

interface HeroProps {
  onOpenActivate: () => void;
  onExploreCourses: () => void;
  coursesCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenActivate,
  onExploreCourses,
  coursesCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16" id="apex-hero-section">
      {/* Background glowing gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1E7A72]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#7FDCCE]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center px-4">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D2020] border border-[#1E7A72]/40 text-xs font-bold text-[#7FDCCE] mb-6 shadow-sm">
          <GraduationCap className="w-4 h-4 text-[#7FDCCE]" />
          <span>منصة APEX الرسمية للمواد الجامعية وتحديد المستوى</span>
        </div>

        {/* Main headline */}
        <h1 className="font-['Cairo'] font-black text-3xl sm:text-5xl lg:text-6xl text-[#EAF6F4] tracking-tight leading-[1.25] mb-5">
          بوابتك الأكاديمية الأولى <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7FDCCE] via-[#EAF6F4] to-[#1E7A72]">
            للتحضير والتفوق الجامعي
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-[#9FC4BE] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          منصة تعليمية متكاملة لطلاب الجامعات والجامعة الافتراضية السورية (SVU)، توفر دورات تفاعلية،
          بنك أسئلة باختبارات فورية، نظام تفعيل آمن للأكواد، ومساعد ذكي لحل وشرح الأسئلة.
        </p>

        {/* Primary CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-10">
          <button
            onClick={onOpenActivate}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-sm font-bold shadow-lg shadow-[#0E5845]/30 transition-all active:scale-95"
            id="btn-hero-activate"
          >
            <Key className="w-4 h-4" />
            <span>تفعيل كود المادة</span>
          </button>

          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0D2020] hover:bg-[#153F3A] text-[#EAF6F4] border border-[#1E7A72]/50 hover:border-[#7FDCCE] text-sm font-bold transition-all active:scale-95"
            id="btn-hero-browse"
          >
            <BookOpen className="w-4 h-4 text-[#7FDCCE]" />
            <span>تصفح المواد الدراسية</span>
          </button>
        </div>

        {/* Quick Highlights / Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-xs text-[#9FC4BE]">
          <div className="p-3 rounded-xl bg-[#0D2020]/80 border border-[#1E7A72]/20 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#7FDCCE] shrink-0" />
            <span className="text-right font-medium">47 درس تفاعلي متكامل</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D2020]/80 border border-[#1E7A72]/20 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#7FDCCE] shrink-0" />
            <span className="text-right font-medium">كود يعمل لمرة واحدة بأمان</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D2020]/80 border border-[#1E7A72]/20 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#7FDCCE] shrink-0" />
            <span className="text-right font-medium">مساعد Gemini الأكاديمي</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D2020]/80 border border-[#1E7A72]/20 flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-[#7FDCCE] shrink-0" />
            <span className="text-right font-medium">{coursesCount} مواد دراسية متوفرة</span>
          </div>
        </div>
      </div>
    </section>
  );
};
