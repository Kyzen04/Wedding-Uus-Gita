// ==========================================
// 1. PENGATURAN UTAMA & MUSIK
// ==========================================
function openInvitation() {
  const cover = document.getElementById('slide-1');
  cover.classList.add('cover-zoom-out');
  document.body.classList.remove('no-scroll');

  const music = document.getElementById('bg-music');
  music.play().catch(e => console.log(e));

  setTimeout(() => {
    cover.style.display = 'none';
  }, 800);
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Salin Nomor Rekening SeaBank
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin!");
  });
}

// ==========================================
// 2. COUNTDOWN TIMER (02 OKTOBER 2026)
// ==========================================
const targetDate = new Date("Oct 2, 2026 08:00:00").getTime();

setInterval(function() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (document.getElementById("days")) {
    document.getElementById("days").innerText = days > 0 ? (days < 10 ? '0' + days : days) : '00';
    document.getElementById("hours").innerText = hours > 0 ? (hours < 10 ? '0' + hours : hours) : '00';
    document.getElementById("minutes").innerText = minutes > 0 ? (minutes < 10 ? '0' + minutes : minutes) : '00';
    document.getElementById("seconds").innerText = seconds > 0 ? (seconds < 10 ? '0' + seconds : seconds) : '00';
  }
}, 1000);

// ==========================================
// 3. EFEK HUJAN HATI BACKGROUND
// ==========================================
function createHeart() {
  const container = document.getElementById('hearts-container');
  if (!container) return;

  const heart = document.createElement('div');
  heart.classList.add('falling-heart');

  const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞', '💘', '🤎', '🤍'];
  heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];

  heart.style.left = Math.random() * 100 + 'vw';
  const size = Math.random() * 14 + 14;
  heart.style.fontSize = size + 'px';

  const duration = Math.random() * 4 + 3;
  heart.style.animationDuration = duration + 's';

  container.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

setInterval(createHeart, 350);

// ==========================================
// 4. FITUR PHOTOBOOTH, KAMERA & GOOGLE DRIVE
// ==========================================
let mediaStream = null;
let useFrontCamera = true; // Status awal pakai kamera depan (selfie)

// Masukkan link Web App Google Apps Script kamu di antara tanda kutip di bawah ini
const GOOGLE_DRIVE_WEB_APP_URL = "URL_WEB_APP_GOOGLE_DRIVE_KAMU_DISINI";

async function startCamera() {
  try {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: { facingMode: useFrontCamera ? 'user' : 'environment' },
      audio: false
    };

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.getElementById('booth-video');
    video.srcObject = mediaStream;
    
    document.getElementById('btn-start-cam').style.display = 'none';
    document.getElementById('btn-switch-cam').style.display = 'inline-block';
    document.getElementById('btn-capture').style.display = 'inline-block';
  } catch (err) {
    alert("Gagal mengakses kamera. Pastikan izin kamera diizinkan di browser HP kamu.");
    console.error(err);
  }
}

// Fungsi untuk memutar kamera (depan <-> belakang)
function switchCamera() {
  useFrontCamera = !useFrontCamera; 
  startCamera(); 
}

function capturePhoto() {
  const video = document.getElementById('booth-video');
  const canvas = document.getElementById('booth-canvas');
  const resultImg = document.getElementById('booth-result');
  const downloadBtn = document.getElementById('btn-download-photo');

  canvas.width = video.videoWidth || 400;
  canvas.height = video.videoHeight || 500;
  const ctx = canvas.getContext('2d');

  // Jika pakai kamera depan, balik gambar (mirror) supaya natural
  if (useFrontCamera) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  // Gambar hasil tangkapan kamera ke canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reset transformasi canvas agar stiker tidak ikut terbalik
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // Tambahkan Stiker / Watermark "Happy Wedding" di atas canvas secara otomatis
  ctx.fillStyle = "rgba(139, 38, 62, 0.9)";
  ctx.fillRect(20, canvas.height - 80, canvas.width - 40, 65);

  ctx.fillStyle = "#fef3d6";
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✨ Happy Wedding ✨", canvas.width / 2, canvas.height - 55);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("Uus & Gita", canvas.width / 2, canvas.height - 33);

  ctx.font = "12px sans-serif";
  ctx.fillText("02.10.2026", canvas.width / 2, canvas.height - 15);

  // Ubah hasil canvas ke format gambar (DataURL)
  const dataURL = canvas.toDataURL('image/png');
  resultImg.src = dataURL;
  downloadBtn.href = dataURL;

  // Kirim foto secara otomatis ke Google Drive di latar belakang
  uploadPhotoToGoogleDrive(dataURL);

  // Matikan kamera setelah dijepret
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }

  // Tampilkan hasil foto dan tombol download/ulang
  video.style.display = 'none';
  document.querySelector('.booth-watermark').style.display = 'none';
  resultImg.style.display = 'block';

  document.getElementById('btn-switch-cam').style.display = 'none';
  document.getElementById('btn-capture').style.display = 'none';
  document.getElementById('btn-retake').style.display = 'inline-block';
  downloadBtn.style.display = 'inline-block';
}

// Fungsi pengiriman data foto ke Google Drive
function uploadPhotoToGoogleDrive(base64Image) {
  if (!GOOGLE_DRIVE_WEB_APP_URL || GOOGLE_DRIVE_WEB_APP_URL.includes("URL_WEB_APP")) {
    console.log("Link Web App Google Drive belum diatur.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `Photobooth-UusGita-${timestamp}.png`;

  const payload = {
    file: base64Image,
    filename: fileName
  };

  fetch(GOOGLE_DRIVE_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors', // Mencegah masalah CORS pada browser
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    console.log("Foto berhasil dikirim ke Google Drive!");
  })
  .catch(error => {
    console.error("Gagal mengirim foto ke Google Drive:", error);
  });
}

function retakePhoto() {
  document.getElementById('booth-result').style.display = 'none';
  document.getElementById('booth-video').style.display = 'block';
  document.querySelector('.booth-watermark').style.display = 'block';

  document.getElementById('btn-retake').style.display = 'none';
  document.getElementById('btn-download-photo').style.display = 'none';
  
  startCamera();
}

// ==========================================
// 5. RSVP & E-ID CARD MODAL
// ==========================================
function handleRSVP(event) {
  event.preventDefault();
  
  const name = document.getElementById('rsvp-name').value;
  const attendance = document.getElementById('rsvp-attendance').value;
  const guests = document.getElementById('rsvp-guests').value;

  if (attendance === 'Yes') {
    document.getElementById('card-guest-name').innerText = name;
    document.getElementById('card-guest-count').innerText = guests;
    document.getElementById('idcard-modal').classList.add('active');
  } else {
    alert('Terima kasih atas ucapan dan konfirmasinya!');
  }
  
  document.getElementById('rsvp-form').reset();
}

function closeModal() {
  document.getElementById('idcard-modal').classList.remove('active');
}

// ==========================================
// 6. INISIALISASI URL & NAVIGASI BAWAH
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  // Ambil nama tamu dari parameter URL (?to=NamaTamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName && document.getElementById('guest-name')) {
    document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
  }

  // Pengaturan Navigasi Bawah
  const navLinks = document.querySelectorAll('.bottom-nav .nav-item');
  const scrollContainer = document.querySelector('.scroll-container');
  const homeIcon = document.querySelector('.bottom-nav .nav-item[href="#slide-1"]');

  // Khusus Ikon Rumah (Merestart Tampilan ke Cover Utama / Slide 1)
  if (homeIcon) {
    homeIcon.addEventListener('click', function(e) {
      e.preventDefault();
      
      const cover = document.getElementById('slide-1');
      if (cover) {
        cover.style.display = 'flex';
        cover.classList.remove('cover-zoom-out');
      }
      
      document.body.classList.add('no-scroll');
      
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'instant' });
      }
    });
  }

  // Untuk Menu Navigasi Lainnya
  navLinks.forEach(link => {
    if (link.getAttribute('href') === '#slide-1') return;

    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement && scrollContainer) {
        const topPos = targetElement.offsetTop - scrollContainer.offsetTop;
        scrollContainer.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    });
  });
});
