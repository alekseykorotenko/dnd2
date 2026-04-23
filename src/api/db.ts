import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Налаштування пулу підключень до бази даних PostgreSQL.
// У реальному середовищі переконайтеся, що DATABASE_URL встановлено у секретах / .env
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dnd2024';

export const db = new Pool({
  connectionString,
  // Для деяких хмарних БД (напр. Supabase/Neon) потрібен SSL:
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Тестування підключення відразу при старті (пасивно)
db.on('error', (err) => {
  console.error('Неочікувана помилка в базі даних на стороні сервера:', err);
});
