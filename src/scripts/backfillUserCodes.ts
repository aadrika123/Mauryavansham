import { db } from '../drizzle/db';
import { users } from '../drizzle/db/schemas/users.schema';
import { eq, and } from 'drizzle-orm';

async function backfillUserCodes() {
  // 1️⃣ Fetch all users
  const allUsers = await db.select().from(users);

  // 2️⃣ State & Gender mappings
  const stateCodeMap: Record<string, string> = {
    Jharkhand: 'JH',
    Bihar: 'BR',
    'Uttar Pradesh': 'UP',
    'Madhya Pradesh': 'MP',
    Rajasthan: 'RJ',
    Delhi: 'DL',
    Karnataka: 'KA',
    Maharashtra: 'MH',
    'West Bengal': 'WB',
    'Tamil Nadu': 'TN'
    // Add other states/UTs here...
  };

  const genderCodeMap: Record<string, string> = {
    Male: 'M',
    Female: 'F',
    Transgender: 'O'
  };

  // 3️⃣ Sequence map in memory
  const sequenceMap: Record<string, number> = {};

  // 4️⃣ Precompute max sequence from DB for each state+gender
  for (const state in stateCodeMap) {
    for (const gender in genderCodeMap) {
      const lastUsers = await db
        .select()
        .from(users)
        .where(and(eq(users.state, state), eq(users.gender, gender)));

      let maxSeq = 0;
      for (const u of lastUsers) {
        if (u.userCode) {
          const parts = u.userCode.split('-');
          const seq = parseInt(parts[2], 10);
          if (!isNaN(seq)) maxSeq = Math.max(maxSeq, seq);
        }
      }

      const key = `${stateCodeMap[state]}-${genderCodeMap[gender]}`;
      sequenceMap[key] = maxSeq;
    }
  }

  // 5️⃣ Assign new codes to users missing userCode
  for (const user of allUsers) {
    if (!user.userCode && user.state && user.gender) {
      const stateCode = stateCodeMap[user.state];
      const genderCode = genderCodeMap[user.gender];
      if (!stateCode || !genderCode) continue;

      const key = `${stateCode}-${genderCode}`;
      sequenceMap[key] += 1;
      const code = `${stateCode}-${genderCode}-${String(sequenceMap[key]).padStart(6, '0')}`;

      try {
        await db.update(users).set({ userCode: code }).where(eq(users.id, user.id));
        console.log(`✅ Updated user ${user.id} with code ${code}`);
      } catch (err) {
        console.error(`❌ Failed to update user ${user.id} with code ${code}:`, err);
      }
    }
  }

  console.log('�� Backfill completed!');
  process.exit(0);
}

backfillUserCodes().catch(err => {
  console.error('❌ Error in backfill:', err);
  process.exit(1);
});
