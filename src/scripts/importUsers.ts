import * as XLSX from "xlsx";
import { users } from "../drizzle/schema";
import { db } from "../drizzle/db";
import bcrypt from "bcryptjs";

// Utility: password generate karega e.g. "Akshay@123"
const generatePassword = (name: string) => {
  const firstName = name.split(" ")[0] || "User";
  return `${firstName}@123`;
};

const importUsers = async () => {
  try {
    // 1️⃣ Excel file read karo
    const workbook = XLSX.readFile("Mauryavansham User.xlsx");
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${rows.length} rows`);

    for (const row of rows) {
      const plainPassword = generatePassword(row.name);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // 2️⃣ Insert into users
      await db.insert(users).values({
        name: row.name,
        email: row.email,
        phone: row.phone,
        gender: row.gender,
        address: row.address,
        city: row.city,
        state: row.state,
        country: row.country,
        zipCode: row.pin_code,
        fatherName: row.father_name,
        motherName: row.mother_name,
        currentAddress: row.current_address,
        currentCity: row.current_city,
        currentState: row.current_state,
        currentCountry: row.current_country,
        currentZipCode: row.current_pin_code,
        password: hashedPassword,
        isVerified: false,
        isActive: true,
        status: "pending",
      });

      console.log(`✅ Inserted user: ${row.name} (${row.email})`);
    }

    console.log("🎉 Import completed successfully!");
  } catch (err) {
    console.error("❌ Error importing users:", err);
  }
};

importUsers();
// ts-node importUsers.ts
// npx tsx importUsers.ts
