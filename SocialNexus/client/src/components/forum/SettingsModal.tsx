
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '../auth/AuthProvider';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
      <DialogContent className="bg-gradient-to-br from-orange-100 to-blue-100 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-600">Ayarlar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Hesap Durumu</h3>
            <div className="flex items-center gap-2">
              <span className="text-gray-700">TC Kimlik Durumu:</span>
              <Badge className={user?.tcVerified ? "bg-green-500" : "bg-orange-500"}>
                {user?.tcVerified ? "Onaylı Üye" : "Onaylanmamış Üye"}
              </Badge>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Hesap İşlemleri</h3>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
