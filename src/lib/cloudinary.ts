// src/lib/cloudinary-config.ts
import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "ded2rcrap",
  api_key: process.env.CLOUDINARY_API_KEY || "992267968189299", 
  api_secret: process.env.CLOUDINARY_API_SECRET || "bzWMEZGnqIovuyU0bQPuNKI-Y_A",
};

cloudinary.config(cloudinaryConfig);

export { cloudinary, cloudinaryConfig };