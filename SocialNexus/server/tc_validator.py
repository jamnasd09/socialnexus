import requests
from bs4 import BeautifulSoup
import json
import sys

def validate_tc_identity(tc_no, first_name, last_name, year_of_birth):
    """
    TC kimlik numarası doğrulama fonksiyonu.
    E-Devlet sistemine bağlanarak TC kimlik numarası doğrulaması yapar.
    
    Args:
        tc_no (str): TC Kimlik numarası
        first_name (str): Adı
        last_name (str): Soyadı
        year_of_birth (int/str): Doğum yılı
    
    Returns:
        bool: Doğrulama başarılı ise True, değilse False
    """
    print(f"TC kimlik doğrulama başlatıldı: {tc_no}, {first_name}, {last_name}, {year_of_birth}")
    
    try:
        # TC kimlik numarası algoritma kontrolü
        if not validate_tc_algorithm(tc_no):
            print("TC kimlik algoritma kontrolü başarısız oldu")
            return False
            
        # Resmi doğrulama için NVI (Nüfus ve Vatandaşlık İşleri) servisi URL'i
        url = "https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx"
        print(f"Servis URL: {url}")
        
        # XML SOAP request hazırlığı
        soap_request = f"""<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <TCKimlikNoDogrula xmlns="http://tckimlik.nvi.gov.tr/WS">
      <TCKimlikNo>{tc_no}</TCKimlikNo>
      <Ad>{first_name.upper()}</Ad>
      <Soyad>{last_name.upper()}</Soyad>
      <DogumYili>{year_of_birth}</DogumYili>
    </TCKimlikNoDogrula>
  </soap:Body>
</soap:Envelope>"""
        
        print("SOAP isteği hazırlandı")
        
        # SOAP isteği için headers
        headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'http://tckimlik.nvi.gov.tr/WS/TCKimlikNoDogrula'
        }
        
        # SOAP isteği gönderimi
        print("SOAP isteği gönderiliyor...")
        
        response = requests.post(url, data=soap_request.encode('utf-8'), headers=headers, timeout=10)
        
        print(f"Yanıt alındı: HTTP {response.status_code}")
        
        # Yanıt kontrolü
        if response.status_code == 200:
            print("Yanıt başarılı (200 OK)")
            print(f"Yanıt içeriği: {response.text}")
            
            # XML yanıtını parse et
            soup = BeautifulSoup(response.content, 'lxml-xml')
            print(f"BeautifulSoup ile yanıt parse edildi: {soup}")
            
            result_node = soup.find('TCKimlikNoDogrulaResult')
            print(f"Bulunan sonuç elementi: {result_node}")
            
            if result_node and result_node.text.lower() == 'true':
                print("TC kimlik doğrulama başarılı: NVI servisi doğruladı")
                return True
            else:
                result_text = result_node.text if result_node else 'Sonuç bulunamadı'
                print(f"TC kimlik doğrulama sonucu: {result_text}")
                return False
        else:
            print(f"TC kimlik doğrulama servis hatası: HTTP {response.status_code}")
            print(f"Yanıt içeriği: {response.text}")
            return False
    except Exception as e:
        print(f"TC kimlik doğrulama hatası: {str(e)}")
        print(f"Hata tipi: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return False

def validate_tc_algorithm(tc_no):
    """
    TC kimlik numarası algoritması doğrulaması
    
    Args:
        tc_no (str): TC Kimlik numarası
    
    Returns:
        bool: Algoritma kontrolü başarılı ise True, değilse False
    """
    print(f"TC Kimlik No kontrolü yapılıyor: {tc_no}")
    
    if not tc_no.isdigit():
        print("TC Kimlik No sadece rakamlardan oluşmalıdır")
        return False
        
    if len(tc_no) != 11:
        print(f"TC Kimlik No 11 haneli olmalıdır, şu anki hane sayısı: {len(tc_no)}")
        return False
        
    if tc_no[0] == '0':
        print("TC Kimlik No 0 ile başlayamaz")
        return False
        
    digits = [int(d) for d in tc_no]
    
    # Algoritma kontrolü:
    # 1. 1, 3, 5, 7, 9. hanelerin toplamının 7 katından 2, 4, 6, 8. hanelerin toplamını çıkardığımızda
    #    10'a bölümünden kalan 10. haneyi verir.
    # 2. İlk 10 hanenin toplamının 10'a bölümünden kalan 11. haneyi verir.
    
    odd_sum = sum(digits[0:9:2])  # 1,3,5,7,9. hanelerin toplamı
    even_sum = sum(digits[1:8:2]) # 2,4,6,8. hanelerin toplamı (ilk 9 haneden)
    
    tenth_digit = ((odd_sum * 7) - even_sum) % 10
    print(f"10. hane hesaplanan: {tenth_digit}, gerçek: {digits[9]}")
    
    if tenth_digit != digits[9]:
        print(f"TC Kimlik No 10. hane algoritma kontrolü başarısız: Hesaplanan {tenth_digit} != Gerçek {digits[9]}")
        return False
        
    # İlk 10 hanenin toplamının 10'a bölümünden kalan 11. haneyi verir.
    if sum(digits[:10]) % 10 != digits[10]:
        print("TC Kimlik No 11. hane algoritma kontrolü başarısız")
        return False
    
    print("TC Kimlik No algoritma kontrolü başarılı")
    return True

# Express.js uygulamasında kullanmak için basit JSON yanıt oluşturma fonksiyonu
def validate_and_get_json_response(tc_no, first_name, last_name, year_of_birth):
    """
    TC kimlik doğrulama işlemi yaparak JSON yanıt döndürür
    
    Args:
        tc_no (str): TC Kimlik numarası
        first_name (str): Adı
        last_name (str): Soyadı
        year_of_birth (int): Doğum yılı
    
    Returns:
        str: JSON formatında doğrulama sonucu
    """
    is_valid = validate_tc_identity(tc_no, first_name, last_name, year_of_birth)
    
    result = {
        "success": is_valid,
        "message": "TC kimlik doğrulama başarılı" if is_valid else "TC kimlik doğrulama başarısız"
    }
    
    return json.dumps(result)

# Script'in terminal üzerinden çalıştırılması durumunda komut satırı argümanlarını kullan
if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Yetersiz argüman! Kullanım: python tc_validator.py <tc_no> <first_name> <last_name> <year_of_birth>")
        sys.exit(1)
        
    tc_no = sys.argv[1]
    first_name = sys.argv[2]
    last_name = sys.argv[3]
    year_of_birth = sys.argv[4]
    
    # Sonucu stdout'a yazdır
    result = validate_and_get_json_response(tc_no, first_name, last_name, year_of_birth)
    print(result)