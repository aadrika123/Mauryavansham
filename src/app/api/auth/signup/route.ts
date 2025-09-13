import { type NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { db } from "@/src/drizzle/db";
import { users } from "@/src/drizzle/db/schemas/users.schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/src/lib/email";
import { sendWhatsAppMessage } from "@/src/lib/whatsapp";
import { notifications } from "@/src/drizzle/schema";
import { sendAdminSignupEmail } from "@/src/lib/sendAdminSignupEmail";

export async function POST(request: NextRequest) {
  try {
    // const { name, email, password, phone, fatherName, city, state } =
    const {
      name,
      email,
      password,
      phone,
      fatherName,
      motherName,
      address,
      city,
      state,
      country,
      zipCode,
      currentAddress,
      currentCity,
      currentState,
      currentCountry,
      currentZipCode,
    } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        fatherName,
        motherName,
        address,
        city,
        state,
        country,
        zipCode,
        currentAddress,
        currentCity,
        currentState,
        currentCountry,
        currentZipCode,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        fatherName: users.fatherName,
        motherName: users.motherName,
        city: users.city,
        state: users.state,
        address: users.address,
        currentAddress: users.currentAddress,
        currentCity: users.currentCity,
        currentState: users.currentState,
        currentZipCode: users.currentZipCode,
      });

    // ✅ Insert notification for admins
    const [notification] = await db
      .insert(notifications)
      .values({
        type: "signup",
        message: `New user signed up: ${newUser[0].name} (${newUser[0].email})`,
        userId: newUser[0].id,
      })
      .returning();

    // ✅ Emit real-time notification to admins
    const io = (request as any)?.socket?.server?.io;
    if (io) {
      io.emit("new-notification", {
        id: notification.id,
        message: notification.message,
        type: notification.type,
      });
    }

    // Send welcome email
    try {
      const emailResult = await sendWelcomeEmail({
        name: newUser[0].name,
        email: newUser[0].email,
        password, // original password in plain text
      });

      console.log("Welcome email send result:", emailResult);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }
    // ✅ Send WhatsApp & email message to all ADMINS & SUPERADMINS
    const adminUsers = await db.query.users.findMany({
      where: (u, { inArray }) => inArray(u.role, ["admin", "superAdmin"]),
    });

    for (const admin of adminUsers) {
      // if (admin.phone) {
      //   try {
      //     await sendWhatsAppMessage(admin.phone, newUser[0]);
      //     console.log(`📱 WhatsApp sent to admin ${admin.name}`);
      //   } catch (waError) {
      //     console.error("❌ Error sending WhatsApp to admin:", waError);
      //   }
      // }
      if (admin.email) {
        await sendAdminSignupEmail(admin.email, newUser[0]);
      }
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
