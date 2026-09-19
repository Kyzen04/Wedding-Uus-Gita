// ==========================================
// 1. PENGATURAN UTAMA & MUSIK
// ==========================================
function openInvitation() {
  const cover = document.getElementById('slide-1');
  if (cover) {
    cover.classList.add('cover-zoom-out');
    setTimeout(() => {
      cover.style.display = 'none';
    }, 800);
  }
  document.body.classList.remove('no-scroll');

  const music = document.getElementById('bg-music');
  if (music) {
    music.play().catch(e => console.log(e));
  }
}

function toggleMusic() {
  const music = document.getElementById('bg-music');
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Salin Nomor Rekening
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
let useFrontCamera = true;

const GOOGLE_DRIVE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxDIEXmnQPOtbTfjXbxDQKMlEtKCqUcGkpt0ox4dR8QR-my48M8gQqmEIw1a9XoxTP9/exec";

async function startCamera() {
  const video = document.getElementById('booth-video');
  const resultImg = document.getElementById('booth-result');
  const watermark = document.querySelector('.booth-watermark');
  
  const btnStart = document.getElementById('btn-start-cam');
  const btnSwitch = document.getElementById('btn-switch-cam');
  const btnCapture = document.getElementById('btn-capture');
  const btnRetake = document.getElementById('btn-retake');
  const btnDownload = document.getElementById('btn-download-photo');

  try {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
      video: { 
        facingMode: useFrontCamera ? 'user' : 'environment',
        width: { ideal: 1080 },
        height: { ideal: 1350 }
      },
      audio: false
    };

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = mediaStream;
    
    video.style.display = 'block';
    if (watermark) watermark.style.display = 'block';
    if (resultImg) resultImg.style.display = 'none';

    if (btnStart) btnStart.style.display = 'none';
    if (btnSwitch) btnSwitch.style.display = 'flex';
    if (btnCapture) btnCapture.style.display = 'flex';
    if (btnRetake) btnRetake.style.display = 'none';
    if (btnDownload) btnDownload.style.display = 'none';

  } catch (err) {
    alert("Gagal mengakses kamera. Pastikan izin kamera diizinkan di browser HP kamu.");
    console.error(err);
  }
}

function switchCamera() {
  useFrontCamera = !useFrontCamera; 
  startCamera(); 
}

function capturePhoto() {
  const video = document.getElementById('booth-video');
  const canvas = document.getElementById('booth-canvas');
  const resultImg = document.getElementById('booth-result');
  const watermark = document.querySelector('.booth-watermark');
  
  const btnSwitch = document.getElementById('btn-switch-cam');
  const btnCapture = document.getElementById('btn-capture');
  const btnRetake = document.getElementById('btn-retake');
  const downloadBtn = document.getElementById('btn-download-photo');

  if (!video.srcObject) return;

  canvas.width = video.videoWidth || 1080;
  canvas.height = video.videoHeight || 1350;
  const ctx = canvas.getContext('2d');

  if (useFrontCamera) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  ctx.fillStyle = "rgba(139, 38, 62, 0.9)";
  ctx.fillRect(40, canvas.height - 180, canvas.width - 80, 130);

  ctx.fillStyle = "#fef3d6";
  ctx.font = "26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✨ Happy Wedding ✨", canvas.width / 2, canvas.height - 130);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px 'Poppins', sans-serif";
  ctx.fillText("Uus & Gita", canvas.width / 2, canvas.height - 85);

  ctx.font = "24px sans-serif";
  ctx.fillText("02.10.2026", canvas.width / 2, canvas.height - 45);

  const dataURL = canvas.toDataURL('image/png');
  resultImg.src = dataURL;
  downloadBtn.href = dataURL;

  uploadPhotoToGoogleDrive(dataURL);

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
  }

  video.style.display = 'none';
  if (watermark) watermark.style.display = 'block'; 
  resultImg.style.display = 'block';

  if (btnSwitch) btnSwitch.style.display = 'none';
  if (btnCapture) btnCapture.style.display = 'none';
  if (btnRetake) btnRetake.style.display = 'inline-flex';
  if (downloadBtn) downloadBtn.style.display = 'inline-flex';
}

function uploadPhotoToGoogleDrive(base64Image) {
  if (!GOOGLE_DRIVE_WEB_APP_URL || GOOGLE_DRIVE_WEB_APP_URL.includes("URL_WEB_APP")) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `Photobooth-UusGita-${timestamp}.png`;

  const payload = {
    file: base64Image,
    filename: fileName
  };

  fetch(GOOGLE_DRIVE_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(error => console.error(error));
}

function retakePhoto() {
  startCamera();
}

// ==========================================
// 5. RSVP & E-ID CARD (TERINTEGRASI GOOGLE SHEETS)
// ==========================================
function handleRSVP(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('rsvp-name');
  const attendanceInput = document.getElementById('rsvp-attendance');
  const guestsInput = document.getElementById('rsvp-guests');
  const messageInput = document.getElementById('rsvp-message');

  const name = nameInput ? nameInput.value : "";
  const attendance = attendanceInput ? attendanceInput.value : "";
  const guests = guestsInput ? guestsInput.value : "1";
  const message = messageInput ? messageInput.value : "";

  if (GOOGLE_DRIVE_WEB_APP_URL && !GOOGLE_DRIVE_WEB_APP_URL.includes("URL_WEB_APP")) {
    const rsvpPayload = {
      name: name,
      attendance: attendance,
      guests: guests,
      message: message
    };

    fetch(GOOGLE_DRIVE_WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rsvpPayload)
    }).catch(error => console.error(error));
  }

  if (attendance === 'Yes' || attendance.includes('Hadir')) {
    const guestNameEl = document.getElementById('card-guest-name');
    const guestCountEl = document.getElementById('card-guest-count');
    const modalEl = document.getElementById('idcard-modal');

    if (guestNameEl) guestNameEl.innerText = name;
    if (guestCountEl) guestCountEl.innerText = guests;
    if (modalEl) modalEl.classList.add('active');
  } else {
    alert('Terima kasih atas ucapan dan konfirmasinya!');
  }
  
  const formEl = document.getElementById('rsvp-form');
  if (formEl) formEl.reset();
}

function closeModal() {
  const modalEl = document.getElementById('idcard-modal');
  if (modalEl) modalEl.classList.remove('active');
}

// ==========================================
// 6. INISIALISASI URL & NAVIGASI BAWAH
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName && document.getElementById('guest-name')) {
    document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
  }

  const navLinks = document.querySelectorAll('.bottom-nav .nav-item');
  const scrollContainer = document.querySelector('.scroll-container');
  const homeIcon = document.querySelector('.bottom-nav .nav-item[href="#slide-1"]');

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
