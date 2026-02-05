// utils/generateUserCode.ts
import { db } from '@/src/drizzle/db';
import { users } from '@/src/drizzle/db/schemas/users.schema';
import { eq, and, desc } from 'drizzle-orm';

// Custom state code map
const stateCodeMap: Record<string, string> = {
  'Andhra Pradesh': 'AP',
  'Arunachal Pradesh': 'AR',
  Assam: 'AS',
  Bihar: 'BR',
  Chhattisgarh: 'CG',
  Goa: 'GA',
  Gujarat: 'GJ',
  Haryana: 'HR',
  'Himachal Pradesh': 'HP',
  'Jammu and Kashmir': 'JK',
  Jharkhand: 'JH',
  Karnataka: 'KA',
  Kerala: 'KL',
  'Madhya Pradesh': 'MP',
  Maharashtra: 'MH',
  Manipur: 'MN',
  Meghalaya: 'ML',
  Mizoram: 'MZ',
  Nagaland: 'NL',
  Orissa: 'OR',
  Punjab: 'PB',
  Rajasthan: 'RJ',
  Sikkim: 'SK',
  'Tamil Nadu': 'TN',
  Tripura: 'TR',
  Uttarakhand: 'UK',
  'Uttar Pradesh': 'UP',
  'West Bengal': 'WB',
  Delhi: 'DL',
  'Andaman and Nicobar Islands': 'AN',
  Chandigarh: 'CH',
  'Dadra and Nagar Haveli': 'DH',
  'Daman and Diu': 'DD',
  Lakshadweep: 'LD',
  Pondicherry: 'PY'
};

// Gender code map
const genderCodeMap: Record<string, string> = {
  Male: 'M',
  Female: 'F',
  Transgender: 'O'
};

export async function generateUserCode(state: string, gender: string) {
  if (!state || !gender) throw new Error('State and Gender are required');

  const stateCode = stateCodeMap[state];
  const genderCode = genderCodeMap[gender];
  if (!stateCode || !genderCode) throw new Error('Invalid state or gender');

  // Find last inserted user for this state+gender
  const lastUser = await db
    .select()
    .from(users)
    .where(and(eq(users.state, state), eq(users.gender, gender)))
    .orderBy(desc(users.userCode))
    .limit(1);

  let nextNumber = 1;
  if (lastUser.length > 0 && lastUser[0].userCode) {
    const parts = lastUser[0].userCode.split('-');
    const lastNum = parseInt(parts[2], 10);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  const padded = String(nextNumber).padStart(6, '0');
  return `${stateCode}-${genderCode}-${padded}`;
}
