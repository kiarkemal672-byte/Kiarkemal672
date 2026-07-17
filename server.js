import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// إعداد الاتصال بقاعدة بيانات Turso
const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// اختبار الاتصال بقاعدة البيانات عند بدء التشغيل
async function initDatabase() {
  try {
    await db.execute("SELECT 1;");
    console.log("⚡ تم الاتصال بقاعدة بيانات Turso واختباره بنجاح!");
  } catch (error) {
    console.error("❌ فشل الاتصال بقاعدة بيانات Turso:", error);
  }
}
initDatabase();

// مسار رئيسي (Route) لتبقي السيرفر يعمل دون توقف كموقع ويب
app.get('/', (req, res) => {
  res.send('<h1>الموقع يعمل بنجاح متصلاً بقاعدة البيانات! 🚀</h1>');
});

// تشغيل السيرفر والاستماع للمنفذ المطلوب
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
