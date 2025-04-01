
import React, { useState } from 'react';
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
import { Loader2, Upload, Trash2 } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function SettingsModal({ 
  open, 
  onClose 
}: { 
  open: boolean;
  onClose: () => void;
}) {
  const { user, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const { uploadFile, isUploading } = useFileUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [notifications, setNotifications] = useState({
    email: true,
    privateMessage: true,
    mentions: true,
    activitySummary: false
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const result = await uploadFile(file);
    if (result.success && result.fileUrl) {
      await updateProfile({ avatar: result.fileUrl });
      toast({
        title: "Profil fotoğrafı güncellendi",
        description: "Fotoğrafınız başarıyla yüklendi.",
      });
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ displayName, bio });
      toast({
        title: "Profil güncellendi",
        description: "Değişiklikleriniz kaydedildi.",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Profil güncellenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

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
      <DialogContent className="max-w-2xl w-full bg-gradient-to-br from-orange-100 to-blue-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">Profil Ayarları</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[600px] pr-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
              <TabsTrigger value="security">Güvenlik</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex flex-col items-center space-y-4 p-6 bg-white/50 backdrop-blur-sm rounded-lg">
                <div className="relative group">
                  <Avatar className="h-32 w-32 ring-4 ring-orange-200">
                    <AvatarImage src={previewUrl || user?.avatar} />
                    <AvatarFallback className="text-3xl">{user?.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full">
                    <label className="cursor-pointer p-2 hover:bg-white/20 rounded-full">
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      {isUploading ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Upload className="h-6 w-6 text-white" />
                      )}
                    </label>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Profil fotoğrafını değiştirmek için tıkla</p>
              </div>

              <div className="grid gap-6 p-6 bg-white/50 backdrop-blur-sm rounded-lg">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Görünen Ad</Label>
                  <Input 
                    id="displayName" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Hakkımda</Label>
                  <Textarea 
                    id="bio" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Kendinizden bahsedin..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button onClick={handleProfileUpdate}>Değişiklikleri Kaydet</Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bildirim Tercihleri</h3>
                  <Separator />
                  
                  {Object.entries({
                    email: "E-posta Bildirimleri",
                    privateMessage: "Özel Mesaj Bildirimleri",
                    mentions: "Bahsedilme Bildirimleri",
                    activitySummary: "Haftalık Aktivite Özeti"
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base">{label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {key === 'email' && "Yeni mesajlar ve güncellemeler hakkında bildirim alın"}
                          {key === 'privateMessage' && "Size gelen özel mesajlar için anında bildirim alın"}
                          {key === 'mentions' && "Birisi sizi etiketlediğinde bildirim alın"}
                          {key === 'activitySummary' && "Haftalık forum aktivitelerinizin özetini alın"}
                        </p>
                      </div>
                      <Switch 
                        checked={notifications[key as keyof typeof notifications]}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">TC Kimlik Durumu:</span>
                    <Badge className={user?.tcVerified ? "bg-green-500" : "bg-orange-500"}>
                      {user?.tcVerified ? "Onaylı Üye" : "Onaylanmamış Üye"}
                    </Badge>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-600">Tehlikeli Bölge</h3>
                    <p className="text-sm text-gray-600">
                      Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
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
                          <AlertDialogAction 
                            onClick={deleteAccount} 
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Hesabı Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
