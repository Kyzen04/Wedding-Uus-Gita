// Buka Undangan & Play Musik
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

// Toggle Play / Pause Musik
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

// Countdown Timer menuju 02 Oktober 2026
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

// Logika Animasi Hujan Hati
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
// FITUR PHOTOBOOTH KAMERA (DEPAN / BELAKANG) & STIKER
// ==========================================
let mediaStream = null;
let useFrontCamera = true; // Status awal pakai kamera depan (selfie)

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
  useFrontCamera = !useFrontCamera; // Balik statusnya
  startCamera(); // Nyalakan ulang kamera dengan posisi baru
}

function capturePhoto() {
  const video = document.getElementById('booth-video');
  const canvas = document.getElementById('booth-canvas');
  const resultImg = document.getElementById('booth-result');
  const downloadBtn = document.getElementById('btn-download-photo');

  canvas.width = video.videoWidth || 400;
  canvas.height = video.videoHeight || 500;
  const ctx = canvas.getContext('2d');

  // Jika pakai kamera depan, balik gambar (mirror) supaya pas
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

function retakePhoto() {
  document.getElementById('booth-result').style.display = 'none';
  document.getElementById('booth-video').style.display = 'block';
  document.querySelector('.booth-watermark').style.display = 'block';

  document.getElementById('btn-retake').style.display = 'none';
  document.getElementById('btn-download-photo').style.display = 'none';
  
  startCamera();
}

// Logika RSVP & Tampil E-ID Card
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

// Otomatis Mengambil Nama Tamu dari Parameter URL (?to=NamaTamu)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName && document.getElementById('guest-name')) {
    document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
  }
});

// Auto Highlight Menu Navigasi Bawah Saat Di-scroll
const slides = document.querySelectorAll('.full-slide, .cover-section');
const navItems = document.querySelectorAll('.nav-item');

const scrollContainer = document.querySelector('.scroll-container');
if (scrollContainer) {
  scrollContainer.addEventListener('scroll', () => {
    let current = '';
    slides.forEach(slide => {
      const slideTop = slide.offsetTop;
      if (scrollContainer.scrollTop >= slideTop - 200) {
        current = slide.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });
}
