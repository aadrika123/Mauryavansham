// src/lib/cloudinary-config.ts
import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dgwhhrsfh",
  api_key: process.env.CLOUDINARY_API_KEY || "838727422813134", 
  api_secret: process.env.CLOUDINARY_API_SECRET || "1sLYD4CewqXRXki3Oy52wEWLebA",
};

cloudinary.config(cloudinaryConfig);

export { cloudinary, cloudinaryConfig };