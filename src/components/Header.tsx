import React from 'react';
import { ApexLogo } from './ApexLogo';
import { Key, Sparkles, Shield, BookOpen, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenActivate: () => void;
  onOpenAiTutor: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  currentView: 'home' | 'course' | 'admin';
  activeCourseTitle?: string;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenActivate,
  onOpenAiTutor,
  onOpenAdmin,
  onGoHome,
  currentView,
  activeCourseTitle,
  isAdminLoggedIn,
  onAdminLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#060F0F]/90 border-b border-[#0D2020] px-4 lg:px-8 py-3.5 transition-all shadow-lg shadow-black/20" id="apex-main-header">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onGoHome}
          id="apex-header-brand"
        >
          <ApexLogo size={42} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Cairo'] font-black text-xl tracking-tight text-[#EAF6F4] group-hover:text-[#7FDCCE] transition-colors">
                APEX
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1E7A72]/30 text-[#7FDCCE] border border-[#1E7A72]/50">
                Platform
              </span>
            </div>
            <p className="text-xs text-[#9FC4BE] font-medium hidden sm:block">
              المنصة التعليمية الشاملة لطلاب الجامعات
            </p>
          </div>
        </div>

        {/* Center active course title if viewing a course */}
        {currentView === 'course' && activeCourseTitle && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0D2020] border border-[#1E7A72]/40 text-xs text-[#EAF6F4] max-w-sm truncate" id="apex-active-course-crumb">
            <BookOpen className="w-3.5 h-3.5 text-[#7FDCCE] shrink-0" />
            <span className="truncate">{activeCourseTitle}</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3" id="apex-header-actions">
          {/* AI Tutor Button */}
          <button
            onClick={onOpenAiTutor}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] transition-all text-xs sm:text-sm font-bold shadow-md shadow-[#0E5845]/20 active:scale-95"
            id="btn-open-ai-tutor"
            title="المساعد الأكاديمي الذكي وتحليل صور الأسئلة"
          >
            <Sparkles className="w-4 h-4 text-[#7FDCCE] group-hover:text-[#060F0F]" />
            <span>المساعد الذكي</span>
          </button>

          {/* Activate Code Button */}
          <button
            onClick={onOpenActivate}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#0D2020] hover:bg-[#153F3A] text-[#7FDCCE] border border-[#1E7A72]/50 hover:border-[#7FDCCE] transition-all text-xs sm:text-sm font-bold active:scale-95 shadow-sm"
            id="btn-open-activate-code"
          >
            <Key className="w-4 h-4 text-[#7FDCCE]" />
            <span className="hidden xs:inline">تفعيل كود</span>
            <span className="xs:hidden">تفعيل</span>
          </button>

          {/* Admin link */}
          {isAdminLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  currentView === 'admin'
                    ? 'bg-[#1E7A72] text-white border-[#7FDCCE]'
                    : 'bg-[#0D2020] text-[#9FC4BE] border-[#1E7A72]/30 hover:text-white'
                }`}
                id="btn-goto-admin"
              >
                <Shield className="w-3.5 h-3.5 text-[#7FDCCE]" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="p-2 rounded-xl bg-[#0D2020] hover:bg-red-900/30 text-[#9FC4BE] hover:text-red-400 border border-[#1E7A72]/20 text-xs transition-all"
                title="تسجيل خروج المدير"
                id="btn-admin-logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdmin}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-[#060F0F] hover:bg-[#0D2020] text-[#9FC4BE] hover:text-[#7FDCCE] border border-transparent hover:border-[#1E7A72]/30 text-xs font-medium transition-all"
              id="btn-admin-login-link"
              title="دخول الإدارة"
            >
              <Shield className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
