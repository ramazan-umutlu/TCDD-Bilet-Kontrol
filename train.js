const axios = require("axios");
const cron = require("node-cron");

const url = "https://api-yebsp.tcddtasimacilik.gov.tr/vagon/vagonBosYerSorgula";

const headers = {
  Accept: "*/*",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
  Authorization: "Basic ZGl0cmF2b3llYnNwOmRpdHJhMzQhdm8u",
  Connection: "keep-alive",
  "Content-Type": "application/json",
  Origin: "https://bilet.tcdd.gov.tr",
  Referer: "https://bilet.tcdd.gov.tr/",
  "Sec-Ch-Ua":
    '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
};

const payload = {
  binisIstId: 234516254, // Bindiğiniz İstasyonun ID'si
  dil: 0,
  inisIstId: 15917435912, // İneceğiniz İstasyonun ID'si
  kanalKodu: "3",
  seferBaslikId: 43855247423, // Sefer ID'si
};

let sonMesaj = "";
let sonMesajZamanDamgasi = 0;
let istekSayisi = 0;

async function koltukKontrol() {
  istekSayisi++;
  console.log(`İstek gönderiliyor #${istekSayisi}`);

  try {
    const response = await axios.post(url, payload, { headers });

    const data = response.data;
    let bosYerVar = false;
    let mesaj = "";

    data.vagonBosYerList.forEach((vagon) => {
      if (vagon.bosYer > 0) {
        console.log(
          `Vagon No: ${vagon.vagonSiraNo}, Boş Yer: ${vagon.bosYer}`
        );
        if (!(vagon.vagonSiraNo === 4 && vagon.bosYer === 2)) {
          mesaj += `Vagon No: ${vagon.vagonSiraNo}, Boş Yer: ${vagon.bosYer}\n`;
          bosYerVar = true;
        }
      }
    });

    const suAnkiZaman = Date.now();
    if (
      bosYerVar &&
      (mesaj !== sonMesaj || suAnkiZaman - sonMesajZamanDamgasi > 3600000)
    ) {
      slackBildirimGonder(mesaj);
      sonMesaj = mesaj;
      sonMesajZamanDamgasi = suAnkiZaman;
    }
  } catch (error) {
    console.error("Koltuk kontrol edilirken hata oluştu:", error);
  }
}

async function slackBildirimGonder(mesaj) {
  const slackWebhookUrl = "webhook_url";
  const slackMesaj = {
    text: mesaj,
  };

  try {
    const response = await axios.post(slackWebhookUrl, slackMesaj);
    console.log("Slack bildirimi gönderildi:", response.data);
  } catch (error) {
    console.error("Slack bildirimi gönderilirken hata oluştu:", error);
  }
}

// Koltuk kontrol fonksiyonunu her 3 dakikada bir çalıştır
cron.schedule("*/3 * * * *", () => {
  console.log("Koltuklar kontrol ediliyor...");
  koltukKontrol();
});
