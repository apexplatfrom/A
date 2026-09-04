import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { Course, ActivationCode } from './src/types';
import { DEFAULT_COURSES, DEFAULT_CODES } from './src/data/defaultCourses';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Database storage setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface DatabaseSchema {
  courses: Course[];
  codes: ActivationCode[];
  activatedCourseIds: string[]; // for demo student session
}

function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database, using defaults:', err);
  }

  const initialData: DatabaseSchema = {
    courses: DEFAULT_COURSES,
    codes: DEFAULT_CODES,
    activatedCourseIds: [],
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving initial database:', err);
  }

  return initialData;
}

let db = initDatabase();

function saveDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

// Lazy Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', coursesCount: db.courses.length, codesCount: db.codes.length });
});

// 1. Get Public Courses (without huge HTML body for speed)
app.get('/api/courses', (req, res) => {
  const publicCourses = db.courses.map((c) => ({
    id: c.id,
    title: c.title,
    code: c.code,
    description: c.description,
    level: c.level,
    category: c.category,
    iconName: c.iconName,
    isFree: c.isFree,
    lessonsCount: c.lessonsCount,
    tags: c.tags,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
  res.json({ courses: publicCourses });
});

// 2. Get Course Content (Full HTML)
app.get('/api/courses/:id', (req, res) => {
  const courseId = req.params.id;
  const course = db.courses.find((c) => c.id === courseId);

  if (!course) {
    return res.status(404).json({ error: 'المادة غير موجودة' });
  }

  // Check if course is free or unlocked
  const token = req.headers['x-apex-unlock-token'] as string;
  const isUnlocked = course.isFree || (token && token.includes(courseId)) || req.headers['authorization'] === 'Bearer apex-admin-token';

  res.json({
    course: {
      ...course,
      htmlContent: isUnlocked ? course.htmlContent : undefined,
      isLocked: !isUnlocked,
    },
  });
});

// 3. ATOMIC CODE ACTIVATION (Single use rule strictly enforced server-side)
app.post('/api/codes/activate', (req, res) => {
  const { code: rawCode } = req.body;

  if (!rawCode || typeof rawCode !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'يرجى إدخال كود التفعيل بشكل صحيح',
    });
  }

  const cleanCode = rawCode.trim().toUpperCase();

  // Find the code in atomic store
  const codeIndex = db.codes.findIndex((c) => c.code.trim().toUpperCase() === cleanCode);

  if (codeIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'كود التفعيل غير صحيح أو غير موجود. يرجى التأكد من كتابة الكود بدقة.',
    });
  }

  const targetCode = db.codes[codeIndex];

  // Check if already used
  if (targetCode.isUsed) {
    return res.status(400).json({
      success: false,
      message: 'هذا الكود مستخدم مسبقاً ولا يمكن استخدامه مرة أخرى',
      usedAt: targetCode.usedAt,
    });
  }

  // ATOMIC UPDATE: mark as used immediately
  const now = new Date().toISOString();
  targetCode.isUsed = true;
  targetCode.usedAt = now;
  targetCode.usedBy = req.ip || 'مستخدم مسجل';

  // Save to persistence immediately
  saveDatabase();

  // Find associated course
  const course = db.courses.find((c) => c.id === targetCode.courseId);

  // Generate an unlock session token for this client
  const unlockToken = `apex-unlock-${targetCode.courseId}-${Date.now()}`;

  return res.json({
    success: true,
    message: 'تم تفعيل الكود بنجاح! تم فتح المادة لك بالكامل.',
    courseId: targetCode.courseId,
    courseTitle: targetCode.courseTitle,
    course,
    unlockToken,
  });
});

// 4. ADMIN AUTHENTICATION
// Required credentials: Username "A", Password "1234"
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'A' && password === '1234') {
    return res.json({
      success: true,
      token: 'apex-admin-token',
      message: 'تم تسجيل الدخول بنجاح إلى لوحة الإدارة',
    });
  }

  return res.status(401).json({
    success: false,
    message: 'بيانات الدخول غير صحيحة',
  });
});

// Admin middleware check
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers['authorization'];
  if (auth === 'Bearer apex-admin-token') {
    return next();
  }
  return res.status(403).json({ error: 'غير مصرح بالوصول إلى لوحة الإدارة' });
}

// 5. ADMIN: List all codes
app.get('/api/admin/codes', requireAdmin, (req, res) => {
  res.json({ codes: db.codes });
});

// 6. ADMIN: Generate unique activation codes
app.post('/api/admin/codes/generate', requireAdmin, (req, res) => {
  const { courseId, count = 1, notes } = req.body;

  const course = db.courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(400).json({ error: 'المادة المحددة غير صالحة' });
  }

  const generatedCodes: ActivationCode[] = [];
  const numCount = Math.min(Math.max(1, parseInt(count) || 1), 50);

  for (let i = 0; i < numCount; i++) {
    // Generate unique code format APEX-XXXX-XXXX
    const randPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const codeStr = `APEX-${randPart1}-${randPart2}`;

    const newCode: ActivationCode = {
      id: `code-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: codeStr,
      courseId: course.id,
      courseTitle: course.title,
      isUsed: false,
      createdAt: new Date().toISOString(),
      notes: notes || `تم التوليد للمادة ${course.title}`,
    };

    db.codes.unshift(newCode);
    generatedCodes.push(newCode);
  }

  saveDatabase();
  res.json({ success: true, count: generatedCodes.length, codes: generatedCodes });
});

// 7. ADMIN: Delete a code
app.delete('/api/admin/codes/:id', requireAdmin, (req, res) => {
  const codeId = req.params.id;
  db.codes = db.codes.filter((c) => c.id !== codeId);
  saveDatabase();
  res.json({ success: true });
});

// 8. ADMIN: Courses CRUD
app.post('/api/admin/courses', requireAdmin, (req, res) => {
  const { title, code, description, level, category, isFree, htmlContent, tags, lessonsCount } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'عنوان المادة مطلوب' });
  }

  const newCourse: Course = {
    id: `course-${Date.now()}`,
    title,
    code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
    description: description || '',
    level: level || 'جامعي',
    category: category || 'عام',
    iconName: 'BookOpen',
    isFree: Boolean(isFree),
    lessonsCount: parseInt(lessonsCount) || 1,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : []),
    htmlContent: htmlContent || '<h1>محتوى المادة</h1><p>سيتم رفع المحتوى قريباً.</p>',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.courses.unshift(newCourse);
  saveDatabase();
  res.json({ success: true, course: newCourse });
});

app.put('/api/admin/courses/:id', requireAdmin, (req, res) => {
  const courseId = req.params.id;
  const courseIndex = db.courses.findIndex((c) => c.id === courseId);

  if (courseIndex === -1) {
    return res.status(404).json({ error: 'المادة غير موجودة' });
  }

  const { title, code, description, level, category, isFree, htmlContent, tags, lessonsCount } = req.body;

  db.courses[courseIndex] = {
    ...db.courses[courseIndex],
    title: title !== undefined ? title : db.courses[courseIndex].title,
    code: code !== undefined ? code : db.courses[courseIndex].code,
    description: description !== undefined ? description : db.courses[courseIndex].description,
    level: level !== undefined ? level : db.courses[courseIndex].level,
    category: category !== undefined ? category : db.courses[courseIndex].category,
    isFree: isFree !== undefined ? Boolean(isFree) : db.courses[courseIndex].isFree,
    htmlContent: htmlContent !== undefined ? htmlContent : db.courses[courseIndex].htmlContent,
    lessonsCount: lessonsCount !== undefined ? parseInt(lessonsCount) : db.courses[courseIndex].lessonsCount,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t: string) => t.trim()) : db.courses[courseIndex].tags),
    updatedAt: new Date().toISOString(),
  };

  saveDatabase();
  res.json({ success: true, course: db.courses[courseIndex] });
});

app.delete('/api/admin/courses/:id', requireAdmin, (req, res) => {
  const courseId = req.params.id;
  db.courses = db.courses.filter((c) => c.id !== courseId);
  saveDatabase();
  res.json({ success: true });
});

// 9. GEMINI CHATBOT API (Academic advisor / placement prep tutor)
app.post('/api/gemini/chat', async (req, res) => {
  const { message, history = [], currentCourseTitle } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'الرسالة مطلوبة' });
  }

  const ai = getGemini();
  if (!ai) {
    return res.json({
      reply: 'مرحباً بك! أنا المساعد الذكي لمنصة APEX. (ملاحظة: لتمكين الردود الحية من الذكاء الاصطناعي، يرجى تفعيل مفتاح GEMINI_API_KEY في إعدادات البيئة). يمكنني مساعدتك في شرح القواعد والأسئلة.',
    });
  }

  try {
    const systemInstruction = `أنت المساعد الأكاديمي والمدرب الذكي لمنصة APEX التعليمية (APEX AI Tutor).
دورك:
- مساعدة طلاب الجامعات وطلاب امتحان تحديد المستوى للغة الإنجليزية (English Placement Prep).
- شرح القواعد النحوية (Grammar)، الأزمنة، المفردات، والمبني للمجهول والجمل الشرطية بأسلوب مبسط وواضح جداً باللغة العربية الفصحى.
- إذا سألك الطالب عن سؤال محدد، اشرح له السبب خطوة بخطوة ولماذا الخيار الصحيح هو كذا.
- السياق الدراسي الحالي للمستخدم إن وجد: ${currentCourseTitle || 'منصة APEX العامة'}.
- كن مشجعاً، موجزاً وواضحاً واستخدم علامات توضيحية خفيفة وقوائم منظمة.`;

    // Map history to contents
    const contents: any[] = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || 'عذراً، لم أستطع إيجاد إجابة دقيقة.' });
  } catch (err: any) {
    console.error('Gemini Chat error:', err);
    res.status(500).json({
      error: 'حدث خطأ أثناء التواصل مع نموذج الذكاء الاصطناعي',
      details: err.message,
    });
  }
});

// 10. GEMINI IMAGE ANALYSIS (Multimodal problem solver)
app.post('/api/gemini/analyze-image', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', prompt = 'اشرح وحل السؤال الموجود في هذه الصورة بدقة خطوة بخطوة مع توضيح القاعدة.' } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'بيانات الصورة مطلوبة' });
  }

  const ai = getGemini();
  if (!ai) {
    return res.json({
      analysis: 'تم استلام الصورة بنجاح. لتحليل السؤال باستخدام Gemini الذكي، يرجى التأكد من ضبط GEMINI_API_KEY في الإعدادات.',
    });
  }

  try {
    // Strip data url prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `أنت خبير أكاديمي في منصة APEX التعليمية. قم بتحليل الصورة المرفقة (قد تكون سؤال امتحان، مسألة رياضيات، أو صفحة من كتاب):
${prompt}
- استخرج نص السؤال بدقة.
- قدّم الحل الصحيح النهائي بوضوح.
- اشرح خطوة بخطوة سبب هذا الحل والقاعدة المطبقة.
- أشر إلى الأفخاخ الشائعة التي قد يقع فيها الطلاب.`,
            },
          ],
        },
      ],
    });

    res.json({ analysis: response.text || 'لم يتم استخراج محتوى نصي من الصورة.' });
  } catch (err: any) {
    console.error('Gemini Image Analysis error:', err);
    res.status(500).json({
      error: 'حدث خطأ أثناء تحليل الصورة',
      details: err.message,
    });
  }
});

// ============================================
// VITE MIDDLEWARE OR STATIC SERVE
// ============================================
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`APEX Platform Server running on http://localhost:${PORT}`);
  });
}

start();
