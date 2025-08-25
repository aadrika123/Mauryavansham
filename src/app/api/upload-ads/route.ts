import { type NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import sizeOf from "image-size";

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 🔒 Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📝 Get formData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please select an image file" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size should be less than 5MB" },
        { status: 400 }
      );
    }

    // 📦 Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 📏 Check dimensions
    const dimensions = sizeOf(buffer);
    if (!dimensions?.width || !dimensions?.height) {
      return NextResponse.json(
        { error: "Could not read image size" },
        { status: 400 }
      );
    }

    let folder = "ads-banners";
    let transformation: any[] = [];

    // 🖼 Decide based on aspect ratio
    if (dimensions.width > dimensions.height) {
      // Landscape → Large ad (900x300)
      transformation = [
        { width: 900, height: 300, crop: "fill" },
        { quality: "auto" },
        { format: "auto" },
      ];
      folder = "ads-banners/large";
    } else {
      // Portrait → Small ad (350x500)
      transformation = [
        { width: 350, height: 500, crop: "fill" },
        { quality: "auto" },
        { format: "auto" },
      ];
      folder = "ads-banners/small";
    }

    // ☁️ Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder, transformation },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
