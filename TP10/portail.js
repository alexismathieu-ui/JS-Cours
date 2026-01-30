let skinPath = null;
const form = document.getElementById("portail-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pseudo = document.getElementById("pseudo").value;
  const backend = document.getElementById("backend").value;

  console.clear();
  console.log("%c[ PORTAIL CYBER ]", "color:#00fff2; font-size:16px;");
  console.log("%cInitialisation...", "color:#ff00ff");
  console.log("Pseudo :", pseudo);
  console.log("Backend :", backend);
  // Vérification du skin
  if (!skinPath) {
    alert("Veuillez choisir un skin");
    return;
  }
  console.log("Skin :", skinPath);

  localStorage.setItem("pseudo", pseudo);
  localStorage.setItem("backend", backend);
  localStorage.setItem("skinPath", skinPath);

  Loading();
});


const style = document.createElement("style");
document.head.appendChild(style);

/*CONFIGURATION DES SKINS*/

const SKINS_PATH = "assets/";
const SKINS_COUNT = 29;

// Taille d'une frame dans la spritesheet
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;

// Position de la frame dans la spritesheet
const FRAME_X = 0;
const FRAME_Y = 640;

/* ELEMENTS DU DOM */

const openBtn = document.getElementById("open-skin-modal");
const closeBtn = document.getElementById("close-skin-modal");
const modal = document.getElementById("skin-modal");

const skinsContainer = document.getElementById("skins-container");

const previewCanvas = document.getElementById("skin-preview");
const previewCtx = previewCanvas.getContext("2d");

/*GESTION DE LA MODALE*/

openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

/*CHARGEMENT DU SKIN*/

const defaultSkin = new Image();
defaultSkin.src = `${SKINS_PATH}1.png`;

defaultSkin.onload = () => {
  previewCtx.drawImage(
    defaultSkin,
    FRAME_X,
    FRAME_Y,
    FRAME_WIDTH,
    FRAME_HEIGHT,
    0,
    0,
    previewCanvas.width,
    previewCanvas.height
  );
};

/*GENERATION DES SKINS*/

for (let i = 1; i <= SKINS_COUNT; i++) {
  // Création du canvas
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  canvas.classList.add("skin-canvas");

  const ctx = canvas.getContext("2d");

  // Chargement de l'image
  const img = new Image();
  img.src = `${SKINS_PATH}${i}.png`;

  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      FRAME_X,
      FRAME_Y,
      FRAME_WIDTH,
      FRAME_HEIGHT,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  /*SELECTION DU SKIN*/

  canvas.addEventListener("click", () => {
    skinPath = `${SKINS_PATH}${i}.png`;

    console.log("Skin sélectionné :", skinPath);
    localStorage.setItem("skinPath", skinPath);

    // Nettoyage du preview
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

    // Affichage du nouveau skin
    previewCtx.drawImage(
      img,
      FRAME_X,
      FRAME_Y,
      FRAME_WIDTH,
      FRAME_HEIGHT,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    );

    // Changement du texte du bouton
    openBtn.textContent = "Modifier le skin";

    // Fermeture de la modale
    modal.classList.add("hidden");
  });

  skinsContainer.appendChild(canvas);
}

/*LOADING*/
function Loading() {
  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 5; // Incrémente de 5 à 15%
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);
      console.log("%cChargement terminé !", "color:#00ff00");
      console.log(
        "%cBienvenue dans Arena JS.",
        "color:#00fff2; font-size:36px;"
      );
    } else {
      console.log(`%cChargement... ${progress}%`, "color:#ffff00");
    }
  }, 500);
}

/*LOCAL STORAGE POUR LE PSEUDO ET BACKEND*/
const pseudoInput = document.getElementById("pseudo");
const backendInput = document.getElementById("backend");

// Charger les valeurs sauvegardées au chargement de la page
window.addEventListener("load", () => {
  const savedPseudo = localStorage.getItem("pseudo");
  const savedbackend = localStorage.getItem("backend");

  if (savedPseudo) pseudoInput.value = savedPseudo;
  if (savedbackend) backendInput.value = savedbackend;

  // Sauvegarder les valeurs à chaque modification
  pseudoInput.addEventListener("input", () => {
    localStorage.setItem("pseudo", pseudoInput.value);
  });

  backendInput.addEventListener("input", () => {
    localStorage.setItem("backend", backendInput.value);
  });

});

form.addEventListener("submit", () => {
  setTimeout(() => {
    window.location.href = "game.html";
  }, 2000); // Délai de 2 secondes avant la redirection
});



