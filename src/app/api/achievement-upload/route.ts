import { type NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 🔒 1. Authentication Check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    // 📤 2. Extract File from FormData
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // 🧩 3. Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🗂️ 4. Cloudinary Folder
    const folder = "achievement-images";

    // ☁️ 5. Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: "image" },
          (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
          }
        );
        uploadStream.end(buffer);
      }
    );

    // ✅ 6. Return Response
    return NextResponse.json(
      {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Image upload failed" },
      { status: 500 }
    );
  }
}
