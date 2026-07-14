import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const db = createClient({
url: process.env.TURSO_CONNECTION_URL,
authToken: process.env.TURSO_AUTH_TOKEN,});
async function initDatabase() {
try {
await db.execute("SELECT 1;");
console.log("⚡ تم الاتصال بقاعدة بيانات Turso بنجاح واختباره بالكامل!");
} catch (error) {
console.error("❌ فشل الاتصال بـ Turso. يرجى التحقق من الروابط في ملف .env:", error.message);}
}initDatabase();
            