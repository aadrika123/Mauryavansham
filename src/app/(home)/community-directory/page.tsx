import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/lib/auth';
import CommunityMemberPage from './communityMemberPage';

export default async function CommunityIndex() {
  const session = await getServerSession(authOptions);

  return <CommunityMemberPage user={session?.user} />;
}
