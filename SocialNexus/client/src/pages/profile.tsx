import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { username } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: () => apiRequest('GET', `/api/profile/${username}`),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader className="flex items-center gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile not found</h1>
            <p className="text-gray-600">The requested profile could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback>{profile.displayName ? profile.displayName[0] : '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
            <p className="text-gray-600">@{profile.username}</p>
          </div>
        </CardHeader>
        <CardContent>
          {profile.bio && (
            <p className="text-gray-700">{profile.bio}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}