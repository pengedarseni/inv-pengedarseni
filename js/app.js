/* ==========================================================================
   UNDANGAN DIGITAL YUSUP & TIKA - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. URL Query Parameter Parsing for Guest Personalization (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('penerima');
  const guestNameCover = document.getElementById('guestNameCover');
  const guestNameInput = document.getElementById('wishesName');
  const guestShareInput = document.getElementById('guestNameGenerator');

  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam).trim();
    guestNameCover.textContent = formattedGuest;
    if (guestNameInput) guestNameInput.value = formattedGuest;
  }

  // 2. Interactive Cover Opening & Confetti
  const coverOverlay = document.getElementById('coverOverlay');
  const btnOpenInvitation = document.getElementById('btnOpenInvitation');

  btnOpenInvitation.addEventListener('click', () => {
    coverOverlay.classList.add('opened');
    
    // Play celebratory confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#B88E4F', '#E4CA99', '#FAF8F5', '#8F6A30']
      });
    }

    // Auto-start ambient audio
    startAudio();
  });

  // 3. Audio Player Engine (Web Audio API Synthesizer + Fallback MP3)
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let isPlaying = false;
  let audioContext = null;
  let synthInterval = null;

  function initWebAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported on this device', e);
    }
  }

  // Soothing chord progression for wedding ambient (Pachelbel-inspired warm piano/bell tones)
  const chords = [
    [261.63, 329.63, 392.00, 523.25], // C Major
    [196.00, 246.94, 293.66, 392.00], // G Major
    [220.00, 261.63, 329.63, 440.00], // A minor
    [164.81, 196.00, 246.94, 329.63], // E minor
    [174.61, 220.00, 261.63, 349.23], // F Major
    [130.81, 164.81, 196.00, 261.63], // C Major low
    [174.61, 220.00, 261.63, 349.23], // F Major
    [196.00, 246.94, 293.66, 392.00], // G Major
  ];

  let chordIndex = 0;

  function playAmbientNote(freq, delay = 0, duration = 3.5) {
    if (!audioContext || audioContext.state !== 'running') return;
    
    const now = audioContext.currentTime + delay;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  function playNextChord() {
    if (!isPlaying || !audioContext) return;
    const currentChord = chords[chordIndex];
    
    // Play arpeggio
    currentChord.forEach((noteFreq, idx) => {
      playAmbientNote(noteFreq, idx * 0.4, 4.0);
    });

    chordIndex = (chordIndex + 1) % chords.length;
  }

  function startAudio() {
    if (!audioContext) {
      initWebAudio();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (!isPlaying) {
      isPlaying = true;
      audioToggleBtn.classList.add('playing');
      playNextChord();
      synthInterval = setInterval(playNextChord, 3200);
    }
  }

  function stopAudio() {
    if (isPlaying) {
      isPlaying = false;
      audioToggleBtn.classList.remove('playing');
      if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
      }
    }
  }

  audioToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });

  // 4. Live Countdown to Wedding (Rabu, 9 September 2026, 09:00 WIB)
  const targetDate = new Date('2026-09-09T09:00:00+07:00').getTime();

  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 5. Save to Google Calendar
  const btnSaveCalendar = document.getElementById('btnSaveCalendar');
  btnSaveCalendar.addEventListener('click', () => {
    const title = encodeURIComponent("Pernikahan Muhamad Yusup & Tika Oktavia Heningsih");
    const details = encodeURIComponent("Akad Nikah Muhamad Yusup & Tika Oktavia Heningsih. Mohon doa restu untuk membina keluarga yang sakinah, mawaddah, wa rahmah.");
    const location = encodeURIComponent("KUA Kecamatan Kuningan, Jl. Otista No. 87, Kuningan, Jawa Barat");
    const dates = "20260909T020000Z/20260909T050000Z"; // 09:00 - 12:00 WIB (UTC+7 -> 02:00 UTC)

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleCalUrl, '_blank');
  });

  // 6. Wishes & Prayers Board (Local Storage + Preloaded Initial Wishes)
  const defaultWishes = [
    {
      name: "Keluarga Besar Heningsih",
      relation: "Keluarga / Kerabat",
      message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir. Semoga Yusup & Tika menjadi keluarga yang sakinah mawaddah warahmah, dilimpahi keberkahan dan kebahagiaan selalu.",
      time: "Baru saja"
    },
    {
      name: "Dimas & Rina",
      relation: "Sahabat / Teman",
      message: "Selamat ya Yusup dan Tika! Turut berbahagia atas akad nikahnya. Semoga prosesi akad berjalan lancar dan langgeng sampai kakek nenek.",
      time: "1 jam yang lalu"
    }
  ];

  const STORAGE_KEY = 'yusup_tika_wedding_wishes';
  const wishesListEl = document.getElementById('wishesList');
  const wishesCountEl = document.getElementById('wishesCount');
  const wishesForm = document.getElementById('wishesForm');

  function getStoredWishes() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultWishes;
  }

  function saveWishes(wishes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  }

  function renderWishes() {
    const wishes = getStoredWishes();
    wishesCountEl.textContent = wishes.length;
    wishesListEl.innerHTML = '';

    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      card.innerHTML = `
        <div class="wish-card-header">
          <span class="wish-author">${escapeHtml(item.name)}</span>
          <span class="wish-relation">${escapeHtml(item.relation || 'Tamu')}</span>
        </div>
        <p class="wish-content">${escapeHtml(item.message)}</p>
        <span class="wish-time">${item.time || 'Terkirim'}</span>
      `;
      wishesListEl.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  wishesForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('wishesName').value.trim();
    const relation = document.getElementById('wishesRelation').value;
    const message = document.getElementById('wishesMessage').value.trim();

    if (!name || !message) return;

    const newWish = {
      name,
      relation,
      message,
      time: 'Baru saja'
    };

    const currentWishes = getStoredWishes();
    currentWishes.unshift(newWish);
    saveWishes(currentWishes);
    renderWishes();

    // Reset textarea
    document.getElementById('wishesMessage').value = '';

    // Trigger mini confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#B88E4F', '#FAF8F5']
      });
    }
  });

  renderWishes();

  // 7. WhatsApp Share Link Generator
  const btnShareWA = document.getElementById('btnShareWA');
  btnShareWA.addEventListener('click', () => {
    const name = guestShareInput.value.trim() || 'Sahabat/Keluarga';
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?to=${encodeURIComponent(name)}`;
    
    const waText = `*Assalamu'alaikum Warahmatullahi Wabarakatuh*\n\nKepada Yth. *${name}*,\n\nDengan memohon rahmat dan ridho Allah SWT, berikut kami sampaikan kabar bahagia terkait rencana pernikahan kami:\n\n*Muhamad Yusup & Tika Oktavia Heningsih*\n\nInfo lengkap & permohonan doa restu dapat dilihat melalui tautan undangan digital berikut:\n${shareUrl}\n\nMerupakan suatu kehormatan bagi kami atas doa restu yang Bapak/Ibu/Saudara/i berikan.\n\n*Wassalamu'alaikum Warahmatullahi Wabarakatuh*\n— Yusup & Tika`;

    const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waLink, '_blank');
  });
});
