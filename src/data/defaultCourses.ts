import { Course, ActivationCode } from '../types';
import { SVU_COURSE_HTML } from './svuCourseHtml';

export const DEFAULT_COURSES: Course[] = [
  {
    id: 'course-svu-eng',
    title: 'منصة تحديد المستوى الإنجليزي — SVU',
    code: 'ENG-SVU',
    description: 'الدورة المكثفة والشاملة للاستعداد لامتحان تحديد المستوى باللغة الإنجليزية في الجامعة الافتراضية السورية. تتضمن 47 درساً مقسماً على 5 مستويات، بنك أسئلة شامل، وبطاقات مفردات واختبارات نهائية.',
    level: 'جميع المستويات (L1 - L5)',
    category: 'اللغات والتحضير الجامعي',
    iconName: 'Languages',
    isFree: false,
    lessonsCount: 47,
    tags: ['SVU', 'English', 'تحديد مستوى', 'قواعد', '47 درس'],
    htmlContent: SVU_COURSE_HTML,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-math-calc',
    title: 'الرياضيات الجامعية — التفاضل والتكامل (Calculus I)',
    code: 'MATH-101',
    description: 'شرح مفصل ومبسّط لأساسيات النهايات، الاشتقاق، وتطبيقات التكامل لطلاب الهندسة وتكنولوجيا المعلومات مع أمثلة محلولة واختبارات تدريبية.',
    level: 'جامعي — سنة أولى',
    category: 'العلوم الأساسية والهندسة',
    iconName: 'Calculator',
    isFree: false,
    lessonsCount: 18,
    tags: ['تفاضل', 'تكامل', 'نهايات', 'هندسة'],
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Calculus I — APEX Platform</title>
<style>
body{margin:0;background:#060F0F;color:#EAF6F4;font-family:sans-serif;padding:24px;direction:rtl;line-height:1.7;}
.card{background:#0D2020;border:1px solid #1D3E3B;border-radius:14px;padding:20px;margin-bottom:16px;}
h1,h2{color:#7FDCCE;}
.badge{background:#1E7A72;color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;display:inline-block;}
.formula{direction:ltr;background:#153B38;padding:12px;border-radius:8px;font-family:monospace;font-size:16px;color:#7FDCCE;text-align:center;margin:10px 0;}
</style>
</head>
<body>
<div class="card">
  <span class="badge">Calculus I</span>
  <h1>التفاضل والتكامل — المحتوى التفاعلي</h1>
  <p>أهلاً بك في دورة التفاضل والتكامل الجامعية على منصة APEX. تم فتح المحتوى بنجاح عبر كودك التفعيلي.</p>
</div>
<div class="card">
  <h2>1. النهايات والاستمرار (Limits & Continuity)</h2>
  <div class="formula">lim (x -> 0) [sin(x) / x] = 1</div>
  <p>قاعدة لوبيتال (L'Hôpital's Rule) تُستخدم عندما تكون النهاية من الأشكال غير المعينة مثل 0/0 أو ∞/∞ عبر اشتقاق البسط والمقام كلّ على حدة.</p>
</div>
<div class="card">
  <h2>2. قواعد الاشتقاق الأساسية (Derivatives)</h2>
  <div class="formula">d/dx [x^n] = n * x^(n-1)</div>
  <div class="formula">d/dx [e^x] = e^x , d/dx [ln(x)] = 1/x</div>
</div>
</body></html>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'course-prog-python',
    title: 'مقدمة في البرمجة والخوارزميات — Python',
    code: 'CS-PYTHON',
    description: 'تعلم التفكير البرمجي وبناء التطبيقات باستخدام لغة بايثون. من المتغيرات وهياكل التحكم حتى البرمجة الكائنية والتعامل مع الملفات.',
    level: 'مبتدئ إلى متوسط',
    category: 'علوم الحاسوب والبرمجة',
    iconName: 'Code',
    isFree: true,
    lessonsCount: 22,
    tags: ['Python', 'برمجة', 'مجاني', 'خوارزميات'],
    htmlContent: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Python Programming — APEX Platform</title>
<style>
body{margin:0;background:#060F0F;color:#EAF6F4;font-family:sans-serif;padding:24px;direction:rtl;line-height:1.7;}
.card{background:#0D2020;border:1px solid #1D3E3B;border-radius:14px;padding:20px;margin-bottom:16px;}
h1,h2{color:#7FDCCE;}
pre{direction:ltr;background:#060F0F;border:1px solid #1D3E3B;padding:14px;border-radius:8px;color:#7FDCCE;font-family:monospace;overflow-x:auto;}
</style>
</head>
<body>
<div class="card">
  <span style="background:#0E5845;color:#fff;padding:4px 10px;border-radius:6px;font-size:12px;">دورة مفتوحة ومجانية</span>
  <h1>مقدمة في بايثون (Python 3)</h1>
  <p>هذه الدورة متاحة لجميع الطلاب مجاناً للاستفادة والتعلم الأساسي.</p>
</div>
<div class="card">
  <h2>الدوال وهياكل البيانات</h2>
  <pre>def calculate_average(scores):
    total = sum(scores)
    return total / len(scores)

students_grades = [92, 85, 78, 95]
print("المعدل:", calculate_average(students_grades))</pre>
</div>
</body></html>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_CODES: ActivationCode[] = [
  {
    id: 'code-1',
    code: 'APEX-SVU-2026',
    courseId: 'course-svu-eng',
    courseTitle: 'منصة تحديد المستوى الإنجليزي — SVU',
    isUsed: false,
    createdAt: new Date().toISOString(),
    notes: 'كود تجريبي جاهز لتفعيل مادة اللغة الإنجليزية',
  },
  {
    id: 'code-2',
    code: 'APEX-ENG-7788',
    courseId: 'course-svu-eng',
    courseTitle: 'منصة تحديد المستوى الإنجليزي — SVU',
    isUsed: false,
    createdAt: new Date().toISOString(),
    notes: 'كود تجريبي إضافي لمادة الإنجليزي',
  },
  {
    id: 'code-3',
    code: 'APEX-MATH-1010',
    courseId: 'course-math-calc',
    courseTitle: 'الرياضيات الجامعية — التفاضل والتكامل (Calculus I)',
    isUsed: false,
    createdAt: new Date().toISOString(),
    notes: 'كود تجريبي لمادة الرياضيات',
  },
  {
    id: 'code-4',
    code: 'APEX-TEST-USED',
    courseId: 'course-svu-eng',
    courseTitle: 'منصة تحديد المستوى الإنجليزي — SVU',
    isUsed: true,
    usedAt: new Date(Date.now() - 3600000).toISOString(),
    usedBy: 'طالب تجريبي (اختبار المنع)',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    notes: 'كود تم استخدامه مسبقاً لاختبار رسالة الرفض',
  },
];
