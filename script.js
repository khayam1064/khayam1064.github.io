/**
 * Khayam Khalid Abbasi — AI/ML Engineer Portfolio
 * Interactive Systems, Neural Canvas, & Real-Time Simulators
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. Web Audio API UI Sound Synthesizer (Zero External Audio Files)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = false;

  const soundToggleBtn = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiBeep(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.08) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  function playAlarmTone() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(440, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn(e);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggleBtn.style.color = 'var(--cyan-glow)';
        soundToggleBtn.style.borderColor = 'var(--cyan-glow)';
        showToast('UI Audio Effects Activated');
        playUiBeep(880, 'sine', 0.12, 0.1);
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggleBtn.style.color = 'var(--text-secondary)';
        soundToggleBtn.style.borderColor = 'var(--border-light)';
        showToast('UI Audio Muted');
      }
    });
  }

  // =========================================================================
  // 2. Dedicated Cyber Grid 3D Live Wallpaper Engine
  // =========================================================================
  const canvas = document.getElementById('neuralCanvas');
  let clickShockwaves = [];

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };

    // Floating cyber data nodes in upper cosmos
    const cyberNodes = [];
    const nodeCount = 45;
    for (let i = 0; i < nodeCount; i++) {
      cyberNodes.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.55),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Grid animation state
    let gridOffset = 0;
    let time = 0;

    // Moving data packets traveling along the 3D grid lines
    const gridPackets = [];
    const maxPackets = 18;

    function spawnPacket() {
      if (gridPackets.length < maxPackets && Math.random() > 0.4) {
        gridPackets.push({
          lineIndex: Math.floor(Math.random() * 32),
          progress: 0,
          speed: Math.random() * 0.015 + 0.008,
          color: Math.random() > 0.4 ? '#00f0ff' : '#8b5cf6',
          size: Math.random() * 3 + 2
        });
      }
    }

    function renderCyberGrid3D() {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;
      gridOffset = (gridOffset + 1.2) % 45;

      // Smooth mouse interpolation for 3D parallax tilt
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const horizonY = height * 0.40;
      const vanishingX = width * 0.5 + (mouse.x - width * 0.5) * 0.22;
      const tiltY = (mouse.y - height * 0.5) * 0.08;

      // 1. Draw Upper Cyber Cosmos & Floating Data Nodes
      for (let i = 0; i < cyberNodes.length; i++) {
        const node = cyberNodes[i];
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.03;

        if (node.x < 0) node.x = width;
        if (node.x > width) node.x = 0;
        if (node.y < 0) node.y = horizonY - 10;
        if (node.y > horizonY - 5) node.y = 10;

        const pulseGlow = Math.sin(node.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseGlow, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${node.alpha * pulseGlow * 0.6})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Proximity connections between upper nodes
        for (let j = i + 1; j < cyberNodes.length; j++) {
          const other = cyberNodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 110) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // 2. Horizon Glow and Cyber Sun Ambience
      const horizonGrad = ctx.createLinearGradient(0, horizonY - 90, 0, horizonY + 30);
      horizonGrad.addColorStop(0, 'transparent');
      horizonGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.06)');
      horizonGrad.addColorStop(1, 'rgba(139, 92, 246, 0.12)');
      ctx.fillStyle = horizonGrad;
      ctx.fillRect(0, horizonY - 90, width, 120);

      // Glowing Neon Horizon Beam
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.55)';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 22;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Perspective Grid Lines (Receding horizontal lines)
      const maxDistance = height - horizonY;
      for (let y = horizonY + gridOffset; y < height; y += 45) {
        // Perspective exponent: lines get closer together towards the horizon
        const progress = (y - horizonY) / maxDistance;
        const alpha = Math.min(progress * 0.42, 0.38);

        // Subtle sine wave undulation along the horizontal lines
        ctx.beginPath();
        const segments = 24;
        for (let s = 0; s <= segments; s++) {
          const sx = (s / segments) * width;
          const waveElevation = Math.sin(s * 0.4 + time + progress * 4) * (progress * 6);
          const sy = y + waveElevation + tiltY;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }

        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 1 + progress * 0.8;
        ctx.stroke();
      }

      // 4. Vertical 3D perspective grid lines radiating from vanishing point
      const numLines = 32;
      const spread = width * 2.6;

      for (let i = 0; i <= numLines; i++) {
        const bottomX = (i / numLines) * spread - spread * 0.30;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height + 40);
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.22)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // 5. Spawn & Animate Traveling Data Packets on Grid Lines
      spawnPacket();
      for (let p = gridPackets.length - 1; p >= 0; p--) {
        const packet = gridPackets[p];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          gridPackets.splice(p, 1);
          continue;
        }

        // Calculate packet coordinates along perspective line
        const bottomX = (packet.lineIndex / numLines) * spread - spread * 0.30;
        const px = vanishingX + (bottomX - vanishingX) * packet.progress;
        const py = horizonY + (height - horizonY) * packet.progress;

        ctx.beginPath();
        ctx.arc(px, py, packet.size * packet.progress, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = packet.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. Expanding Click Shockwaves
      for (let i = clickShockwaves.length - 1; i >= 0; i--) {
        const wave = clickShockwaves[i];
        wave.radius += 6.5;
        wave.intensity *= 0.93;

        ctx.beginPath();
        ctx.ellipse(wave.x, wave.y, wave.radius, wave.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 240, 255, ${wave.intensity * 0.6})`;
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (wave.intensity < 0.02 || wave.radius > 650) {
          clickShockwaves.splice(i, 1);
        }
      }

      requestAnimationFrame(renderCyberGrid3D);
    }
    renderCyberGrid3D();

    // Window events
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const cursorGlow = document.getElementById('cursorGlow');
      if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      }
    });

    // Click to emit shockwave pulse across Cyber Grid 3D
    window.addEventListener('click', (e) => {
      if (e.target.closest('button, input, textarea, a, .glass-panel')) return;
      clickShockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 15,
        intensity: 1.0
      });
      playUiBeep(340, 'triangle', 0.08, 0.05);
    });
  }

  // =========================================================================
  // 3. Dynamic Typewriter Effect for Hero (Research Enthusiast Focus)
  // =========================================================================
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const titles = [
      "AI/ML Research Enthusiast & Systems Architect",
      "Computer Vision & Deep Learning Researcher",
      "Empirical ML Modeling & Credit Risk Specialist",
      "Real-Time IDPS & Raw Socket Security Architect",
      "Passionate about Novel Neural Architectures & Research"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function type() {
      const currentTitle = titles[titleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
        typingSpeed = 2000; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }
    setTimeout(type, 800);
  }

  // =========================================================================
  // 4. Animated Counters on Scroll
  // =========================================================================
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 35;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  }

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        runCounters();
        animated = true;
      }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
  }

  // =========================================================================
  // 5. 3D Tilt Card on Hero Portrait
  // =========================================================================
  const portraitWrapper = document.getElementById('portraitTilt');
  if (portraitWrapper) {
    portraitWrapper.addEventListener('mousemove', (e) => {
      const rect = portraitWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      const card = portraitWrapper.querySelector('.portrait-card');
      if (card) {
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    portraitWrapper.addEventListener('mouseleave', () => {
      const card = portraitWrapper.querySelector('.portrait-card');
      if (card) {
        card.style.transform = `rotateX(0deg) rotateY(0deg)`;
      }
    });
  }

  // =========================================================================
  // 6. Navigation, Hero Telemetry Ticker & Sliding Side HUD
  // =========================================================================
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      playUiBeep(450, 'sine', 0.05);
    });
  }

  if (drawerCloseBtn && mobileDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Hero Sliding Telemetry Ticker Rotator
  const slidingTelemetry = document.getElementById('slidingTelemetry');
  if (slidingTelemetry) {
    const telemetryFeeds = [
      "KERNEL STREAMING: Scapy socket packet analyzer active on eth0 • 0 dropped frames",
      "VISION ENGINE: OpenCV 60 FPS multi-player contour tracking calibrated",
      "LLM SYNTHESIS: Schema AST verified • Safe read-only database isolation active",
      "FINTECH MODEL: Credit scoring pipeline calibrated with AUC-ROC 0.942",
      "FATIGUE MONITOR: Android vision PERCLOS real-time threshold monitoring",
      "SYSTEM STATUS: Khayam Khalid Abbasi available for AI/ML engineering roles"
    ];
    let feedIndex = 0;
    setInterval(() => {
      feedIndex = (feedIndex + 1) % telemetryFeeds.length;
      slidingTelemetry.style.opacity = '0';
      slidingTelemetry.style.transform = 'translateY(6px)';
      setTimeout(() => {
        slidingTelemetry.textContent = telemetryFeeds[feedIndex];
        slidingTelemetry.style.opacity = '1';
        slidingTelemetry.style.transform = 'translateY(0)';
      }, 300);
    }, 4000);
  }

  // Sliding Side HUD: Live Clock (PKT UTC+5)
  const hudLiveClock = document.getElementById('hudLiveClock');
  function updateLiveClock() {
    if (hudLiveClock) {
      const now = new Date();
      const options = { timeZone: 'Asia/Karachi', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      hudLiveClock.textContent = now.toLocaleTimeString('en-GB', options);
    }
  }
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  // Sliding Side HUD: Scroll Progress Radial Meter and Active Link Sync
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');
  const scrollProgressCircle = document.getElementById('scrollProgressCircle');
  const scrollVal = document.getElementById('scrollVal');
  const hudLinks = document.querySelectorAll('.hud-link');
  const circumference = 94.2; // 2 * PI * 15

  function updateScrollHUD() {
    const scrollY = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
    const percent = Math.round(progress * 100);

    if (scrollVal) scrollVal.textContent = `${percent}%`;
    if (scrollProgressCircle) {
      const offset = circumference - (progress * circumference);
      scrollProgressCircle.style.strokeDashoffset = offset;
    }

    // Active Section Spy for both Navbar and Side HUD
    let current = 'hero';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 180;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });

    hudLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateScrollHUD);
  updateScrollHUD();

  // =========================================================================
  // 7. Skills Matrix Filtering
  // =========================================================================
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      playUiBeep(520, 'triangle', 0.05);
      skillTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // =========================================================================
  // 8. Interactive AI Lab Tabs Switching
  // =========================================================================
  const labTabs = document.querySelectorAll('.lab-tab');
  const simPanels = document.querySelectorAll('.sim-panel');

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      playUiBeep(640, 'sine', 0.06);
      labTabs.forEach(t => t.classList.remove('active'));
      simPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const simTarget = tab.getAttribute('data-sim');
      const targetPanel = document.getElementById(`sim-${simTarget}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Links from project cards that jump directly to specific simulator tab
  document.querySelectorAll('.test-sim-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetSim = link.getAttribute('data-target-sim');
      const correspondingTab = document.querySelector(`.lab-tab[data-sim="${targetSim}"]`);
      if (correspondingTab) {
        correspondingTab.click();
      }
    });
  });

  // =========================================================================
  // 9. SIMULATOR 1: IDPS Network Threat Inspector & iptables Sandbox
  // =========================================================================
  const packetTerminal = document.getElementById('packetTerminal');
  const packetCountBadge = document.getElementById('packetCountBadge');
  const fwStatus = document.getElementById('fwStatus');
  const blockedIpCount = document.getElementById('blockedIpCount');
  const blockedList = document.getElementById('blockedList');

  let packetCounter = 0;
  let blockedCounter = 0;
  const blockedSet = new Set();

  function appendTerminalLine(text, type = 'system') {
    if (!packetTerminal) return;
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    const timestamp = new Date().toTimeString().split(' ')[0] + '.' + Math.floor(Math.random() * 899 + 100);
    line.textContent = `[${timestamp}] ${text}`;
    packetTerminal.appendChild(line);
    packetTerminal.scrollTop = packetTerminal.scrollHeight;

    packetCounter++;
    if (packetCountBadge) {
      packetCountBadge.textContent = `${packetCounter} Packets Analyzed`;
    }
  }

  function addBlockedIp(ip, reason) {
    if (blockedSet.has(ip)) return;
    blockedSet.add(ip);
    blockedCounter++;
    if (blockedIpCount) blockedIpCount.textContent = `${blockedCounter} IPs Filtered`;

    if (blockedList) {
      const emptyItem = blockedList.querySelector('.empty-state');
      if (emptyItem) emptyItem.remove();

      const li = document.createElement('li');
      li.innerHTML = `<span><strong>${ip}</strong> (${reason})</span> <span>DROP</span>`;
      blockedList.prepend(li);
    }
  }

  // Inject Benign Traffic
  document.getElementById('btnBenign')?.addEventListener('click', () => {
    playUiBeep(480, 'sine', 0.05);
    const benignIps = ['192.168.1.45', '10.0.0.12', '172.16.0.8', '192.168.1.109'];
    const ip = benignIps[Math.floor(Math.random() * benignIps.length)];
    appendTerminalLine(`INSPECT: IPv4 ${ip} -> Port 443 [TCP ACK/PSH] Len=1420 - Valid TLS Handshake (Benign)`, 'benign');
  });

  // Inject SYN Flood Attack
  document.getElementById('btnSynFlood')?.addEventListener('click', () => {
    playAlarmTone();
    const attackerIp = `185.220.${Math.floor(Math.random() * 200 + 10)}.${Math.floor(Math.random() * 250 + 1)}`;
    appendTerminalLine(`ALERT [HIGH]: Rapid SYN packets without ACK from ${attackerIp} -> Target Port 80 (Burst=1200 pkts/s)`, 'warning');
    appendTerminalLine(`IPS TRIGGER: Anomaly threshold exceeded for ${attackerIp}. Initiating iptables rule...`, 'threat');
    appendTerminalLine(`KERNEL: iptables -I INPUT -s ${attackerIp} -j DROP --comment "SYN_FLOOD_MITIGATION"`, 'block');
    addBlockedIp(attackerIp, 'SYN Flood');
  });

  // Inject SQL Injection
  document.getElementById('btnSqlInject')?.addEventListener('click', () => {
    playAlarmTone();
    const attackerIp = `45.33.${Math.floor(Math.random() * 100 + 10)}.${Math.floor(Math.random() * 200 + 1)}`;
    appendTerminalLine(`ALERT [CRITICAL]: Malicious payload in HTTP GET from ${attackerIp}`, 'warning');
    appendTerminalLine(`SIGNATURE DETECTED: ' OR 1=1; UNION SELECT * FROM users-- in URI parameter`, 'threat');
    appendTerminalLine(`KERNEL: iptables -I INPUT -s ${attackerIp} -j DROP --comment "SQLI_PROBE_BLOCK"`, 'block');
    addBlockedIp(attackerIp, 'SQL Injection');
  });

  // Inject DDoS Burst
  document.getElementById('btnDdos')?.addEventListener('click', () => {
    playAlarmTone();
    appendTerminalLine(`ALERT [CRITICAL]: Distributed Botnet Burst Detected! 4 Subnets flooding gateway.`, 'threat');
    for (let i = 0; i < 3; i++) {
      const ip = `${Math.floor(Math.random() * 150 + 50)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250)}`;
      setTimeout(() => {
        appendTerminalLine(`ISOLATING THREAT NODE: ${ip} dropped by active IDS filter`, 'block');
        addBlockedIp(ip, 'DDoS Node');
      }, i * 200);
    }
  });

  // Clear Terminal
  document.getElementById('btnClearLogs')?.addEventListener('click', () => {
    if (packetTerminal) {
      packetTerminal.innerHTML = `
        <div class="term-line system">[SYSTEM] Packet stream cleared. Scapy sniffer listening on eth0...</div>
      `;
    }
  });

  // =========================================================================
  // 10. SIMULATOR 2: Credit Risk Scorer Reactive Engine
  // =========================================================================
  const inputIncome = document.getElementById('inputIncome');
  const inputDti = document.getElementById('inputDti');
  const inputHistory = document.getElementById('inputHistory');
  const inputUtilization = document.getElementById('inputUtilization');
  const inputMissed = document.getElementById('inputMissed');

  const valIncome = document.getElementById('valIncome');
  const valDti = document.getElementById('valDti');
  const valHistory = document.getElementById('valHistory');
  const valUtilization = document.getElementById('valUtilization');
  const valMissed = document.getElementById('valMissed');

  const creditScoreDisplay = document.getElementById('creditScoreDisplay');
  const creditBadge = document.getElementById('creditBadge');
  const creditExplanation = document.getElementById('creditExplanation');
  const creditGaugeCircle = document.getElementById('creditGaugeCircle');

  function calculateCreditScore() {
    if (!inputIncome || !inputDti || !inputHistory || !inputUtilization || !inputMissed) return;

    const income = parseFloat(inputIncome.value);
    const dti = parseFloat(inputDti.value);
    const history = parseFloat(inputHistory.value);
    const util = parseFloat(inputUtilization.value);
    const missed = parseFloat(inputMissed.value);

    // Update value labels
    valIncome.textContent = `$${income.toLocaleString()}`;
    valDti.textContent = `${dti}%`;
    valHistory.textContent = `${history} Year${history === 1 ? '' : 's'}`;
    valUtilization.textContent = `${util}%`;
    valMissed.textContent = `${missed} Delinquenc${missed === 1 ? 'y' : 'ies'}`;

    // Statistical Weighting Formulation (Inspired by Logistic Regression / Scorecard)
    // Baseline: 680
    let score = 680;

    // Income boost (up to +70)
    score += Math.min((income - 40000) / 3000, 70);

    // DTI penalty (baseline 30%)
    score -= (dti - 25) * 2.8;

    // History boost (+4 per year)
    score += history * 4.5;

    // Utilization penalty (baseline 30%)
    score -= (util - 30) * 2.2;

    // Missed payment severe penalty (-50 per missed)
    score -= missed * 55;

    // Clamp score between 320 and 850
    score = Math.round(Math.max(320, Math.min(850, score)));
    creditScoreDisplay.textContent = score;

    // Default Probability estimation
    const defaultProb = Math.max(1.2, Math.min(88.5, (1 / (1 + Math.exp((score - 630) / 45))) * 100)).toFixed(1);

    // UI Decision Badge & Gauge color
    if (score >= 720) {
      creditBadge.className = 'decision-badge approved';
      creditBadge.textContent = 'APPROVED — PRIME';
      creditExplanation.innerHTML = `Default Probability: <strong>${defaultProb}%</strong>. Exemplary repayment trajectory and safe risk parameters.`;
      if (creditGaugeCircle) {
        creditGaugeCircle.style.background = 'conic-gradient(from 180deg, #10b981 0%, #00f0ff 80%, #10b981 100%)';
      }
    } else if (score >= 600) {
      creditBadge.className = 'decision-badge review';
      creditBadge.textContent = 'MANUAL REVIEW — MODERATE RISK';
      creditExplanation.innerHTML = `Default Probability: <strong>${defaultProb}%</strong>. Applicant has moderate debt leverage requiring secondary collateral.`;
      if (creditGaugeCircle) {
        creditGaugeCircle.style.background = 'conic-gradient(from 180deg, #f59e0b 0%, #00f0ff 60%, #f59e0b 100%)';
      }
    } else {
      creditBadge.className = 'decision-badge declined';
      creditBadge.textContent = 'DECLINED — ELEVATED RISK';
      creditExplanation.innerHTML = `Default Probability: <strong>${defaultProb}%</strong>. High likelihood of payment default triggered by excessive DTI or delinquencies.`;
      if (creditGaugeCircle) {
        creditGaugeCircle.style.background = 'conic-gradient(from 180deg, #ef4444 0%, #f59e0b 70%, #ef4444 100%)';
      }
    }
  }

  [inputIncome, inputDti, inputHistory, inputUtilization, inputMissed].forEach(input => {
    input?.addEventListener('input', () => {
      calculateCreditScore();
      playUiBeep(500 + parseFloat(input.value) % 400, 'sine', 0.03, 0.03);
    });
  });

  // =========================================================================
  // 11. SIMULATOR 3: NL-to-SQL Query Generator
  // =========================================================================
  const nlqQueryInput = document.getElementById('nlqQueryInput');
  const btnRunNlq = document.getElementById('btnRunNlq');
  const nlqSqlCode = document.getElementById('nlqSqlCode');
  const nlqResultTable = document.getElementById('nlqResultTable');
  const nlqExecTime = document.getElementById('nlqExecTime');

  const queryDatabase = [
    {
      keyword: 'volume',
      sql: `SELECT \n  c.customer_id, \n  c.full_name, \n  SUM(t.amount) AS total_spent, \n  c.membership_tier \nFROM customers c\nJOIN transactions t ON c.customer_id = t.customer_id\nWHERE t.status = 'COMPLETED'\nGROUP BY c.customer_id, c.full_name, c.membership_tier\nORDER BY total_spent DESC\nLIMIT 5;`,
      headers: ['customer_id', 'full_name', 'total_spent', 'membership_tier'],
      rows: [
        ['#1084', 'Alexander Hayes', '$48,920.00', 'Platinum'],
        ['#0921', 'Fatima Al-Zahra', '$42,150.50', 'Platinum'],
        ['#2419', 'Marcus Sterling', '$39,800.00', 'Gold'],
        ['#1150', 'Elena Rostova', '$34,220.00', 'Gold'],
        ['#0744', 'Chen Wei', '$31,900.00', 'Gold']
      ],
      speed: '12ms'
    },
    {
      keyword: 'overdue',
      sql: `SELECT \n  l.loan_id, \n  l.borrower_name, \n  l.days_overdue, \n  l.outstanding_principal, \n  l.credit_score \nFROM loan_accounts l\nWHERE l.days_overdue > 60 \n  AND l.credit_score < 600\nORDER BY l.days_overdue DESC;`,
      headers: ['loan_id', 'borrower_name', 'days_overdue', 'principal', 'credit_score'],
      rows: [
        ['LN-8832', 'Robert Vance', '94 Days', '$18,400.00', '542'],
        ['LN-4921', 'Julian Thorne', '78 Days', '$9,250.00', '580'],
        ['LN-7703', 'Amira Kassam', '65 Days', '$14,100.00', '565']
      ],
      speed: '8ms'
    },
    {
      keyword: 'category',
      sql: `SELECT \n  t.category, \n  COUNT(t.id) AS transaction_count, \n  ROUND(AVG(t.amount), 2) AS avg_amount, \n  SUM(t.amount) AS gross_volume \nFROM transactions t\nWHERE EXTRACT(YEAR FROM t.transaction_date) = 2024\nGROUP BY t.category\nORDER BY gross_volume DESC;`,
      headers: ['category', 'tx_count', 'avg_amount', 'gross_volume'],
      rows: [
        ['Fintech Lending', '14,290', '$1,840.50', '$26,300,745.00'],
        ['Cross-Border FX', '8,412', '$2,420.00', '$20,357,040.00'],
        ['Merchant POS', '98,400', '$84.20', '$8,285,280.00'],
        ['Corporate Payroll', '1,250', '$4,980.00', '$6,225,000.00']
      ],
      speed: '15ms'
    },
    {
      keyword: 'drop',
      sql: `-- SECURITY GUARDRAIL TRIGGERED:\n-- AST Validator detected dangerous DDL/DML token: 'DROP TABLE'\n-- Result: Execution Blocked. Schema is protected in strictly READ-ONLY isolation.`,
      headers: ['status', 'security_policy', 'action_taken'],
      rows: [
        ['BLOCKED', 'READ_ONLY_ENFORCEMENT', 'Query rejected by safety AST parser.']
      ],
      speed: '1ms'
    }
  ];

  function runNlqEngine() {
    if (!nlqQueryInput || !nlqSqlCode || !nlqResultTable) return;
    const query = nlqQueryInput.value.toLowerCase();
    playUiBeep(720, 'sine', 0.08);

    // Find match or default
    let match = queryDatabase[0];
    if (query.includes('overdue') || query.includes('score') || query.includes('loan')) {
      match = queryDatabase[1];
    } else if (query.includes('category') || query.includes('average') || query.includes('monthly')) {
      match = queryDatabase[2];
    } else if (query.includes('drop') || query.includes('delete') || query.includes('alter')) {
      match = queryDatabase[3];
    }

    // Typing effect for generated SQL
    nlqSqlCode.textContent = 'Analyzing schema & generating query AST...';
    btnRunNlq.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Synthesizing...';

    setTimeout(() => {
      nlqSqlCode.textContent = match.sql;
      btnRunNlq.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Synthesize SQL';
      nlqExecTime.textContent = `Execution: ${match.speed}`;

      // Render table
      let html = '<thead><tr>';
      match.headers.forEach(h => html += `<th>${h}</th>`);
      html += '</tr></thead><tbody>';
      match.rows.forEach(r => {
        html += '<tr>';
        r.forEach(c => html += `<td>${c}</td>`);
        html += '</tr>';
      });
      html += '</tbody>';
      nlqResultTable.innerHTML = html;
    }, 450);
  }

  btnRunNlq?.addEventListener('click', runNlqEngine);

  document.querySelectorAll('.nlq-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      nlqQueryInput.value = chip.getAttribute('data-query');
      runNlqEngine();
    });
  });

  // =========================================================================
  // 12. SIMULATOR 4: Driver Drowsiness Detection System
  // =========================================================================
  const earValue = document.getElementById('earValue');
  const closureDuration = document.getElementById('closureDuration');
  const alarmTriggerText = document.getElementById('alarmTriggerText');
  const hudStatePill = document.getElementById('hudStatePill');
  const leftEye = document.getElementById('leftEye');
  const rightEye = document.getElementById('rightEye');
  const driverMouth = document.getElementById('driverMouth');
  const warningOverlay = document.getElementById('warningOverlay');

  document.getElementById('btnDriveNormal')?.addEventListener('click', () => {
    playUiBeep(520, 'sine', 0.06);
    earValue.textContent = '0.34';
    closureDuration.textContent = '0.0s';
    alarmTriggerText.textContent = 'STANDBY';
    alarmTriggerText.style.color = '#fff';

    hudStatePill.className = 'state-pill alert-safe';
    hudStatePill.textContent = 'DRIVER ALERT';

    leftEye?.classList.remove('closed');
    rightEye?.classList.remove('closed');
    driverMouth?.classList.remove('yawn');
    warningOverlay?.classList.remove('active');
  });

  document.getElementById('btnDriveTired')?.addEventListener('click', () => {
    playUiBeep(420, 'triangle', 0.08);
    earValue.textContent = '0.21';
    closureDuration.textContent = '1.2s';
    alarmTriggerText.textContent = 'PRE-ALERT MONITOR';
    alarmTriggerText.style.color = '#fbbf24';

    hudStatePill.className = 'state-pill alert-warn';
    hudStatePill.textContent = 'MILD FATIGUE';

    leftEye?.classList.remove('closed');
    rightEye?.classList.remove('closed');
    driverMouth?.classList.add('yawn');
    warningOverlay?.classList.remove('active');
  });

  document.getElementById('btnDriveMicrosleep')?.addEventListener('click', () => {
    playAlarmTone();
    earValue.textContent = '0.07';
    closureDuration.textContent = '2.8s (CRITICAL)';
    alarmTriggerText.textContent = 'AUDIO ALARM ACTIVE';
    alarmTriggerText.style.color = '#f87171';

    hudStatePill.className = 'state-pill alert-critical';
    hudStatePill.textContent = 'MICROSLEEP DETECTED';

    leftEye?.classList.add('closed');
    rightEye?.classList.add('closed');
    driverMouth?.classList.remove('yawn');
    warningOverlay?.classList.add('active');

    showToast('Dynamic Audio Alarm Activated: Waking driver!');
  });

  // =========================================================================
  // 13. Deep Architecture Project Modals Data & Triggers
  // =========================================================================
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContentSlot = document.getElementById('modalContentSlot');

  const projectModalData = {
    idps: {
      tag: 'Cybersecurity & Low-Level Network Systems',
      title: 'Real-Time Network Monitoring & Intrusion Prevention System (IDPS)',
      img: 'assets/project-idps.jpg',
      html: `
        <h4 class="modal-section-title"><i class="fa-solid fa-microchip"></i> System Architecture & Data Flow</h4>
        <p>This project was engineered as a comprehensive solution for real-time cyber defense. It integrates low-level Linux raw sockets and Scapy sniffing daemons to capture promiscuous network packets, perform deep protocol dissection, and correlate indicators of compromise (IoC) in milliseconds.</p>
        
        <div class="modal-code-snippet">
# Architecture Flow:
[Raw Network Traffic: eth0]
       │
       ▼ (Promiscuous Packet Sniffing via Python Scapy / Socket Layer)
[Protocol Dissector (TCP / UDP / ICMP / Application Payloads)]
       │
       ├──► [Real-Time Telemetry Stream: WebSockets] ──► [React UI Dashboard]
       │
       ▼ (Anomaly & Heuristic Engine: Port Scanning, SYN Flood, Injection Vectors)
[Active Mitigation Trigger (iptables Engine)]
       │
       ▼
[Dynamic Firewall Rule Execution: sudo iptables -I INPUT -s &lt;attacker_ip&gt; -j DROP]
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-gears"></i> Technical Decisions & Engineering Highlights</h4>
        <p><strong>1. Active Dynamic Mitigation:</strong> Unlike passive IDS that merely log intrusions, this system actively interacts with kernel packet filtering (Linux netfilter/iptables) to inject automated block rules immediately upon detecting anomalous patterns.</p>
        <p><strong>2. Bridging Raw Sockets to Modern Web UI:</strong> Architected a high-throughput pipeline linking low-level C-like raw socket packet processing with a reactive frontend, enabling real-time live traffic visualization and single-click administrative remediation.</p>
        <p><strong>3. Threat Signatures Handled:</strong> SYN Floods, volumetric DDoS bursts, SQL injection payloads in HTTP requests, directory traversal probes, and port-knocking surveillance sweeps.</p>
      `
    },
    football: {
      tag: 'Computer Vision & High-Throughput Media',
      title: 'Football Match Video Analytics & Player Tracking Pipeline',
      img: 'assets/project-football.jpg',
      html: `
        <h4 class="modal-section-title"><i class="fa-solid fa-video"></i> Video Ingestion & Processing Pipeline</h4>
        <p>Engineered an end-to-end computer vision pipeline tailored for broadcast-level football match footage. The system handles large multi-gigabyte video files by implementing optimized batching workers and distributed transcoding via FFmpeg.</p>
        
        <div class="modal-code-snippet">
# Pipeline Architecture:
[Broadcast Video Stream (4K / 1080p)]
       │
       ▼ (FFmpeg Worker: Frame Extraction, Resolution Scaling & Timestamp Sync)
[Raw Frame Sequence Array]
       │
       ▼ (OpenCV: Background Subtraction & Dynamic Frame Differencing)
[Pitch Color Segmentation (HSV Masking for Grass Normalization)]
       │
       ▼ (Contour Detection & Spatial Filtering)
[Multi-Object Tracker: Player & Ball Bounding Boxes]
       │
       ▼ (Velocity Vector Calculation & Trajectory Smoothing)
[Annotated Video Stream Generation with Overlays, Heatmaps & Metrics]
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-chart-line"></i> Technical Innovations</h4>
        <p><strong>1. FFmpeg & OpenCV Synergy:</strong> Offloaded heavy video demuxing, format normalization, and hardware-accelerated transcoding to FFmpeg subroutines while running OpenCV frame-differencing logic on batched memory buffers.</p>
        <p><strong>2. Multi-Player Occlusion Handling:</strong> Utilized spatial bounding-box projection and velocity vectors to maintain persistent player track IDs during crowded physical tackles and set-piece cluster scenarios.</p>
      `
    },
    credit: {
      tag: 'Fintech & Explainable Machine Learning',
      title: 'Banking Credit Scoring & Default Risk Assessment Engine',
      img: 'assets/project-credit.jpg',
      html: `
        <h4 class="modal-section-title"><i class="fa-solid fa-chart-pie"></i> Machine Learning Workflow</h4>
        <p>Built a robust credit scoring model designed to predict the likelihood of borrower default and transform complex non-linear probabilities into calibrated, interpretable credit scores (300 to 850 range) compliant with banking standards.</p>
        
        <div class="modal-code-snippet">
# ML Pipeline:
[Historical Applicant & Loan Repayment Data]
       │
       ▼ (Data Cleansing: Missing Imputation, Winsorization of Outliers)
[Feature Engineering: DTI Ratio, Revolving Utilization, Delinquency Weights]
       │
       ▼ (Addressing Extreme Class Imbalance: SMOTE & Balanced Subsampling)
[Model Training & Comparative Benchmarking:
   - Logistic Regression (Baseline Explainability)
   - Random Forest Classifier (Non-linear Interactions)
   - Gradient Boosting (XGBoost / LightGBM Architecture)]
       │
       ▼ (Validation Metrics: AUC-ROC (0.942), KS Statistic, Gini Coefficient)
[Production Pipeline: Calibrated Credit Score Mapping & Explainability Matrix]
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-shield-check"></i> Financial Explainability & Compliance</h4>
        <p>Rather than relying on opaque black-box models, this engine extracts feature importance metrics (SHAP values and logistic coefficients), empowering loan officers to provide applicants with transparent reasons for loan decisions.</p>
      `
    },
    nlq: {
      tag: 'Generative AI & Database Engineering',
      title: 'Schema-Aware Natural Language Query (NLQ) to SQL Chatbot',
      img: 'assets/project-nlq.jpg',
      html: `
        <h4 class="modal-section-title"><i class="fa-solid fa-comments"></i> Conversational Data Extraction System</h4>
        <p>Designed and built a natural language interface that converts natural questions from business users into dialect-accurate, performant SQL queries against enterprise relational databases.</p>

        <div class="modal-code-snippet">
# NLQ Data Pipeline:
[User Query: "Show top 5 customers with highest spend in 2024"]
       │
       ▼ (Node.js & TypeScript Backend Engine)
[Schema Introspection & Semantic Context Injection]
       │
       ▼ (LLM Synthesis with Guardrailed Few-Shot Prompting)
[Generated SQL Syntax Tree]
       │
       ▼ (AST Validation: Strictly Block DROP, DELETE, ALTER, UPDATE)
[Read-Only Database Connection Execution Pool]
       │
       ▼
[JSON Results Formatted into Human-Readable Tables & Natural Summaries]
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-lock"></i> Security Guardrails & Safety</h4>
        <p>Incorporated rigorous Abstract Syntax Tree (AST) query validation to safeguard database integrity, ensuring no destructive statements can be executed, alongside schema-aware prompting that eliminates hallucinations.</p>
      `
    },
    drowsiness: {
      tag: 'Android Engineering & Computer Vision',
      title: 'Smart Driver Drowsiness Detection & Dynamic Acoustic Alarm',
      img: 'assets/project-drowsiness.jpg',
      html: `
        <h4 class="modal-section-title"><i class="fa-solid fa-eye"></i> Real-Time Automotive Safety System</h4>
        <p>Developed a native Android application in Java focused on mitigating driver fatigue fatalities. The system continuously processes front-facing camera frames to track facial landmarks and calculate the Eye Aspect Ratio (EAR).</p>

        <div class="modal-code-snippet">
# Android Pipeline:
[Device Front Camera Feed: 1080p @ 30 FPS]
       │
       ▼ (Facial Landmark API / Vision Pipeline in Java)
[Eye Keypoints Extraction: P1 through P6]
       │
       ▼ (Eye Aspect Ratio Formula: EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||))
[Consecutive Frame Duration Counter: EAR &lt; 0.20 for &gt; 2.0 seconds]
       │
       ▼
[TRIGGER: Android MediaPlayer High-Decibel Acoustic Wake Alarm]
        </div>

        <h4 class="modal-section-title"><i class="fa-solid fa-battery-half"></i> Hardware Optimization</h4>
        <p>Carefully managed Android background processing threads and camera buffers to ensure low latency without causing device overheating or severe battery drain during long highway journeys.</p>
      `
    }
  };

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const data = projectModalData[modalKey];
      if (data && modalContentSlot && projectModal) {
        modalContentSlot.innerHTML = `
          <span class="modal-header-tag">${data.tag}</span>
          <h2 class="modal-title">${data.title}</h2>
          <img src="${data.img}" alt="${data.title}" class="modal-img">
          <div class="modal-body">${data.html}</div>
        `;
        projectModal.classList.add('open');
        playUiBeep(600, 'sine', 0.08);
      }
    });
  });

  if (modalCloseBtn && projectModal) {
    modalCloseBtn.addEventListener('click', () => {
      projectModal.classList.remove('open');
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 14. Clipboard Copy & Toast Feedback
  // =========================================================================
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          playUiBeep(880, 'sine', 0.08);
        }).catch(() => {
          showToast(`Selected: ${textToCopy}`);
        });
      }
    });
  });

  // =========================================================================
  // 15. Contact Form Simulation & Mailto Fallback
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      const email = document.getElementById('senderEmail').value;
      const subject = document.getElementById('senderSubject').value;
      const message = document.getElementById('senderMessage').value;

      if (!name || !email || !message) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields.';
        return;
      }

      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
      playUiBeep(700, 'sine', 0.05);

      setTimeout(() => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Dispatched';
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name}! Your transmission has been queued for Khayam.`;
        showToast('Message sent successfully!');
        playUiBeep(980, 'sine', 0.12);

        // Open mail client as secondary fallback
        setTimeout(() => {
          window.location.href = `mailto:abbasikhayamkhalid@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
        }, 1200);

        contactForm.reset();
      }, 900);
    });
  }

});
