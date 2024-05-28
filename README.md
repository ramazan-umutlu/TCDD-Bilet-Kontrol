# TCDD-Bilet-Kontrol

Node.js ile TCDD API'si üzerinden tren bileti sorgulaması yapan ve sonuçları Slack kanalına bildiren bot.

## Özellikler

- TCDD API'si kullanarak belirli bir sefer için boş koltukları sorgular.
- Boş koltuk bulunduğunda, detayları Slack kanalına bildirir.
- Koltuk durumu her 3 dakikada bir otomatik olarak kontrol edilir.

## Kullanım

1. **Gerekli Bilet ID'lerini Almak**:
   - [TCDD Bilet Sitesi](https://bilet.tcdd.gov.tr/) adresine gidin.
   - İlgili bileti sorguladıktan sonra tarayıcınızın geliştirici araçlarını açın (F12 tuşuna basarak).
   - Network sekmesinde ilgili isteği bulun ve ID'leri alın.

2. **Proje Kurulumu**:
   - Bu projeyi bilgisayarınıza klonlayın:
     ```sh
     git clone https://github.com/kullanici-adi/TCDD-Bilet-Kontrol.git
     cd TCDD-Bilet-Kontrol
     ```
   - Gerekli paketleri yükleyin:
     ```sh
     npm install
     ```

3. **Slack Webhook URL'sini Ayarlayın**:
   - `slackWebhookUrl` değişkenine kendi Slack webhook URL'nizi ekleyin.
   - Slack'ta bir webhook URL'si oluşturmak için [bu rehberi](https://api.slack.com/messaging/webhooks) takip edebilirsiniz.

4. **Botu Çalıştırın**:
   ```sh
   node app.js
    ```

## Yapılandırma
payload içinde yer alan binisIstId, inisIstId ve seferBaslikId alanlarını kendi sorgulamalarınıza uygun şekilde güncelleyin.
