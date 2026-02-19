import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

  const FOLDER = "Home/AlinaGallery";

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,
      max_results: 100 
    });

    // 1. Сначала подготавливаем данные
    const images = result.resources.map(img => {
      // Оптимизация: f_auto (формат), q_auto (сжатие), w_800 (ширина)
      const optimizedUrl = img.secure_url.replace(
        '/upload/', 
        '/upload/f_auto,q_auto,w_800,c_limit/'
      );
      
      return {
        url: optimizedUrl,
        public_id: img.public_id,
        width: img.width,
        height: img.height
      };
    });

    // 2. Добавляем кэширование (опционально, для скорости)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    // 3. Отправляем готовый массив
    return res.status(200).json({ images });

  } catch (err) {
    console.error("Cloudinary Error:", err);
    return res.status(500).json({ error: err.message });
  }
}