import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import CommunityMemberPage from './communityMemberPage';

export default async function CommunityIndex() {
  // Session check is optional since CommunityMemberPage uses useSession internally
  await getServerSession(authOptions);

  return <CommunityMemberPage />;
}
