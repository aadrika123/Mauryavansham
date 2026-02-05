// scripts/seedAdPlacements.ts
import { db } from '@/src/drizzle/db';
import { adPlacements } from '../drizzle/schema';
// import { adPlacements } from "@/src/drizzle/schema/adPlacements"

async function seed() {
  const placements = [
    { pageName: 'Home Page', sectionName: 'Top Banner', description: 'Banner at top of homepage' },
    { pageName: 'Home Page', sectionName: 'Sidebar', description: 'Sidebar ad on homepage' },
    { pageName: 'Listing Page', sectionName: 'Header', description: 'Header banner on listing pages' },
    { pageName: 'Listing Page', sectionName: 'Footer', description: 'Footer banner on listing pages' },
    { pageName: 'Profile Page', sectionName: 'Sidebar', description: 'Sidebar ad on profile page' }
  ];

  for (const p of placements) {
    await db.insert(adPlacements).values(p);
  }

  console.log('Ad placements seeded!');
}

seed()
  .catch(err => console.error(err))
  .finally(() => process.exit());
