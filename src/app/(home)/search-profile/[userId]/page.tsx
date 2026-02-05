// import { getProfileById } from "@/src/features/searchProfile/actions/getProfileById"
import { notFound } from 'next/navigation';
// import ProfileDetailView from "./profile-detail-view"
import { getProfileById } from '@/src/features/searchProfile/actions/getProfileById';
import ProfileDetailView from './profileViewDetails';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const result = await getProfileById(params.userId);
  console.log('ProfilePage result:', result);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ProfileDetailView profile={result.data} />;
}
