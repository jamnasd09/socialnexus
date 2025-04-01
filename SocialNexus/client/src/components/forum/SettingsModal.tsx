
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '../auth/AuthProvider';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsModal({ 
  open, 
  onClose 
}: { 
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const deleteAccount = async () => {
    try {
      await apiRequest('DELETE', '/api/users/me');
      toast({
        title: "Hesap silindi",
        description: "Hesabınız başarıyla silindi.",
      });
      logout();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Hesap silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-orange-100 to-blue-100 max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">Ayarlar</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label>Profil Fotoğrafı</Label>
                <div className="flex space-x-2">
                  <Input type="file" accept="image/*" className="w-full" />
                  <Button variant="secondary" size="sm">Yükle</Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Görünen Ad</Label>
                <Input id="displayName" defaultValue={user?.displayName} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Hakkımda</Label>
                <Input id="bio" placeholder="Kendinizden bahsedin..." />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>E-posta Bildirimleri</Label>
                  <div className="text-sm text-muted-foreground">
                    Yeni mesajlar ve güncellemeler hakkında bildirim alın
                  </div>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Özel Mesaj Bildirimleri</Label>
                  <div className="text-sm text-muted-foreground">
                    Özel mesajlar için bildirim alın
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-700">TC Kimlik Durumu:</span>
                <Badge className={user?.tcVerified ? "bg-green-500" : "bg-orange-500"}>
                  {user?.tcVerified ? "Onaylı Üye" : "Onaylanmamış Üye"}
                </Badge>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Hesabı Sil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hesabınızı silmek istediğinizden emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount} className="bg-red-500 hover:bg-red-600">
                      Hesabı Sil
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
