// downloadHandler.js
async function downloadMedia(url) {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isTikTok = url.includes("tiktok.com");

  let apiURL = "";
  if (isYouTube) {
    apiURL = `https://restapi-v2.simplebot.my.id/download/ytdl?url=${encodeURIComponent(url)}`;
  } else if (isTikTok) {
    apiURL = `https://restapi-v2.simplebot.my.id/download/tiktok-v2?url=${encodeURIComponent(url)}`;
  } else {
    alert("URL tidak didukung");
    return;
  }

  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    if (!data.status) return alert("Gagal mengambil data");

    const item = {
      title: data.result.title,
      url: url,
      type: isYouTube ? 'YouTube' : 'TikTok',
      downloadedAt: new Date().toISOString(),
      media: isYouTube
        ? { mp4: data.result.mp4, mp3: data.result.mp3 }
        : {
            noWM: data.result.data.play,
            hd: data.result.data.hdplay,
            audio: data.result.data.music,
          }
    };

    saveToHistory(item);
    renderDownloadLinks(item);

  } catch (e) {
    console.error("Download error:", e);
    alert("Terjadi kesalahan.");
  }
}

function saveToHistory(item) {
  const history = JSON.parse(localStorage.getItem("downloadHistory")) || [];
  history.unshift(item);
  localStorage.setItem("downloadHistory", JSON.stringify(history));
}

function renderDownloadLinks(item) {
  const container = document.getElementById("download-results");
  container.innerHTML = `<h3>${item.title}</h3>`;
  if (item.type === "YouTube") {
    container.innerHTML += `
      <a href="${item.media.mp4}" download>Unduh MP4</a><br>
      <a href="${item.media.mp3}" download>Unduh MP3</a>
    `;
  } else {
    container.innerHTML += `
      <a href="${item.media.noWM}" download>Unduh Video (No Watermark)</a><br>
      <a href="${item.media.hd}" download>Unduh HD</a><br>
      <a href="${item.media.audio}" download>Unduh Audio</a>
    `;
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("downloadHistory")) || [];
  const list = document.getElementById("history");
  list.innerHTML = history.map(item => `
    <li>${item.type}: <strong>${item.title}</strong> - ${new Date(item.downloadedAt).toLocaleString()}</li>
  `).join("");
}
