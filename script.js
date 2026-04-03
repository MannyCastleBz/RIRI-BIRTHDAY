window.onload = function () {
  startConfetti();
};

function startAndRedirect() {
  startConfetti();

  setTimeout(() => {
    window.location.href = "RIRI.HTML";
  }, 1500);
}

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confetti = [];
let confettiActive = false;
let animationFrame;

function createConfetti() {
  confetti = [];
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    });
  }
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  confetti.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
}

function updateConfetti() {
  confetti.forEach(p => {
    p.y += p.speed;
    if (p.y > canvas.height) p.y = -10;
  });
}

function loop() {
  if (!confettiActive) return;
  drawConfetti();
  updateConfetti();
  animationFrame = requestAnimationFrame(loop);
}

function startConfetti() {
  if (confettiActive) return;
  confettiActive = true;
  createConfetti();
  loop();

  setTimeout(() => {
    confettiActive = false;
    cancelAnimationFrame(animationFrame);

    let fade = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!confettiActive) clearInterval(fade);
    }, 50);
  }, 5000);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.addEventListener("DOMContentLoaded", () => {
  const players = document.querySelectorAll(".custom-player");

  players.forEach(player => {
    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-btn");
    const progressBar = player.querySelector(".progress-bar");
    const progress = player.querySelector(".progress");

    playBtn.addEventListener("click", () => {

      document.querySelectorAll(".custom-player audio").forEach(a => {
        if (a !== audio) {
          a.pause();
          a.currentTime = 0;
          const otherBtn = a.parentElement.querySelector(".play-btn");
          const otherProgress = a.parentElement.querySelector(".progress");
          otherBtn.textContent = "▶️";
          otherProgress.style.width = "0%";
        }
      });

      if (audio.paused) {
        audio.play();
        playBtn.textContent = "⏸️";
      } else {
        audio.pause();
        playBtn.textContent = "▶️";
      }
    });

    audio.addEventListener("timeupdate", () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + "%";
    });

    audio.addEventListener("ended", () => {
      playBtn.textContent = "▶️";
      progress.style.width = "0%";
    });

    function setAudioTime(clientX) {
      const rect = progressBar.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newTime = (offsetX / rect.width) * audio.duration;
      audio.currentTime = newTime;
    }

    progressBar.addEventListener("click", e => setAudioTime(e.clientX));

    let isDragging = false;
    progressBar.addEventListener("mousedown", e => {
      isDragging = true;
      setAudioTime(e.clientX);
    });

    document.addEventListener("mouseup", () => (isDragging = false));
    document.addEventListener("mousemove", e => {
      if (isDragging) setAudioTime(e.clientX);
    });

    progressBar.addEventListener("touchstart", e => {
      e.preventDefault();
      const touch = e.touches[0];
      setAudioTime(touch.clientX);
    });

    progressBar.addEventListener("touchmove", e => {
      e.preventDefault();
      const touch = e.touches[0];
      setAudioTime(touch.clientX);
    });
  });
});
