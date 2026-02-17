import fetch from "node-fetch";

export default async function handler(req, res) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const FOLDER = "AlinaGallery";

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({ error: "Missing Cloudinary env variables" });
  }

  try {
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?prefix=${FOLDER}`,
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const data = await response.json();

    if (!data.resources) {
      return res.status(500).json({ error: "No resources returned from Cloudinary" });
    }

    const images = data.resources.map(img => img.secure_url);

    res.status(200).json({ images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch gallery from Cloudinary" });
  }
}
