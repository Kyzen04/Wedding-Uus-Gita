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
// KODE BARU: Logika RSVP & Tampil E-ID Card
// ==========================================
function handleRSVP(event) {
  event.preventDefault();
  
  const name = document.getElementById('rsvp-name').value;
  const attendance = document.getElementById('rsvp-attendance').value;
  const guests = document.getElementById('rsvp-guests').value;

  if (attendance === 'Yes') {
    // Memasukkan data tamu ke dalam E-ID Card
    document.getElementById('card-guest-name').innerText = name;
    document.getElementById('card-guest-count').innerText = guests;
    
    // Menampilkan Modal E-ID Card
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
