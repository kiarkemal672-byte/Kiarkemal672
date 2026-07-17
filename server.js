import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// هذا السطر هو السحر: يخبر السيرفر أن يفتح ملفات الموقع (index.html, style.css) مباشرة
app.use(express.static(__dirname));

// إعداد الاتصال بقاعدة بيانات Turso
const db = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  try {
    await db.execute("SELECT 1;");
    console.log("⚡ تم الاتصال بقاعدة بيانات Turso بنجاح!");
  } catch (error) {
    console.error("❌ فشل الاتصال:", error);
  }
}
initDatabase();

// تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
