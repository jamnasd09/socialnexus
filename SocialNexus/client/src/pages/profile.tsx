
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, Link as LinkIcon, Mail } from 'lucide-react';

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
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Profil bulunamadı</h1>
            <p className="text-gray-600">İstenen profil bulunamadı.</p>
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
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile.displayName}</h1>
                <p className="text-gray-600">@{profile.username}</p>
              </div>
              <Button variant="outline">Düzenle</Button>
            </div>
            {profile.bio && (
              <p className="mt-2 text-gray-700">{profile.bio}</p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDays className="h-4 w-4" />
              <span>Katılım: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
            {profile.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <LinkIcon className="h-4 w-4" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {profile.website}
                </a>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${profile.email}`} className="hover:text-blue-600">{profile.email}</a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
