import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/components/auth/AuthProvider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, MapPin, Link as LinkIcon, Mail, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react'; // Added import for useState

export default function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false); // Added state for settings modal

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/profile/${username}`);
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      return res.json();
    },
    enabled: !!username
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
        {user?.username === profile.username && (
          <Button 
            variant="outline" 
            size="sm"
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={() => {
              setSettingsOpen(true);
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Profili Düzenle
          </Button>
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg -mt-24 p-6 relative">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-3xl">{profile.displayName?.[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{profile.displayName}</h1>
                    <p className="text-gray-500">@{profile.username}</p>
                  </div>
                </div>

                {profile.bio && (
                  <p className="mt-4 text-gray-700 leading-relaxed">{profile.bio}</p>
                )}

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    <span>{new Date(profile.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} tarihinde katıldı</span>
                  </div>

                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-blue-500" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <a 
                        href={`mailto:${profile.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {profile.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Forum İstatistikleri</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Konular</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mesajlar</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beğeniler</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Placeholder for settings modal - needs implementation */}
      {settingsOpen && <div>Settings Modal (Implementation Needed)</div>}
    </div>
  );
}