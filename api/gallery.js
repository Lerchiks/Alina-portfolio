// import { v2 as cloudinary } from 'cloudinary';

// export default async function handler(req, res) {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true 
//   });

//   const FOLDER = "AlinaGallery";

//   try {
//     // Убрали type: 'upload', оставили только префикс папки
//     const result = await cloudinary.api.resources({
//       prefix: FOLDER,
//       max_results: 100,
//       // Добавляем context: true, если вдруг ты хранишь описания в метаданных
//     });

//     // Подготовка оптимизированных данных
//     const images = result.resources.map(img => {
//       // Генерируем URL с авто-форматом и качеством
//       const optimizedUrl = img.secure_url.replace(
//         '/upload/', 
//         '/upload/f_auto,q_auto,w_800,c_limit/'
//       );
      
//       return {
//         url: optimizedUrl,
//         public_id: img.public_id,
//         width: img.width,
//         height: img.height
//       };
//     });

//     // Кэширование для Vercel (Edge Network)
//     res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
//     return res.status(200).json({ images });

//   } catch (err) {
//     console.error("Cloudinary Error:", err);
//     return res.status(500).json({ error: err.message });
//   }
// }

import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

  try {
    // ТЕСТ 1: Пробуем найти вообще всё в аккаунте (без папок)
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 50 
    });

    // ТЕСТ 2: Логируем все папки, которые реально существуют
    const folders = await cloudinary.api.root_folders();

    console.log("Всего файлов найдено:", result.resources.length);
    console.log("Список папок в аккаунте:", folders.folders.map(f => f.name));

    // Возвращаем список файлов, чтобы вы увидели их пути в консоли браузера
    const images = result.resources.map(img => ({
      url: img.secure_url,
      full_path: img.public_id // Это покажет, в какой он папке на самом деле
    }));

    return res.status(200).json({ 
      images, 
      debug_folders: folders.folders.map(f => f.name) 
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}