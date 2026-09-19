// Buka Undangan & Play Musik
function openInvitation() {
  const cover = document.getElementById('slide-1');
  cover.classList.add('cover-zoom-out');
  
  const bgMusic = document.getElementById('bg-music');
  bgMusic.play();
  
  document.body.classList.remove('no-scroll');
  createHearts();
}

// Toggle Music
function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  const btn = document.getElementById('music-btn');
  
  if (bgMusic.paused) {
    bgMusic.play();
    btn.innerHTML = '<i class="fa-solid fa-music"></i>';
  } else {
    bgMusic.pause();
    btn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
}

// Efek Love Berjatuhan
function createHearts() {
  const container = document.getElementById('hearts-container');
  const heartIcons = ['💖', '💕', '💗', '❤️', '🌸'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.classList.add('falling-heart');
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 10 + 15 + 'px';
    
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 5000);
  }, 400);
}

// Salin Rekening
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Nomor rekening berhasil disalin!');
  });
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

// Auto Ambil Nama Tamu dari URL (?to=NamaTamu)
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');
  if (guestName) {
    document.getElementById('guest-name').innerText = decodeURIComponent(guestName);
  }
});
