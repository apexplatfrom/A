import React from 'react';
import { MessageCircle, Send, Phone, CreditCard, ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';

interface HowToBuyProps {
  onOpenActivate: () => void;
}

export const HowToBuy: React.FC<HowToBuyProps> = ({ onOpenActivate }) => {
  return (
    <section className="py-12 border-t border-[#1E7A72]/20" id="apex-how-to-buy-section">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1E7A72]/20 text-[#7FDCCE] border border-[#1E7A72]/30 mb-3 inline-block">
            طريقة الاشتراك
          </span>
          <h2 className="font-['Cairo'] font-bold text-2xl sm:text-3xl text-[#EAF6F4] mb-3">
            آلية شراء المواد واستلام كود التفعيل
          </h2>
          <p className="text-xs sm:text-sm text-[#9FC4BE] max-w-xl mx-auto leading-relaxed">
            يتم الدفع يدوياً عبر التواصل مع إدارة المنصة، وتحصل على كود تفعيل فوري وخاص بك لفتح المادة على جهازك.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#0D2020] border border-[#1E7A72]/30 rounded-2xl p-5 relative overflow-hidden" id="step-1-card">
            <div className="w-9 h-9 rounded-xl bg-[#0E5845] text-[#7FDCCE] flex items-center justify-center font-bold font-['Cairo'] text-base mb-3">
              1
            </div>
            <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1.5">
              تواصل مع الإدارة
            </h4>
            <p className="text-xs text-[#9FC4BE] leading-relaxed">
              اختر المادة المطلوبة وتواصل معنا عبر واتساب أو تليغرام لتأكيد تفاصيل الدورة وقيمتها.
            </p>
          </div>

          <div className="bg-[#0D2020] border border-[#1E7A72]/30 rounded-2xl p-5 relative overflow-hidden" id="step-2-card">
            <div className="w-9 h-9 rounded-xl bg-[#1E7A72] text-white flex items-center justify-center font-bold font-['Cairo'] text-base mb-3">
              2
            </div>
            <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1.5">
              إتمام الدفع الآمن
            </h4>
            <p className="text-xs text-[#9FC4BE] leading-relaxed">
              يتم تحويل المبلغ المالي بالطريقة الأنسب لك (سيريتل كاش، إم تي إن كاش، أو تحويل بنكي).
            </p>
          </div>

          <div className="bg-[#0D2020] border border-[#1E7A72]/30 rounded-2xl p-5 relative overflow-hidden" id="step-3-card">
            <div className="w-9 h-9 rounded-xl bg-[#7FDCCE] text-[#060F0F] flex items-center justify-center font-bold font-['Cairo'] text-base mb-3">
              3
            </div>
            <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1.5">
              استلام الكود والتفعيل
            </h4>
            <p className="text-xs text-[#9FC4BE] leading-relaxed">
              تستلم كودك الفوري (يعمل لمرة واحدة)، ثم تدخله في خانة تفعيل الكود لفتح المحتوى فوراً ودائماً.
            </p>
          </div>
        </div>

        {/* Contact CTA Card */}
        <div className="bg-gradient-to-r from-[#0D2020] via-[#153F3A] to-[#0D2020] border border-[#1E7A72]/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6" id="card-contact-admin">
          <div className="text-center sm:text-right">
            <h3 className="font-['Cairo'] font-bold text-lg sm:text-xl text-[#EAF6F4] mb-1.5">
              جاهز لبدء دراستك وتفوقك؟
            </h3>
            <p className="text-xs sm:text-sm text-[#9FC4BE]">
              فريق دعم APEX جاهز على مدار الساعة لإصدار وتوليد أكواد التفعيل لجميع المواد.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {/* WhatsApp */}
            <a
              href="https://wa.me/?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%2C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D9%85%D9%86%D8%B5%D8%A9%20APEX%20%D9%88%D8%A7%D8%B3%D8%AA%D9%84%D8%A7%D9%85%20%D9%83%D9%88%D8%AF%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-[#060F0F] border border-[#25D366]/40 text-xs sm:text-sm font-bold transition-all active:scale-95"
              id="link-contact-whatsapp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب الإدارة</span>
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9] text-[#229ED9] hover:text-[#060F0F] border border-[#229ED9]/40 text-xs sm:text-sm font-bold transition-all active:scale-95"
              id="link-contact-telegram"
            >
              <Send className="w-4 h-4" />
              <span>تليغرام</span>
            </a>

            {/* I have a code */}
            <button
              onClick={onOpenActivate}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#7FDCCE] border border-[#7FDCCE]/40 text-xs sm:text-sm font-bold transition-all active:scale-95"
              id="btn-have-code"
            >
              <span>معي كود بالفعل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
