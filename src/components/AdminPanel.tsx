import React, { useState, useEffect } from 'react';
import { Course, ActivationCode } from '../types';
import { Shield, Key, Plus, Trash2, Edit3, Upload, Check, Copy, RefreshCw, X, FileCode, CheckCircle2, AlertCircle, Eye, ArrowRight } from 'lucide-react';

interface AdminPanelProps {
  isAdminLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
  courses: Course[];
  onRefreshCourses: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  courses,
  onRefreshCourses,
  onClose,
}) => {
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'codes' | 'courses'>('codes');

  // Codes state
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);
  const [selectedCourseForCode, setSelectedCourseForCode] = useState<string>('');
  const [codesCountToGen, setCodesCountToGen] = useState<number>(1);
  const [codeNotes, setCodeNotes] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'used' | 'unused'>('all');

  // Course editing / modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    description: '',
    level: 'جامعي',
    category: 'عام',
    isFree: false,
    lessonsCount: 1,
    tags: '',
    htmlContent: '',
  });
  const [htmlFileName, setHtmlFileName] = useState<string | null>(null);

  // Fetch codes when admin is logged in
  const fetchCodes = async () => {
    setCodesLoading(true);
    try {
      const res = await fetch('/api/admin/codes', {
        headers: { Authorization: 'Bearer apex-admin-token' },
      });
      if (res.ok) {
        const data = await res.json();
        setCodes(data.codes || []);
      }
    } catch (err) {
      console.error('Failed to fetch codes:', err);
    } finally {
      setCodesLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchCodes();
      if (courses.length > 0 && !selectedCourseForCode) {
        setSelectedCourseForCode(courses[0].id);
      }
    }
  }, [isAdminLoggedIn, courses]);

  // Handle Admin Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onLogin(data.token);
        setUsername('');
        setPassword('');
      } else {
        setLoginError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (err) {
      setLoginError('فشل الاتصال بالخادم');
    } finally {
      setLoginLoading(false);
    }
  };

  // Generate codes
  const handleGenerateCodes = async () => {
    if (!selectedCourseForCode) return;
    try {
      const res = await fetch('/api/admin/codes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer apex-admin-token',
        },
        body: JSON.stringify({
          courseId: selectedCourseForCode,
          count: codesCountToGen,
          notes: codeNotes,
        }),
      });

      if (res.ok) {
        fetchCodes();
        setCodeNotes('');
      }
    } catch (err) {
      console.error('Failed to generate codes:', err);
    }
  };

  // Delete code
  const handleDeleteCode = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الكود؟')) return;
    try {
      const res = await fetch(`/api/admin/codes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer apex-admin-token' },
      });
      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error('Failed to delete code:', err);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = (codeStr: string, id: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Handle HTML File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setHtmlFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCourseForm((prev) => ({ ...prev, htmlContent: content }));
    };
    reader.readAsText(file);
  };

  // Save Course (Create or Update)
  const handleSaveCourse = async () => {
    if (!courseForm.title) {
      alert('يرجى كتابة عنوان المادة');
      return;
    }

    try {
      const url = editingCourse ? `/api/admin/courses/${editingCourse.id}` : '/api/admin/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer apex-admin-token',
        },
        body: JSON.stringify(courseForm),
      });

      if (res.ok) {
        setIsNewCourseModalOpen(false);
        setEditingCourse(null);
        setCourseForm({
          title: '',
          code: '',
          description: '',
          level: 'جامعي',
          category: 'عام',
          isFree: false,
          lessonsCount: 1,
          tags: '',
          htmlContent: '',
        });
        setHtmlFileName(null);
        onRefreshCourses();
      }
    } catch (err) {
      console.error('Failed to save course:', err);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟ سيتم إزالتها نهائياً.')) return;
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer apex-admin-token' },
      });
      if (res.ok) {
        onRefreshCourses();
      }
    } catch (err) {
      console.error('Failed to delete course:', err);
    }
  };

  // Open Edit Course
  const openEditCourse = async (c: Course) => {
    // Fetch full course including htmlContent
    try {
      const res = await fetch(`/api/courses/${c.id}`, {
        headers: { Authorization: 'Bearer apex-admin-token' },
      });
      const data = await res.json();
      const fullCourse = data.course || c;

      setEditingCourse(fullCourse);
      setCourseForm({
        title: fullCourse.title,
        code: fullCourse.code,
        description: fullCourse.description,
        level: fullCourse.level,
        category: fullCourse.category,
        isFree: fullCourse.isFree,
        lessonsCount: fullCourse.lessonsCount,
        tags: fullCourse.tags.join(', '),
        htmlContent: fullCourse.htmlContent || '',
      });
      setHtmlFileName('الملف الحالي للمادة');
      setIsNewCourseModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch full course:', err);
    }
  };

  // Filtered codes
  const filteredCodes = codes.filter((c) => {
    if (statusFilter === 'used') return c.isUsed;
    if (statusFilter === 'unused') return !c.isUsed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-4 sm:p-6 flex justify-center items-start" id="apex-admin-panel-overlay">
      <div className="w-full max-w-5xl bg-[#0D2020] border border-[#1E7A72]/50 rounded-2xl shadow-2xl p-5 sm:p-8 my-8 relative overflow-hidden" id="admin-panel-container">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[#060F0F] text-[#9FC4BE] hover:text-white hover:bg-[#153F3A] transition-colors"
          id="btn-close-admin-panel"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E5845] to-[#1E7A72] flex items-center justify-center text-[#7FDCCE] shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-['Cairo'] font-bold text-xl sm:text-2xl text-[#EAF6F4]">
              لوحة تحكم الإدارة — APEX Admin
            </h2>
            <p className="text-xs sm:text-sm text-[#9FC4BE]">
              إدارة المواد، توليد الأكواد الذرية، ومتابعة حالات الاستخدام
            </p>
          </div>
        </div>

        {/* Not Logged In: Show Admin Login Form */}
        {!isAdminLoggedIn ? (
          <div className="max-w-md mx-auto py-8 text-center" id="admin-login-box">
            <div className="bg-[#060F0F] border border-[#1E7A72]/40 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-['Cairo'] font-bold text-lg text-[#EAF6F4] mb-2">
                تسجيل دخول المشرف
              </h3>
              <p className="text-xs text-[#9FC4BE] mb-6">
                أدخل اسم المستخدم وكلمة المرور الخاصة بإدارة منصة APEX
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-right">
                <div>
                  <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                    اسم المستخدم:
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0D2020] border border-[#1E7A72]/40 focus:border-[#7FDCCE] rounded-xl text-[#EAF6F4] text-sm outline-none transition-all"
                    placeholder="اسم المستخدم"
                    required
                    id="admin-input-username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                    كلمة المرور:
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0D2020] border border-[#1E7A72]/40 focus:border-[#7FDCCE] rounded-xl text-[#EAF6F4] text-sm outline-none transition-all"
                    placeholder="كلمة المرور"
                    required
                    id="admin-input-password"
                  />
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] font-bold text-sm shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                  id="btn-admin-submit-login"
                >
                  <Shield className="w-4 h-4" />
                  <span>{loginLoading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div>
            {/* Nav Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E7A72]/30 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('codes')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'codes'
                      ? 'bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] shadow-md'
                      : 'bg-[#060F0F] text-[#9FC4BE] hover:text-[#EAF6F4]'
                  }`}
                  id="tab-admin-codes"
                >
                  <Key className="w-4 h-4 text-[#7FDCCE]" />
                  <span>إدارة وتوليد الأكواد ({codes.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'courses'
                      ? 'bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] shadow-md'
                      : 'bg-[#060F0F] text-[#9FC4BE] hover:text-[#EAF6F4]'
                  }`}
                  id="tab-admin-courses"
                >
                  <FileCode className="w-4 h-4 text-[#7FDCCE]" />
                  <span>إدارة المواد ورفع HTML ({courses.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchCodes}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#060F0F] hover:bg-[#153F3A] text-[#9FC4BE] hover:text-[#EAF6F4] text-xs font-semibold border border-[#1E7A72]/30 transition-all"
                  title="تحديث البيانات"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تحديث</span>
                </button>

                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold transition-all"
                >
                  تسجيل خروج
                </button>
              </div>
            </div>

            {/* TAB 1: CODES GENERATOR & LIST */}
            {activeTab === 'codes' && (
              <div className="space-y-6 animate-in fade-in" id="panel-admin-codes">
                {/* Generator Box */}
                <div className="bg-[#060F0F] border border-[#1E7A72]/40 rounded-2xl p-5 sm:p-6">
                  <h3 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-[#7FDCCE]" />
                    <span>توليد أكواد تفعيل جديدة بضغطة زر</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-[#9FC4BE] mb-1">المادة المرتبطة:</label>
                      <select
                        value={selectedCourseForCode}
                        onChange={(e) => setSelectedCourseForCode(e.target.value)}
                        className="w-full px-3 py-2 bg-[#0D2020] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none"
                        id="select-generate-course"
                      >
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-[#9FC4BE] mb-1">عدد الأكواد:</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={codesCountToGen}
                        onChange={(e) => setCodesCountToGen(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-[#0D2020] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none font-mono"
                        id="input-generate-count"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#9FC4BE] mb-1">ملاحظة للطالب/الدفعة:</label>
                      <input
                        type="text"
                        value={codeNotes}
                        onChange={(e) => setCodeNotes(e.target.value)}
                        placeholder="اختياري (مثل: دفعة طلاب SVU)"
                        className="w-full px-3 py-2 bg-[#0D2020] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none"
                        id="input-generate-notes"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateCodes}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-[#EAF6F4] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    id="btn-trigger-generate-codes"
                  >
                    <Key className="w-4 h-4" />
                    <span>توليد {codesCountToGen} كود عشوائي فريد</span>
                  </button>
                </div>

                {/* Filter & Codes Table */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <h3 className="font-['Cairo'] font-bold text-base text-[#EAF6F4]">
                      سجل الأكواد الصادرة ({filteredCodes.length})
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#9FC4BE]">الحالة:</span>
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          statusFilter === 'all' ? 'bg-[#1E7A72] text-white' : 'bg-[#060F0F] text-[#9FC4BE]'
                        }`}
                      >
                        الكل
                      </button>
                      <button
                        onClick={() => setStatusFilter('unused')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          statusFilter === 'unused' ? 'bg-[#0E5845] text-[#7FDCCE]' : 'bg-[#060F0F] text-[#9FC4BE]'
                        }`}
                      >
                        غير مستخدم
                      </button>
                      <button
                        onClick={() => setStatusFilter('used')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                          statusFilter === 'used' ? 'bg-amber-900/50 text-amber-300' : 'bg-[#060F0F] text-[#9FC4BE]'
                        }`}
                      >
                        مستخدم
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto bg-[#060F0F] border border-[#1E7A72]/30 rounded-2xl">
                    <table className="w-full text-right text-xs" id="table-admin-codes">
                      <thead className="bg-[#0D2020] text-[#9FC4BE] border-b border-[#1E7A72]/30">
                        <tr>
                          <th className="p-3 font-semibold">الكود (رمز التفعيل)</th>
                          <th className="p-3 font-semibold">المادة المرتبطة</th>
                          <th className="p-3 font-semibold">الحالة</th>
                          <th className="p-3 font-semibold">تاريخ التوليد / الاستخدام</th>
                          <th className="p-3 font-semibold text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E7A72]/15">
                        {filteredCodes.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-[#9FC4BE]">
                              لا توجد أكواد مطابقة. قم بتوليد كود جديد أعلاه.
                            </td>
                          </tr>
                        ) : (
                          filteredCodes.map((c) => (
                            <tr key={c.id} className="hover:bg-[#0D2020]/50 transition-colors">
                              <td className="p-3 font-mono font-bold text-[#EAF6F4] flex items-center gap-2">
                                <span>{c.code}</span>
                                <button
                                  onClick={() => handleCopyCode(c.code, c.id)}
                                  className="p-1 rounded bg-[#0D2020] hover:bg-[#153F3A] text-[#7FDCCE] transition-colors"
                                  title="نسخ الكود"
                                >
                                  {copiedCodeId === c.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </td>
                              <td className="p-3 text-[#EAF6F4] font-medium">{c.courseTitle}</td>
                              <td className="p-3">
                                {c.isUsed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[11px] font-bold">
                                    مستخدم (ملغى)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold">
                                    غير مستخدم (صالح)
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-[#9FC4BE]">
                                <div>
                                  {new Date(c.createdAt).toLocaleDateString('ar-EG', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                                {c.isUsed && c.usedAt && (
                                  <div className="text-[10px] text-amber-300">
                                    استخدم: {new Date(c.usedAt).toLocaleTimeString('ar-EG')}
                                  </div>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleDeleteCode(c.id)}
                                  className="p-1.5 rounded-lg bg-[#0D2020] hover:bg-red-950/60 text-red-400 border border-red-900/30 transition-colors"
                                  title="حذف الكود"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COURSES CRUD & HTML UPLOAD */}
            {activeTab === 'courses' && (
              <div className="space-y-6 animate-in fade-in" id="panel-admin-courses">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Cairo'] font-bold text-base text-[#EAF6F4]">
                    المواد الدراسية المتوفرة على المنصة
                  </h3>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        code: '',
                        description: '',
                        level: 'جامعي',
                        category: 'عام',
                        isFree: false,
                        lessonsCount: 1,
                        tags: '',
                        htmlContent: '',
                      });
                      setHtmlFileName(null);
                      setIsNewCourseModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] text-xs sm:text-sm font-bold shadow-md hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] transition-all"
                    id="btn-admin-add-course"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة مادة جديدة</span>
                  </button>
                </div>

                {/* Courses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((c) => (
                    <div
                      key={c.id}
                      className="bg-[#060F0F] border border-[#1E7A72]/30 rounded-2xl p-5 flex flex-col justify-between"
                      id={`admin-course-item-${c.id}`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs text-[#7FDCCE] font-bold px-2.5 py-0.5 rounded-md bg-[#0D2020] border border-[#1E7A72]/30">
                            {c.code}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              c.isFree
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                : 'bg-[#0E5845] text-[#7FDCCE]'
                            }`}
                          >
                            {c.isFree ? 'مفتوحة (مجانية)' : 'مقفلة (تحتاج كود)'}
                          </span>
                        </div>
                        <h4 className="font-['Cairo'] font-bold text-base text-[#EAF6F4] mb-1.5">
                          {c.title}
                        </h4>
                        <p className="text-xs text-[#9FC4BE] line-clamp-2 mb-3">
                          {c.description}
                        </p>
                        <div className="text-[11px] text-[#9FC4BE] mb-3">
                          <span>المستوى: {c.level}</span> • <span>{c.lessonsCount} درس</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#1E7A72]/20">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditCourse(c)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D2020] hover:bg-[#153F3A] text-[#7FDCCE] border border-[#1E7A72]/30 text-xs font-semibold transition-colors"
                            id={`btn-edit-course-${c.id}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>تعديل ورفع HTML</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteCourse(c.id)}
                          className="p-1.5 rounded-xl bg-[#0D2020] hover:bg-red-950/60 text-red-400 border border-red-900/30 text-xs transition-colors"
                          title="حذف المادة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT COURSE WITH HTML UPLOADER */}
        {isNewCourseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" id="modal-edit-course">
            <div className="w-full max-w-2xl bg-[#0D2020] border border-[#1E7A72]/50 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsNewCourseModalOpen(false)}
                className="absolute top-4 left-4 p-2 rounded-xl bg-[#060F0F] text-[#9FC4BE] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-['Cairo'] font-bold text-lg text-[#EAF6F4] mb-4 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-[#7FDCCE]" />
                <span>{editingCourse ? 'تعديل المادة ورفع ملف HTML' : 'إضافة مادة دراسية جديدة'}</span>
              </h3>

              <div className="space-y-4 text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                      عنوان المادة:
                    </label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="مثال: منصة تحديد المستوى الإنجليزي — SVU"
                      className="w-full px-3.5 py-2.5 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EAF6F4] mb-1">رمز المادة:</label>
                    <input
                      type="text"
                      value={courseForm.code}
                      onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                      placeholder="مثال: ENG-SVU"
                      className="w-full px-3.5 py-2.5 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                    وصف مختصر للمادة:
                  </label>
                  <textarea
                    rows={2}
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    placeholder="نبذة عن المادة وأهميتها للطلاب..."
                    className="w-full px-3.5 py-2.5 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl text-xs sm:text-sm text-[#EAF6F4] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#EAF6F4] mb-1">المستوى:</label>
                    <input
                      type="text"
                      value={courseForm.level}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      placeholder="مثال: المستوى 1 - 5"
                      className="w-full px-3.5 py-2 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl text-xs text-[#EAF6F4] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#EAF6F4] mb-1">
                      عدد الدروس:
                    </label>
                    <input
                      type="number"
                      value={courseForm.lessonsCount}
                      onChange={(e) => setCourseForm({ ...courseForm, lessonsCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2 bg-[#060F0F] border border-[#1E7A72]/40 rounded-xl text-xs text-[#EAF6F4] outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#EAF6F4]">
                      <input
                        type="checkbox"
                        checked={courseForm.isFree}
                        onChange={(e) => setCourseForm({ ...courseForm, isFree: e.target.checked })}
                        className="w-4 h-4 rounded text-[#1E7A72] accent-[#1E7A72]"
                      />
                      <span>مادة مفتوحة ومجانية</span>
                    </label>
                  </div>
                </div>

                {/* Direct HTML File Uploader */}
                <div className="p-4 rounded-xl bg-[#060F0F] border border-[#1E7A72]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7FDCCE] flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      رفع أو استبدال ملف HTML الخاص بالمادة:
                    </span>
                    {htmlFileName && (
                      <span className="text-[11px] text-emerald-400 font-mono">
                        تم تحميل: {htmlFileName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#9FC4BE]">
                    ارفع ملف HTML تفاعلي كامل يحتوي الدروس أو الأسئلة ليتم عرضه للطالب مباشرة بعد تفعيل الكود.
                  </p>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-[#9FC4BE] file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1E7A72] file:text-white hover:file:bg-[#7FDCCE] hover:file:text-[#060F0F] cursor-pointer"
                    id="input-file-html-upload"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsNewCourseModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-[#060F0F] text-[#9FC4BE] text-xs font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0E5845] to-[#1E7A72] text-[#EAF6F4] hover:from-[#1E7A72] hover:to-[#7FDCCE] hover:text-[#060F0F] text-xs font-bold shadow-md transition-all"
                    id="btn-save-course-modal"
                  >
                    حفظ المادة
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
