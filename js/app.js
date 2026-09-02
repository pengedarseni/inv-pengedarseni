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

  // 3. Audio Player Engine (Custom MP3 Audio File with Web Audio API Synth Fallback)
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  let isPlaying = false;
  let bgAudio = null;
  let audioContext = null;
  let synthInterval = null;

  function initAudioPlayer() {
    if (!bgAudio) {
      bgAudio = new Audio();
      bgAudio.loop = true;
      bgAudio.preload = 'auto';
      // Prioritaskan file MP3 di folder audio/music.mp3 (atau music.mp3)
      bgAudio.src = 'audio/music.mp3';
    }
  }

  initAudioPlayer();

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

  // Soothing chord progression for wedding ambient (Pachelbel-inspired warm piano/bell tones fallback)
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

  function startSynth() {
    if (!audioContext) {
      initWebAudio();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    playNextChord();
    if (!synthInterval) {
      synthInterval = setInterval(playNextChord, 3200);
    }
  }

  function stopSynth() {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  }

  function startAudio() {
    if (!isPlaying) {
      isPlaying = true;
      audioToggleBtn.classList.add('playing');

      // Coba putar file MP3 kustom terlebih dahulu
      if (bgAudio) {
        bgAudio.play().catch(() => {
          // Jika file MP3 belum dimasukkan atau autoplay dicegah, gunakan synth synthesizer
          startSynth();
        });
      } else {
        startSynth();
      }
    }
  }

  function stopAudio() {
    if (isPlaying) {
      isPlaying = false;
      audioToggleBtn.classList.remove('playing');
      if (bgAudio) {
        bgAudio.pause();
      }
      stopSynth();
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

  // 6. Supabase Realtime Database for Wishes & Prayers Board
  const SUPABASE_URL = "https://gvvsetaxpgrlcoelljgl.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_x7BtMTORMjsSnfwaVUIdlw_R519WJTu";
  
  let supabase = null;
  if (window.supabase) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  const wishesListEl = document.getElementById('wishesList');
  const wishesCountEl = document.getElementById('wishesCount');
  const wishesForm = document.getElementById('wishesForm');

  let wishesData = [];

  function formatRelativeTime(dateString) {
    if (!dateString) return 'Baru saja';
    const date = new Date(dateString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Baru saja';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    // Format full date
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function createWishCard(item) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.id = `wish-${item.id || Math.random()}`;
    const timeFormatted = item.created_at ? formatRelativeTime(item.created_at) : (item.time || 'Baru saja');

    card.innerHTML = `
      <div class="wish-card-header">
        <span class="wish-author">${escapeHtml(item.name)}</span>
        <span class="wish-relation">${escapeHtml(item.relation || 'Sahabat / Teman')}</span>
      </div>
      <p class="wish-content">${escapeHtml(item.message)}</p>
      <span class="wish-time">${timeFormatted}</span>
    `;
    return card;
  }

  function renderAllWishes() {
    wishesCountEl.textContent = wishesData.length;
    wishesListEl.innerHTML = '';

    if (wishesData.length === 0) {
      wishesListEl.innerHTML = `
        <div style="text-align:center; padding: 24px; color: var(--text-on-paper-muted); font-size: 0.88rem;">
          Belum ada ucapan. Jadilah yang pertama memberikan doa restu!
        </div>
      `;
      return;
    }

    wishesData.forEach(item => {
      wishesListEl.appendChild(createWishCard(item));
    });
  }

  async function fetchWishes() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wishes from Supabase:', error);
        return;
      }

      if (data) {
        wishesData = data;
        renderAllWishes();
      }
    } catch (err) {
      console.error('Failed to load wishes:', err);
    }
  }

  function setupRealtimeWishes() {
    if (!supabase) return;
    try {
      supabase
        .channel('public:wishes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
          const newWish = payload.new;
          // Check if not already in list
          if (!wishesData.some(w => w.id === newWish.id)) {
            wishesData.unshift(newWish);
            wishesCountEl.textContent = wishesData.length;
            
            // If empty message placeholder exists, clear it
            if (wishesListEl.querySelector('div[style*="text-align:center"]')) {
              wishesListEl.innerHTML = '';
            }

            const card = createWishCard(newWish);
            wishesListEl.prepend(card);
          }
        })
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription error:', err);
    }
  }

  // Handle submit form
  wishesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wishesName');
    const relationInput = document.getElementById('wishesRelation');
    const messageInput = document.getElementById('wishesMessage');
    const submitBtn = wishesForm.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const relation = relationInput.value;
    const message = messageInput.value.trim();

    if (!name || !message) return;

    // Loading state
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Mengirimkan doa...</span>`;

    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('wishes')
          .insert([{ name, relation, message }])
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const inserted = data[0];
          if (!wishesData.some(w => w.id === inserted.id)) {
            wishesData.unshift(inserted);
            wishesCountEl.textContent = wishesData.length;
            if (wishesListEl.querySelector('div[style*="text-align:center"]')) {
              wishesListEl.innerHTML = '';
            }
            wishesListEl.prepend(createWishCard(inserted));
          }
        }
      }

      // Reset message field
      messageInput.value = '';

      // Trigger celebration confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#C8102E', '#E2B43B', '#0D2240', '#FFFFFF']
        });
      }
    } catch (err) {
      console.error('Error sending wish to Supabase:', err);
      alert('Doa terkirim!');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });

  // Initial fetch and subscription
  fetchWishes();
  setupRealtimeWishes();

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

  // 8. QRIS Modal / Lightbox Handler
  const qrisTrigger = document.getElementById('qrisTrigger');
  const qrisModal = document.getElementById('qrisModal');
  const btnCloseQrisModal = document.getElementById('btnCloseQrisModal');

  if (qrisTrigger && qrisModal) {
    qrisTrigger.addEventListener('click', () => {
      qrisModal.classList.add('active');
      qrisModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    function closeQrisModal() {
      qrisModal.classList.remove('active');
      qrisModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (btnCloseQrisModal) {
      btnCloseQrisModal.addEventListener('click', closeQrisModal);
    }

    qrisModal.addEventListener('click', (e) => {
      if (e.target === qrisModal) {
        closeQrisModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && qrisModal.classList.contains('active')) {
        closeQrisModal();
      }
    });
  }
});
