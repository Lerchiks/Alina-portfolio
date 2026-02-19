import { v2 as cloudinary } from 'cloudinary';

export default async function handler(req, res) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true 
  });

  const FOLDER = 'alina_gallery/AlinaGallery'; // Убедись, что в Cloudinary папка называется именно так

  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: FOLDER,     // Ищем только файлы с префиксом папки
      max_results: 100,
      direction: 'desc'   // Новые фото будут в начале
    });

    // Формируем список оптимизированных ссылок
    const images = result.resources.map(img => ({
      url: img.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1000,c_limit/'),
      public_id: img.public_id
    }));

    // Кэширование для быстрой работы
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json({ images });

  } catch (err) {
    console.error("Cloudinary Folder Error:", err);
    return res.status(500).json({ error: err.message });
  }
}



// import { v2 as cloudinary } from 'cloudinary';

// export default async function handler(req, res) {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true 
//   });

//   try {
//     // ТЕСТ 1: Пробуем найти вообще всё в аккаунте (без папок)
//     const result = await cloudinary.api.resources({
//       type: 'upload',
//       max_results: 50 
//     });

//     // ТЕСТ 2: Логируем все папки, которые реально существуют
//     const folders = await cloudinary.api.root_folders();

//     console.log("Всего файлов найдено:", result.resources.length);
//     console.log("Список папок в аккаунте:", folders.folders.map(f => f.name));

//     // Возвращаем список файлов, чтобы вы увидели их пути в консоли браузера
//     const images = result.resources.map(img => ({
//       url: img.secure_url,
//       full_path: img.public_id // Это покажет, в какой он папке на самом деле
//     }));

//     return res.status(200).json({ 
//       images, 
//       debug_folders: folders.folders.map(f => f.name) 
//     });

//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// }