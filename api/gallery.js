import { v2 as cloudinary } from 'cloudinary';

// Выносим конфиг прямо внутрь хендлера для надежности
export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Добавьте это
  });

  const FOLDER = "AlinaGallery";

  // Логируем для отладки (эти логи вы увидите в панели Vercel -> Logs)
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,
      max_results: 100 
    });

    // Если всё ок, возвращаем данные
    return res.status(200).json({ 
      images: result.resources.map(img => ({ url: img.secure_url })) 
    });

  } catch (err) {
    console.error("Cloudinary Error:", err);
    // Возвращаем JSON даже при ошибке, чтобы фронтенд не падал с "Unexpected token A"
    return res.status(500).json({ error: err.message });
  }
}