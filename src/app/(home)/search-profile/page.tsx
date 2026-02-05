// import { getAllProfiles } from "@/src/features/searchProfile/actions"
import { getAllProfiles } from '@/src/features/searchProfile/actions/getAllProfiles';
import SearchProfilesClient from '@/src/app/(home)/search-profile/searchProfileClient';

export default async function SearchProfilePage() {
  const result = await getAllProfiles();
  console.log('SearchProfilePage result:', result);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-orange-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profiles</h1>
          <p className="text-gray-600">{result.message}</p>
        </div>
      </div>
    );
  }

  return <SearchProfilesClient initialProfiles={result.data?.profiles || []} />;
}
