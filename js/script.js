let isUnlocked = false;
const unlockBtn = document.getElementById("unlockBtn");

unlockBtn.addEventListener("click", async () => {
  const password = document.getElementById("passwordInput").value;

  try {
    await signInWithEmailAndPassword(
      window.firebaseAuth,
      "love@birthday.com",
      password,
    );

    /* SUCCESS */
    isUnlocked = true;
    document.getElementById("passwordScreen").style.display = "none";
    document.getElementById("container").style.display = "block";
  } catch (error) {
    document.getElementById("passwordMessage").innerText =
      "Hmm that's not the right password 😜\n Hint: It's the day our story begins";
  }
});

const birthday = new Date("March 24, 2026 00:00:00").getTime();

const startBtn = document.getElementById("startBtn");

const timer = setInterval(function () {
  const now = new Date().getTime();

  const distance = birthday - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));

  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

  if (distance < 0) {
    clearInterval(timer);

    document.getElementById("countdown").innerHTML = "It's your birthday ❤️";

    startBtn.disabled = false;

    startBtn.classList.add("enabled");
  }
}, 1000);

function createHeart() {
  const heart = document.createElement("div");

  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 3 + Math.random() * 5 + "s";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

setInterval(createHeart, 500);

const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

startBtn.addEventListener("click", () => {
  music.play();

  showQuestion(0);
});

musicToggle.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    musicToggle.innerText = "🔊";
  } else {
    music.pause();
    musicToggle.innerText = "🔈";
  }
});

const questions = [
  "Are you the most beautiful girl in the world? ❤️",

  "Do you know how much I love you? 💖",

  "Are you ready for your birthday surprise? 🎁",
];

let currentQuestion = 0;

const questionBox = document.getElementById("questionBox");
const questionText = document.getElementById("questionText");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const response = document.getElementById("response");

function showQuestion(index) {
  document.querySelector(".container").style.display = "none";
  questionBox.classList.remove("hidden");
  questionText.innerText = questions[index];
  response.innerText = "";
}

function resetNoButton() {
  noBtn.style.position = "static";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.transform = "";
}

yesBtn.addEventListener("click", () => {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    resetNoButton();
    showQuestion(currentQuestion);
  } else {
    questionText.innerText = "Good girl 😘 let's continue the surprise";

    yesBtn.style.display = "none";
    noBtn.style.display = "none";
    setTimeout(() => {
      questionBox.style.display = "none";
      document.getElementById("gameSection").classList.remove("hidden");
      createGame();
    }, 4000);
  }
});

noBtn.addEventListener("click", () => {
  response.innerText = "Hmm that's not the right answer 😜 try again!";
});

noBtn.addEventListener("mouseover", () => {
  const container = document.getElementById("questionBox");

  const containerRect = container.getBoundingClientRect();

  const buttonWidth = noBtn.offsetWidth;
  const buttonHeight = noBtn.offsetHeight;

  const maxX = containerRect.width - buttonWidth - 20;
  const maxY = containerRect.height - buttonHeight - 20;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
});

const photos = [
  "images/photo7.jpg",
  "images/photo13.jpg",
  "images/photo1.jpg",
  "images/photo9.jpg",
  "images/photo14.jpg",
  "images/photo12.jpg",
];

let cards = [...photos, ...photos];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

cards = shuffle(cards);

const grid = document.getElementById("memoryGrid");

function createGame() {
  if (!isUnlocked) return;
  grid.innerHTML = "";

  cards.forEach((photo, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = photo;
    card.innerHTML = `
<div class="front">💖</div>
<img src="${photo}">
`;
    card.addEventListener("click", flipCard);
    grid.appendChild(card);
  });
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function flipCard() {
  if (lockBoard) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;

  checkMatch();
}

function checkMatch() {
  const match = firstCard.dataset.image === secondCard.dataset.image;

  if (match) {
    showHeart();

    resetCards();
  } else {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");

      resetCards();
    }, 1000);
  }
}

function resetCards() {
  [firstCard, secondCard, lockBoard] = [null, null, false];

  checkWin();
}

function checkWin() {
  const flipped = document.querySelectorAll(".card.flip");

  if (flipped.length === cards.length) {
    document.getElementById("gameMessage").innerText =
      "Looks like you remember all our memories ❤️";

    document.getElementById("continueBtn").classList.remove("hidden");
  }
}

function showHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart-pop");
  heart.innerText = "❤️";
  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.top = Math.random() * window.innerHeight + "px";
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1000);
}

const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", () => {
  document.getElementById("gameSection").style.display = "none";

  document.getElementById("cakeSection").classList.remove("hidden");
  animateCake();
});

const blowBtn = document.getElementById("blowBtn");
const flames = document.querySelectorAll(".flame");

blowBtn.addEventListener("click", () => {
  flames.forEach((flame) => {
    flame.style.display = "none";

    createSmoke(flame.parentElement);
  });

  createSparkles();
  document.getElementById("cakeMessage").innerText = "Happy Birthday Hetu ❤️";
  document.getElementById("celebrateBtn").classList.remove("hidden");
});

function createSmoke(candle) {
  for (let i = 0; i < 3; i++) {
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");
    smoke.style.left = "0px";
    smoke.style.top = "-10px";
    candle.appendChild(smoke);

    setTimeout(() => smoke.remove(), 2000);
  }
}

function createSparkles() {
  const sparkleSound = document.getElementById("sparkleSound");

  sparkleSound.currentTime = 0;
  sparkleSound.play();
  for (let i = 0; i < 20; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.innerText = "✨";
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1000);
  }
}

function animateCake() {
  if (!isUnlocked) return;
  const plate = document.querySelector(".plate");
  const base = document.querySelector(".cake-base");
  const icing = document.querySelector(".icing");
  const strawberries = document.querySelector(".strawberries");
  const candles = document.querySelector(".candles");
  const flames = document.querySelectorAll(".flame");

  /* plate appears */

  plate.style.opacity = 1;

  /* cake base rises */

  setTimeout(() => {
    base.style.opacity = 1;
    base.style.animation = "cakeBounce 1s";
  }, 800);

  /* icing appears */

  setTimeout(() => {
    icing.style.opacity = 1;
  }, 1600);

  /* strawberries drop */

  setTimeout(() => {
    strawberries.style.opacity = 1;
    strawberries.style.animation = "cakeBounce 1s";
  }, 2400);

  /* candles appear */

  setTimeout(() => {
    candles.style.opacity = 1;
  }, 3200);

  /* light candles one by one */

  flames.forEach((flame, i) => {
    setTimeout(
      () => {
        flame.style.opacity = 1;
      },
      3800 + i * 600,
    );
  });

  /* show blow button */

  setTimeout(() => {
    document.getElementById("cakeTitle").innerText =
      "Make a wish and blow the candles 🎂";

    document.getElementById("blowBtn").classList.remove("hidden");
  }, 5500);
}

// const blowBtn = document.getElementById("blowBtn");

blowBtn.addEventListener("click", blowCandles);

function blowCandles() {
  if (!isUnlocked) return;
  const flames = document.querySelectorAll(".flame");
  const smokes = document.querySelectorAll(".smoke");
  const cake = document.querySelector(".cake");

  /* extinguish flames */

  flames.forEach((flame) => {
    flame.style.opacity = 0;
  });

  /* smoke effect */

  smokes.forEach((smoke, i) => {
    setTimeout(() => {
      smoke.style.opacity = 1;
      smoke.style.animation = "smokeRise 2s forwards";
    }, i * 300);
  });

  /* cake sparkle */

  cake.style.animation = "cakeSparkle 1s infinite";

  /* move to next page after dramatic pause */

  setTimeout(() => {
    cake.style.animation = "none";
    document.getElementById("celebrateBtn").classList.remove("hidden");
  }, 3500);
}

const celebrateBtn = document.getElementById("celebrateBtn");

celebrateBtn.addEventListener("click", () => {
  document.getElementById("cakeSection").style.display = "none";

  showGallery();
});

const galleryPhotos = [
  {
    src: "images/photo1.jpg",
    caption: "The moment I fell for you ❤️",
  },

  {
    src: "images/photo2.jpg",
    caption: "Our First date",
  },

  {
    src: "images/photo3.jpg",
    caption: "Our first traditional date",
  },
  {
    src: "images/photo15.jpg",
    caption: "Our movie dates",
  },

  {
    src: "images/photo4.jpg",
    caption: "Our first Diwali",
  },

  {
    src: "images/photo5.jpg",
    caption: "Her favourite wallpaper",
  },

  {
    src: "images/photo6.jpg",
    caption: "Our game date",
  },
  {
    src: "images/photo8.jpg",
    caption: "Our first Christmas",
  },

  {
    src: "images/photo11.jpg",
    caption: "Our cooking chaos",
  },
  {
    src: "images/photo16.jpg",
    caption: "Our Christmas aesthetic",
  },

  {
    src: "images/photo12.jpg",
    caption: "My bday bash",
  },
];

function showGallery() {
  if (!isUnlocked) return;
  document.getElementById("gallerySection").classList.remove("hidden");

  createCarousel();

  /* show button later */

  setTimeout(() => {
    document.getElementById("loveMeterBtn").classList.remove("hidden");
  }, 1500);
}

function openViewer(src, caption) {
  const viewer = document.getElementById("photoViewer");

  document.getElementById("viewerImg").src = src;
  document.getElementById("viewerCaption").innerText = caption;

  viewer.classList.remove("hidden");
}

document.getElementById("photoViewer").addEventListener("click", () => {
  document.getElementById("photoViewer").classList.add("hidden");
});

function createCarousel() {
  if (!isUnlocked) return;
  const carousel = document.getElementById("carousel");

  carousel.innerHTML = "";

  const total = galleryPhotos.length;
  const angle = 360 / total;
  const radius = 250; // distance from center

  galleryPhotos.forEach((photo, i) => {
    const item = document.createElement("div");
    item.className = "carousel-item";

    /* position in 3D circle */

    const rotateY = i * angle;

    item.style.transform = `rotateY(${rotateY}deg) translateZ(${radius}px)`;

    /* content */

    item.innerHTML = `<img src="${photo.src}">`;

    /* click → open fullscreen */

    item.addEventListener("click", () => {
      openViewer(photo.src, photo.caption);
    });

    carousel.appendChild(item);
  });
}

let currentRotation = 0;
let isAnimating = true;

function autoRotate() {
  if (isAnimating) {
    currentRotation += 0.2;

    const carousel = document.getElementById("carousel");

    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  }

  requestAnimationFrame(autoRotate);
}

autoRotate();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    isAnimating = false;
  } else {
    isAnimating = true;

    // 🔥 force re-render to avoid freeze
    const carousel = document.getElementById("carousel");

    carousel.style.transform = `rotateY(${currentRotation}deg)`;
  }
});

window.addEventListener("focus", () => {
  const carousel = document.getElementById("carousel");

  carousel.style.transform = `rotateY(${currentRotation}deg)`;
});

let isDragging = false;
let startX = 0;

const carousel = document.getElementById("carousel");

/* mouse */

carousel.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const diff = e.clientX - startX;

  currentRotation += diff * 0.3;

  carousel.style.transform = `rotateY(${currentRotation}deg)`;

  startX = e.clientX;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

/* touch (mobile) */

carousel.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const diff = e.touches[0].clientX - startX;

  currentRotation += diff * 0.3;

  carousel.style.transform = `rotateY(${currentRotation}deg)`;

  startX = e.touches[0].clientX;
});

document.addEventListener("touchend", () => {
  isDragging = false;
});

const loveMeterBtn = document.getElementById("loveMeterBtn");

loveMeterBtn.addEventListener("click", () => {
  document.getElementById("gallerySection").style.display = "none";

  document.getElementById("loveMeterSection").classList.remove("hidden");
});

const slider = document.getElementById("loveSlider");

const loveValue = document.getElementById("loveValue");

const loveMessage = document.getElementById("loveMessage");

slider.addEventListener("input", () => {
  const value = slider.value;

  loveValue.innerText = value + "%";

  if (value < 30) {
    loveMessage.innerText = "Only this much? 🤨";
  } else if (value < 70) {
    loveMessage.innerText = "Hmm I think you love me more 😏";
  } else if (value < 100) {
    loveMessage.innerText = "Almost there ❤️";
  } else {
    loveMessage.innerText = "I knew it ❤️";

    showHeartBurst();

    document.getElementById("letterBtn").classList.remove("hidden");
  }
});

function showHeartBurst() {
  for (let i = 0; i < 25; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heartBurst");
    heart.innerText = "💖";
    heart.style.left = Math.random() * window.innerWidth + "px";
    heart.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1500);
  }
}

const letterBtn = document.getElementById("letterBtn");

letterBtn.addEventListener("click", () => {
  document.getElementById("loveMeterSection").style.display = "none";

  document.getElementById("letterSection").classList.remove("hidden");
});

const envelope = document.getElementById("envelope");

document.getElementById("openLetterBtn").addEventListener("click", () => {
  document.getElementById("letterViewer").classList.remove("hidden");
  document.getElementById("toVideoBtn").classList.remove("hidden");
});

document.getElementById("letterViewer").addEventListener("click", () => {
  document.getElementById("letterViewer").classList.add("hidden");
});

document.getElementById("toVideoBtn").addEventListener("click", () => {
  document.getElementById("letterSection").style.display = "none";
  document.getElementById("letterViewer").classList.add("hidden");

  document.getElementById("videoSection").classList.remove("hidden");
  music.pause();
  musicToggle.innerText = "🔈";
});

document.getElementById("finalSceneBtn").addEventListener("click", () => {
  document.getElementById("videoSection").style.display = "none";
  document.getElementById("finalScene").classList.remove("hidden");
  document.getElementById("birthdayVideo").pause();
  music.play();
  musicToggle.innerText = "🔊";

  createStars();

  setTimeout(() => {
    launchFireworks();
  }, 2000);

  setTimeout(() => {
    document.getElementById("loveText").classList.remove("hidden");
  }, 4000);
});

function createStars() {
  if (!isUnlocked) return;
  const starContainer = document.getElementById("stars");

  for (let i = 0; i < 120; i++) {
    const star = document.createElement("div");

    star.classList.add("star");

    star.style.left = Math.random() * 100 + "vw";
    star.style.top = Math.random() * 100 + "vh";

    star.style.animationDelay = Math.random() * 2 + "s";

    starContainer.appendChild(star);
  }
}

function launchFireworks() {
  if (!isUnlocked) return;
  const fireworkSound = document.getElementById("fireworkSound");

  fireworkSound.currentTime = 0;
  fireworkSound.play();
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const fire = document.createElement("div");

      fire.classList.add("firework");

      fire.innerText = ["🎆", "✨", "💖", "🎇"][Math.floor(Math.random() * 4)];

      fire.style.left = Math.random() * 100 + "vw";
      fire.style.top = Math.random() * 100 + "vh";

      document.body.appendChild(fire);

      setTimeout(() => fire.remove(), 1500);
    }, i * 120);
  }
}

Object.defineProperty(window, "isUnlocked", {
  value: false,
  writable: false,
});
