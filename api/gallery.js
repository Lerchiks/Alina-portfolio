import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  // Конфигурация
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

  const FOLDER_NAME = "AlinaGallery";

  try {
    // Используем Search API, он лучше всего индексирует папки
    const result = await cloudinary.search
      .expression(`folder:${FOLDER_NAME}`)
      .sort_by('created_at', 'desc') // Новые фото будут первыми
      .max_results(500)
      .execute();

    // Превращаем результат в чистый список URL с оптимизацией
    const images = result.resources.map(img => ({
      // Делаем фото легкими (f_auto, q_auto) и ограничиваем размер (w_1200)
      url: img.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200,c_limit/'),
      public_id: img.public_id
    }));

    // Кэшируем ответ на 1 час, чтобы сайт летал
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json({ images });

  } catch (err) {
    console.error("Cloudinary Error:", err);
    return res.status(500).json({ error: "Ошибка Cloudinary: " + err.message });
  }
}