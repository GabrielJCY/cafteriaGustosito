import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error("Falta CLOUDINARY_CLOUD_NAME en .env.local");
}

if (!apiKey) {
  throw new Error("Falta CLOUDINARY_API_KEY en .env.local");
}

if (!apiSecret) {
  throw new Error("Falta CLOUDINARY_API_SECRET en .env.local");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export { cloudinary };