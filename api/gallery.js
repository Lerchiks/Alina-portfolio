  import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

  // Вставь сюда ID своей коллекции, который ты нашла в URL
  const COLLECTION_ID = "847e3689296261868901140ba6ad9748"; 

  try {
    // Получаем ресурсы из конкретной коллекции
    const result = await cloudinary.api.collection(COLLECTION_ID, {
      max_results: 100
    });

    if (!result.resources) {
      return res.status(200).json({ images: [] });
    }

    const images = result.resources.map(img => ({
      // Применяем ту же крутую оптимизацию
      url: img.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1000,c_limit/'),
      public_id: img.public_id
    }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ images });

  } catch (err) {
    console.error("Collection Error:", err);
    return res.status(500).json({ 
      error: "Не удалось загрузить коллекцию", 
      details: err.message 
    });
  }
}