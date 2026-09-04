import React from 'react';
import { Course } from '../types';
import { Lock, Unlock, CheckCircle, BookOpen, Layers, ArrowLeft, Key } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isUnlocked: boolean;
  onOpenCourse: (course: Course) => void;
  onOpenActivate: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isUnlocked,
  onOpenCourse,
  onOpenActivate,
}) => {
  const canAccess = course.isFree || isUnlocked;

  return (
    <div
      className="group relative bg-[#0D2020] border border-[#1E7A72]/30 hover:border-[#7FDCCE]/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#0E5845]/20 flex flex-col justify-between"
      id={`course-card-${course.id}`}
    >
      {/* Top badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#060F0F] text-[#7FDCCE] border border-[#1E7A72]/40 font-mono">
            {course.code}
          </span>

          {course.isFree ? (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
              <Unlock className="w-3 h-3" />
              <span>مفتوحة ومجانية</span>
            </span>
          ) : isUnlocked ? (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#0E5845] text-[#7FDCCE] border border-[#7FDCCE]/40">
              <CheckCircle className="w-3 h-3" />
              <span>مُفعّلة لجهازك</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
              <Lock className="w-3 h-3" />
              <span>مقفلة (تحتاج كود)</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-['Cairo'] font-bold text-lg sm:text-xl text-[#EAF6F4] group-hover:text-[#7FDCCE] transition-colors mb-2 leading-snug">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#9FC4BE] leading-relaxed mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#9FC4BE] mb-4 pb-4 border-b border-[#1E7A72]/20">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#7FDCCE]" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#7FDCCE]" />
            <span>{course.lessonsCount} درس تفاعلي</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {course.tags.slice(0, 4).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#060F0F] text-[#9FC4BE] border border-[#1E7A72]/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action button */}
      <div className="pt-1">
        {canAccess ? (
          <button
            onClick={() => onOpenCourse(course)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
            id={`btn-open-course-${course.id}`}
          >
            <span>دخول ودراسة المادة</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenActivate}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#1E7A72] to-[#7FDCCE] text-[#060F0F] text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              id={`btn-activate-for-course-${course.id}`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>تفعيل بالكود</span>
            </button>
            <button
              onClick={() => onOpenCourse(course)}
              className="px-3 py-2.5 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#EAF6F4] border border-[#1E7A72]/30 text-xs font-semibold transition-all"
              id={`btn-preview-course-${course.id}`}
              title="معاينة تفاصيل المادة"
            >
              <span>تفاصيل</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
