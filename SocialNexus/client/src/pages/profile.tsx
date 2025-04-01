
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
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-white shadow-lg">
        <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-t-lg" />
        <CardHeader className="relative">
          <div className="absolute -top-16 left-6 flex items-end gap-6">
            <Avatar className="h-32 w-32 ring-4 ring-white">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.displayName ? profile.displayName[0] : '?'}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
              <p className="text-gray-600">@{profile.username}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-20">
          {profile.bio && (
            <p className="text-gray-700 mb-6">{profile.bio}</p>
          )}
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
