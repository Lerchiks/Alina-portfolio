import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  // Настройка Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const FOLDER = "AlinaGallery";

  if (!process.env.CLOUDINARY_CLOUD_NAME || 
      !process.env.CLOUDINARY_API_KEY || 
      !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({ error: "Missing Cloudinary env variables" });
  }

  try {
    // Получаем список изображений из указанной папки
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,
      max_results: 500 // максимальное количество результатов
    });

    if (!result.resources || result.resources.length === 0) {
      return res.status(200).json({ images: [] });
    }

    // Форматируем результат - получаем массив URL с оптимизациями
    const images = result.resources.map(img => ({
      url: img.secure_url,
      public_id: img.public_id,
      width: img.width,
      height: img.height,
      format: img.format,
      created_at: img.created_at
    }));

    res.status(200).json({ 
      images,
      total: result.resources.length 
    });
    
  } catch (err) {
    console.error("Error fetching from Cloudinary:", err);
    res.status(500).json({ 
      error: "Cannot fetch gallery from Cloudinary", 
      details: err.message 
    });
  }
}