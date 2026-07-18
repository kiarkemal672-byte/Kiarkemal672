/telegram-advanced
|-- /backend
|   |-- /src
|   |   |-- /models        # نماذج قاعدة البيانات
|   |   |-- /controllers   # منطق العمل (APIs)
|   |   |-- /services      # الخدمات الذكية (AI, Scheduler)
|   |   |-- /config        # إعدادات قاعدة البيانات
|   |   |-- server.js      # نقطة البداية والـ WebSockets
|   |-- package.json
|   |-- .env
|-- /frontend
|   |-- /src
|   |   |-- /components    # مكونات الواجهة (Glassmorphism)
|   |   |-- /hooks         # React Hooks للـ WebSockets
|   |   |-- App.jsx        # الواجهة الرئيسية
|   |   |-- index.css      # تصميم Glassmorphism و OLED Dark
|   |-- package.json
