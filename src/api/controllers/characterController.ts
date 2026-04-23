import { Request, Response } from 'express';
import { db } from '../db';
import fs from 'fs';
import path from 'path';

/**
 * Отримати список статичних ігрових даних D&D 2024 (класи, види тощо)
 */
export const listData = async (req: Request, res: Response) => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Read all individual JSON files
    const classes = JSON.parse(fs.readFileSync(path.join(dataDir, 'classes.json'), 'utf-8'));
    const subclasses = JSON.parse(fs.readFileSync(path.join(dataDir, 'subclasses.json'), 'utf-8'));
    const species = JSON.parse(fs.readFileSync(path.join(dataDir, 'species.json'), 'utf-8'));
    const backgrounds = JSON.parse(fs.readFileSync(path.join(dataDir, 'backgrounds.json'), 'utf-8'));
    const feats = JSON.parse(fs.readFileSync(path.join(dataDir, 'feats.json'), 'utf-8'));
    const spells = JSON.parse(fs.readFileSync(path.join(dataDir, 'spells.json'), 'utf-8'));

    const dbData = {
      classes,
      subclasses,
      species,
      backgrounds,
      feats,
      spells
    };

    res.json(dbData);
  } catch (error) {
    console.error('Помилка при отриманні ігрових даних:', error);
    res.status(500).json({ error: 'Внутрішня помилка сервера при отриманні довідників.' });
  }
};

/**
 * Створити нового персонажа в базі даних PostgreSQL
 */
export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, 
      classId, 
      speciesId, 
      backgroundId, 
      baseAbilities, 
      equipmentPackId 
    } = req.body;

    // Базова валідація
    if (!name || !classId || !speciesId || !backgroundId) {
      res.status(400).json({ error: 'Відсутні обов\'язкові поля для створення персонажа.' });
      return;
    }

    // Зберігаємо персонажа в консолідовану таблицю (використовуючи JSONB для гнучких властивостей, таких як baseAbilities)
    const insertQuery = `
      INSERT INTO characters (name, class_id, species_id, background_id, base_abilities, equipment_pack_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;
    const values = [name, classId, speciesId, backgroundId, JSON.stringify(baseAbilities), equipmentPackId];

    // Примітка: Цей запит впаде, якщо таблиці "characters" ще не існує. Вам потрібно створити її за схемою.
    const result = await db.query(insertQuery, values);

    res.status(201).json({ 
      message: 'Персонаж успішно створений!', 
      character: result.rows[0] 
    });
  } catch (error: any) {
    console.error('Помилка при створенні персонажа:', error);
    if (error.code === 'ECONNREFUSED') {
       res.status(503).json({ error: 'База даних PostgreSQL недоступна. Перевірте зʼєднання (DATABASE_URL).' });
    } else {
       res.status(500).json({ error: 'Помилка бази даних при збереженні персонажа.' });
    }
  }
};

/**
 * Отримати існуючого персонажа за ID
 */
export const getCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const query = `SELECT * FROM characters WHERE id = $1;`;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Персонажа не знайдено.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(`Помилка при отриманні персонажа ${req.params.id}:`, error);
    res.status(500).json({ error: 'Не вдалося завантажити лист персонажа.' });
  }
};

/**
 * Оновити існуючого персонажа (зміна рівня, перерозподіл характеристик тощо)
 */
export const updateCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { level, baseAbilities, currentHp } = req.body;

    const query = `
      UPDATE characters
      SET 
        level = COALESCE($1, level),
        base_abilities = COALESCE($2, base_abilities::jsonb),
        current_hp = COALESCE($3, current_hp),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    
    // Передаємо значення, якщо вони були надіслані, або null (COALESCE ігнорує null)
    const values = [
      level || null,
      baseAbilities ? JSON.stringify(baseAbilities) : null,
      currentHp !== undefined ? currentHp : null,
      id
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Персонажа для оновлення не знайдено.' });
      return;
    }

    res.json({
      message: 'Персонажа успішно оновлено.',
      character: result.rows[0]
    });
  } catch (error) {
    console.error(`Помилка при оновленні персонажа ${req.params.id}:`, error);
    res.status(500).json({ error: 'Помилка бази даних при оновленні.' });
  }
};
