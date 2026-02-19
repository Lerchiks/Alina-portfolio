  import { v2 as cloudinary } from 'cloudinary';

  export default async function handler(req, res) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true 
    });

    try {
      // Используем SEARCH вместо обычного RESOURCES
      const result = await cloudinary.search
        .expression('folder:AlinaGallery') // Ищет всё в папке AlinaGallery
        .sort_by('created_at', 'desc')     // Сначала новые
        .max_results(100)
        .execute();

      const images = result.resources.map(img => ({
        url: img.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1000/'),
        public_id: img.public_id
      }));

      return res.status(200).json({ images });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }