import React, { useState, useEffect } from 'react';
import { Course } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CourseCard } from './components/CourseCard';
import { CourseViewer } from './components/CourseViewer';
import { HowToBuy } from './components/HowToBuy';
import { CodeActivationModal } from './components/CodeActivationModal';
import { AdminPanel } from './components/AdminPanel';
import { AiTutorModal } from './components/AiTutorModal';
import { ApexLogo } from './components/ApexLogo';
import { Search, Sparkles, BookOpen, Key, ShieldCheck, Mail, MessageCircle, Send } from 'lucide-react';

export default function App() {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockedCourseIds, setUnlockedCourseIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('APEX_UNLOCKED_COURSES');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current view
  const [currentView, setCurrentView] = useState<'home' | 'course' | 'admin'>('home');
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeCourseHtml, setActiveCourseHtml] = useState<string | undefined>(undefined);

  // Modals
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isAiTutorModalOpen, setIsAiTutorModalOpen] = useState(false);
  const [aiTutorContext, setAiTutorContext] = useState<string | undefined>(undefined);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return Boolean(sessionStorage.getItem('apex-admin-token'));
  });

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Save unlocked courses
  const handleUnlockCourse = (courseId: string, courseTitle: string, unlockToken: string) => {
    setUnlockedCourseIds((prev) => {
      const updated = Array.from(new Set([...prev, courseId]));
      try {
        localStorage.setItem('APEX_UNLOCKED_COURSES', JSON.stringify(updated));
        localStorage.setItem(`APEX_TOKEN_${courseId}`, unlockToken);
      } catch {}
      return updated;
    });

    // Auto navigate to this course if desired
    const target = courses.find((c) => c.id === courseId);
    if (target) {
      handleOpenCourse(target, unlockToken);
    }
  };

  // Open Course Viewer
  const handleOpenCourse = async (course: Course, providedToken?: string) => {
    setActiveCourse(course);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const isUnlocked = course.isFree || unlockedCourseIds.includes(course.id);
    const token = providedToken || localStorage.getItem(`APEX_TOKEN_${course.id}`) || (isUnlocked ? course.id : '');

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        headers: {
          'x-apex-unlock-token': token,
          ...(isAdminLoggedIn ? { Authorization: 'Bearer apex-admin-token' } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        setActiveCourseHtml(data.course?.htmlContent);
      }
    } catch (err) {
      console.error('Failed to load course content:', err);
    }
  };

  // Admin login / logout
  const handleAdminLogin = (token: string) => {
    sessionStorage.setItem('apex-admin-token', token);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('apex-admin-token');
    setIsAdminLoggedIn(false);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  // Open AI Tutor with context
  const handleOpenAiTutorWithContext = (contextTitle?: string) => {
    setAiTutorContext(contextTitle);
    setIsAiTutorModalOpen(true);
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...Array.from(new Set(courses.map((c) => c.category)))];

  return (
    <div className="min-h-screen bg-[#060F0F] text-[#EAF6F4] flex flex-col selection:bg-[#1E7A72]/40 selection:text-[#7FDCCE]">
      {/* Header */}
      <Header
        onOpenActivate={() => setIsActivateModalOpen(true)}
        onOpenAiTutor={() => handleOpenAiTutorWithContext()}
        onOpenAdmin={() => setCurrentView('admin')}
        onGoHome={() => setCurrentView('home')}
        currentView={currentView}
        activeCourseTitle={activeCourse?.title}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div>
            <Hero
              onOpenActivate={() => setIsActivateModalOpen(true)}
              onExploreCourses={() => {
                document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              coursesCount={courses.length}
            />

            {/* Courses Section */}
            <section className="max-w-7xl mx-auto px-4 py-8" id="courses-section">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="font-['Cairo'] font-bold text-2xl sm:text-3xl text-[#EAF6F4] mb-1">
                    المواد والمقررات المتاحة
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9FC4BE]">
                    اختر مادتك وابدأ التدريب الفوري، أو فعّل كودك لفتح المحتوى الكامل
                  </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[240px]">
                    <Search className="absolute right-3.5 top-3 w-4 h-4 text-[#9FC4BE]/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن مادة أو موضوع..."
                      className="w-full pr-10 pl-4 py-2 bg-[#0D2020] border border-[#1E7A72]/40 focus:border-[#7FDCCE] rounded-xl text-xs sm:text-sm text-[#EAF6F4] placeholder-[#9FC4BE]/40 outline-none transition-all"
                      id="input-search-courses"
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#1E7A72] text-white'
                          : 'bg-[#0D2020] text-[#9FC4BE] hover:text-[#EAF6F4]'
                      }`}
                    >
                      {cat === 'all' ? 'جميع التصنيفات' : cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Courses Grid */}
              {loading ? (
                <div className="py-16 text-center text-[#9FC4BE]">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7FDCCE] mb-3" />
                  <p className="text-xs">جاري تحميل المواد الدراسية...</p>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="py-16 text-center bg-[#0D2020] border border-[#1E7A72]/30 rounded-2xl p-8">
                  <BookOpen className="w-10 h-10 text-[#9FC4BE]/40 mx-auto mb-3" />
                  <h3 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1">
                    لم يتم العثور على مواد مطابقة
                  </h3>
                  <p className="text-xs text-[#9FC4BE]">جرب البحث بكلمات أخرى أو اختر تصنيفاً آخر.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isUnlocked={unlockedCourseIds.includes(course.id)}
                      onOpenCourse={handleOpenCourse}
                      onOpenActivate={() => setIsActivateModalOpen(true)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* How to Buy Section */}
            <HowToBuy onOpenActivate={() => setIsActivateModalOpen(true)} />
          </div>
        )}

        {/* VIEW 2: COURSE VIEWER */}
        {currentView === 'course' && activeCourse && (
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <CourseViewer
              course={activeCourse}
              htmlContent={activeCourseHtml}
              isUnlocked={activeCourse.isFree || unlockedCourseIds.includes(activeCourse.id)}
              onBack={() => setCurrentView('home')}
              onOpenActivate={() => setIsActivateModalOpen(true)}
              onOpenAiTutorWithContext={handleOpenAiTutorWithContext}
            />
          </div>
        )}

        {/* VIEW 3: ADMIN PANEL */}
        {currentView === 'admin' && (
          <AdminPanel
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={handleAdminLogin}
            onLogout={handleAdminLogout}
            courses={courses}
            onRefreshCourses={fetchCourses}
            onClose={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Code Activation Modal */}
      <CodeActivationModal
        isOpen={isActivateModalOpen}
        onClose={() => setIsActivateModalOpen(false)}
        onSuccess={(courseId, courseTitle, unlockToken) => {
          handleUnlockCourse(courseId, courseTitle, unlockToken);
        }}
      />

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={isAiTutorModalOpen}
        onClose={() => setIsAiTutorModalOpen(false)}
        activeCourseContext={aiTutorContext}
      />

      {/* Simple Footer as per prompt specification */}
      <footer className="border-t border-[#0D2020] bg-[#060F0F] py-8 px-4 mt-12" id="apex-main-footer">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9FC4BE]">
          <div className="flex items-center gap-3">
            <ApexLogo size={32} />
            <div>
              <span className="font-['Cairo'] font-bold text-sm text-[#EAF6F4]">APEX Platform</span>
              <p className="text-[11px] text-[#9FC4BE]">منصة تعليمية متكاملة لطلاب الجامعات</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7FDCCE] transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>واتساب الدعم</span>
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7FDCCE] transition-colors flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>قناة التليغرام</span>
            </a>
            <button
              onClick={() => setCurrentView('admin')}
              className="hover:text-[#7FDCCE] transition-colors"
            >
              لوحة الإدارة
            </button>
          </div>

          <div className="text-[#9FC4BE]/60 text-[11px]">
            جميع الحقوق محفوظة © {new Date().getFullYear()} APEX Platform
          </div>
        </div>
      </footer>
    </div>
  );
}
