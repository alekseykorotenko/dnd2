import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './src/api/routes/apiRoutes';
import dotenv from 'dotenv';

dotenv.config();

// Налаштування для ES Modules (оскільки "type": "module" в package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware для парсингу JSON у тілі запиту
  app.use(express.json());

  // 1. API Маршрути монтуються ПЕРШИМИ
  app.use('/api', apiRoutes);

  // 2. Vite Middleware для розробки (гаряче перевантаження та збірка UI)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // В продакшені роздаємо зібрані статичні файли з папки dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Запуск сервера виключно на порту 3000 (вимога платформи)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`D&D 2024 Сервер запущено на http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Помилка при запуску сервера:", err);
});
