document.addEventListener("DOMContentLoaded", () => {
  //Elementos del Juego
  const cuadrado = document.querySelector("#cuadrado");
  const cuadrado2 = document.querySelector("#cuadrado2");
  const powerPill = document.querySelector("#powerPill");
  const scoreElement = document.querySelector("#score");
  const timerElement = document.querySelector("#timer");
  const musicaFondo = document.getElementById("musicaFondo");
  const botonPausar = document.getElementById("pausarMusica");
  const muteButton = document.getElementById("muteButton");
  const menuButton = document.querySelector("#menuButton");
  const pointSound = document.getElementById("point");
  const bonusSound = document.querySelector("#bonusPill");
  const initialPositionButton = document.querySelector("#initialPosition");
  const modal = document.getElementById("myModal");
  const closeModal = document.getElementById("closeModal");
  const playButton = document.getElementById("playButton");
  const controlButton = document.getElementById("controlButton");
  const modalControles = document.getElementById("modalControles");
  const closeControles = document.getElementById("closeControles");
  document.getElementById("cuadrado2").classList.add("spike");
  document.getElementById("cuadrado2").classList.remove("spike");
  const tiempoLimite = 30;
  const spikeDuration = 10000;

  //Variables del Juego
  let jerryIsSpike = false;
  let powerPillActive = false;
  let powerPillTimeout;
  let powerPillInterval;
  let x1, y1, x2, y2;
  let speed1 = 5.5;
  let speed2 = 6;
  let score1 = 0;
  let score2 = 0;
  let tiempoRestante = tiempoLimite;
  const keys = {};

  // ****************EVENT LISTENERS************************
  muteButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  playButton.addEventListener("click", () => {
    modal.style.display = "none";
    iniciarJuego();
  });

  menuButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  muteButton.addEventListener("click", () => {
    toggleMusica();
  });

  botonPausar.addEventListener("click", () => {
    toggleMusica();
  });

  window.addEventListener("load", () => {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  controlButton.addEventListener("click", () => {
    modalControles.style.display = "block";
  });

  closeControles.addEventListener("click", () => {
    modalControles.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  initialPositionButton.addEventListener("click", () => {
    resetGame();
    alert("Juego reiniciado. ¡Buena suerte!");
  })

  function toggleControlesModal() {
    const modal = document.getElementById("modalControles");
    if (modal.style.display === "block") {
      modal.style.display = "none";
    } else {
      modal.style.display = "block";
    }
  }

  //Manejo de eventos del teclado
  function handleKeyPress(e) {
    if (e.key === "m" || e.key === "M") {
      toggleMusica();
    }
    if (e.key === "r" || e.key === "R") {
      initialPositionButton.click();
    }
    if (e.key === "c" || e.key === "C") {
      toggleControlesModal();
    }
    if (e.key === "j" || e.key === "J"){
    playButton.click();
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      } else {
        modal.style.display = "block";
      }
    }
  });
  

  document.addEventListener("keydown", (e) => {
    handleKeyPress(e);
  });

  window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
  });

  window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
  });

  //Inicializacion de la musica de fondo
  musicaFondo.src = "music/music.mp3";
  musicaFondo.addEventListener("canplay", () => {
    musicaFondo.play();
  });
  musicaFondo.volume = 0.2;

  // ****************JUEGO********************

  //Funcion para iniciar el juego
  function iniciarJuego() {
    resetGame();
    generarPowerPill();
  }

  //Funciones para reiniciar el juego
  function resetGame() {
    clearInterval(powerPillInterval);
    generarPosicionesAleatorias();
    score1 = 0;
    score2 = 0;
    tiempoRestante = tiempoLimite;
    actualizarScoreYTimer();
    generarPowerPill();
  }
  function reiniciarJuego() {
    generarPosicionesAleatorias();
    tiempoRestante = tiempoLimite;
    speed1 = 5.5;
    speed2 = 6;
    cuadrado2.classList.remove("poder-activo");
    generarPowerPill();
  }

  //Funcion para activar/desactivar la musica de fondo
  function toggleMusica() {
    if (musicaFondo.paused) {
      musicaFondo.play();
      musicaPausada = false;
      botonPausar.textContent = "Pausar Música";
    } else {
      musicaFondo.pause();
      musicaPausada = true;
      botonPausar.textContent = "Reanudar Música";
    }
  }

  //Actualizacion de la puntuacion y temporizador
  function actualizarScoreYTimer() {
    scoreElement.textContent = `Puntuación: Tom: ${score1}, Jerry: ${score2}`;
    timerElement.textContent = `Tiempo restante: ${tiempoRestante}`;
  }

  //Genera las posiciones aleatorias de los personajes
  function generarPosicionesAleatorias() {
    x1 = Math.random() * window.innerWidth;
    y1 = Math.random() * window.innerHeight;
    x2 = Math.random() * window.innerWidth;
    y2 = Math.random() * window.innerHeight;
    cuadrado.style.transform = `translate(${x1}px, ${y1}px)`;
    cuadrado2.style.transform = `translate(${x2}px, ${y2}px)`;
  }

  // Función para envolver las coordenadas dentro de los límites de la ventana
  function wrapAround(x, y) {
    if (x < 0) {
      x = window.innerWidth;
    } else if (x > window.innerWidth) {
      x = 0;
    }
    if (y < 0) {
      y = window.innerHeight;
    } else if (y > window.innerHeight) {
      y = 0;
    }
    return [x, y];
  }

  // Función para comprobar la colisión entre Tom y Jerry
  function checkCollision() {
    const rect1 = cuadrado.getBoundingClientRect();
    const rect2 = cuadrado2.getBoundingClientRect();
    if (
      rect1.right >= rect2.left &&
      rect1.left <= rect2.right &&
      rect1.bottom >= rect2.top &&
      rect1.top <= rect2.bottom
    ) {
      score1++;
      pointSound.play();
      actualizarScoreYTimer();
      reiniciarJuego();
    }
  }

  // Controla el movimiento y la colisión de Tom (cuadrado)
  function moverCuadrado() {
    if (keys["ArrowUp"]) {
      y1 -= speed1;
    }
    if (keys["ArrowDown"]) {
      y1 += speed1;
    }
    if (keys["ArrowLeft"]) {
      x1 -= speed1;
    }
    if (keys["ArrowRight"]) {
      x1 += speed1;
    }

    [x1, y1] = wrapAround(x1, y1);
    cuadrado.style.transform = `translate(${x1}px, ${y1}px)`;

    checkCollision();
  }

  // Controla el movimiento y la colisión de Jerry (cuadrado2)
  function moverBlock() {
    if (keys["w"]) {
      y2 -= speed2;
    }
    if (keys["s"]) {
      y2 += speed2;
    }
    if (keys["a"]) {
      x2 -= speed2;
    }
    if (keys["d"]) {
      x2 += speed2;
    }

    [x2, y2] = wrapAround(x2, y2);
    cuadrado2.style.transform = `translate(${x2}px, ${y2}px)`;

    checkCollision();
  }

  // Actualiza el tiempo restante
  function actualizarTiempoRestante() {
    tiempoRestante--;
    actualizarScoreYTimer();

    if (tiempoRestante <= 0) {
      score2++;
      pointSound.play();
      actualizarScoreYTimer();
      reiniciarJuego();
    }
  }

  generarPosicionesAleatorias();
  temporizador = setInterval(actualizarTiempoRestante, 1000);

  // Inicia el ciclo de animación del juego
  function animate() {
    moverCuadrado();
    moverBlock();
    handlePowerPillCollision();
    requestAnimationFrame(animate);
  }

  animate();

  // ***************PILDORA DE PODER*************************

  function controlarGeneracionPowerPill() {
    generarPowerPill();
  }

  // Genera la píldora de poder de forma aleatoria
  function generarPowerPill() {
    if (!powerPillActive) {
      const duracionPoder = 10000; // Duración en milisegundos (10 segundos)
      const x = Math.random() * (window.innerWidth - 20);
      const y = Math.random() * (window.innerHeight - 20);
      powerPill.style.transform = `translate(${x}px, ${y}px)`;
      powerPill.style.display = "block";
      powerPillActive = true;

      powerPillTimeout = setTimeout(() => {
        powerPill.style.display = "none";
        powerPillActive = false;
        cuadrado2.src = "jerry.png"; // Restaurar la imagen normal de Jerry
      }, duracionPoder);

      powerPillInterval = setInterval(controlarGeneracionPowerPill, 15000);
    }
  }

  // Controla la colisión con la píldora de poder
  function handlePowerPillCollision() {
    if (powerPillActive) {
      const rect1 = cuadrado.getBoundingClientRect();
      const rect2 = cuadrado2.getBoundingClientRect();
      const rectPill = powerPill.getBoundingClientRect();

      if (
        rect1.right >= rectPill.left &&
        rect1.left <= rectPill.right &&
        rect1.bottom >= rectPill.top &&
        rect1.top <= rectPill.bottom
      ) {
        bonusSound.play();
        powerPill.style.display = "none";
        powerPillActive = false;
        clearTimeout(powerPillTimeout);

        speed1 += 4;
      }

      if (
        rect2.right >= rectPill.left &&
        rect2.left <= rectPill.right &&
        rect2.bottom >= rectPill.top &&
        rect2.top <= rectPill.bottom
      ) {
        powerPill.style.display = "none";
        powerPillActive = false;
        clearTimeout(powerPillTimeout);

        enablePlayer2EatingPlayer1();
      }
    }
  }

  // Permite que Jerry (cuadrado2) coma a Tom (cuadrado)
  function enablePlayer2EatingPlayer1() {
    bonusSound.play();
    const jerryOriginalImage = cuadrado2.style.backgroundImage;
    jerryIsSpike = true;
    cuadrado2.style.backgroundImage = "url(../images/spike.png)";
    document.getElementById("cuadrado2").classList.add("spike");

  

    spikeTimeout = setTimeout(() => {
      cuadrado2.style.backgroundImage = jerryOriginalImage; // Restaura la imagen de Jerry
      jerryIsSpike = false;
      document.getElementById("cuadrado2").classList.remove("spike");
    }, spikeDuration);
  }
  

  // Función para comprobar la colisión entre Tom y Jerry
  function checkCollision() {
    const rect1 = cuadrado.getBoundingClientRect();
    const rect2 = cuadrado2.getBoundingClientRect();

    if (
      rect1.right >= rect2.left &&
      rect1.left <= rect2.right &&
      rect1.bottom >= rect2.top &&
      rect1.top <= rect2.bottom
    ) {
      if (jerryIsSpike) {
        score2++; // Jerry como Spike atrapa a Tom y suma puntos
        pointSound.play();
        actualizarScoreYTimer();
        reiniciarJuego();
      } else {
        score1++; // Tom atrapa a Jerry
        pointSound.play();
        actualizarScoreYTimer();
        reiniciarJuego();
      }
    }
  }

  const intervalo = setInterval(checkEating, 100);

  setTimeout(() => {
    clearInterval(intervalo);
  }, duracionPoder);
});


