// TP4 - UTILISATION DES FONCTIONS

// PARTIE 1 - GENERERELEVES

function genererEleves() {
  let prenomsPossibles = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Jackie",
    "Roberto",
    "Valorant",
    "Salami",
    "Croustibatte",
    "Kevin",
    "Zoe",
  ];
  let nombreEleves = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
  let eleves = [];
  for (let i = 0; i < nombreEleves; i++) {
    let prenomAleatoire =
      prenomsPossibles[Math.floor(Math.random() * prenomsPossibles.length)];
    let noteFrancais = Math.floor(Math.random() * 21);
    let noteMaths = Math.floor(Math.random() * 21);
    let noteHistoire = Math.floor(Math.random() * 21);
    let moyenne = (noteFrancais + noteMaths + noteHistoire) / 3;
    eleves.push({
      Prenom: prenomAleatoire,
      NoteFrancais: noteFrancais,
      NoteMaths: noteMaths,
      NoteHistoire: noteHistoire,
      Moyenne: moyenne,
    });
  }
  return eleves;
}

// PARTIE 2 - AFFICHAGEELEVES

function affichageEleves(eleves) {
  for (let i = 0; i < eleves.length; i++) {
    console.log(
      "Prénom: " +
        eleves[i].Prenom +
        ", Note Français: " +
        eleves[i].NoteFrancais +
        ", Note Maths: " +
        eleves[i].NoteMaths +
        ", Note Histoire: " +
        eleves[i].NoteHistoire +
        ", Moyenne: " +
        eleves[i].Moyenne.toFixed(2)
    );
  }
}

//PARTIE 3 - TROUVERMOYENNEMIN

function trouvermoyennemin(eleves, IndexDepart) {
  let indiceMinMoyenne = IndexDepart;

  for (let i = IndexDepart + 1; i < eleves.length; i++) {
    if (eleves[i].Moyenne < eleves[indiceMinMoyenne].Moyenne) {
      indiceMinMoyenne = i;
    }
  }

  return indiceMinMoyenne;
}

//PARTIE 4 - AFFICHEEDONNEES

function afficherDonnees(eleves) {
  console.log("Nombre total d'élèves : " + eleves.length);
  let indexMin = trouvermoyennemin(eleves, 0);
  let minMoyenne = eleves[indexMin].Moyenne;
  let maxMoyenne = eleves[0].Moyenne;
  for (let i = 1; i < eleves.length; i++) {
    if (eleves[i].Moyenne > maxMoyenne) {
      maxMoyenne = eleves[i].Moyenne;
    }
  }
  console.log("Moyenne la plus basse : " + minMoyenne.toFixed(2));
  console.log("Moyenne la plus haute : " + maxMoyenne.toFixed(2));
}

//PARTIE 5 - SWAP

function swap(eleves, indexA, indexB) {
  let temp = eleves[indexA];
  eleves[indexA] = eleves[indexB];
  eleves[indexB] = temp;
}

//PARTIE 6 - TRIPARSELECTION
function triParSelection(eleves) {
  for (let i = 0; i < eleves.length - 1; i++) {
    let indiceMin = trouvermoyennemin(eleves, i);
    swap(eleves, i, indiceMin);
  }
  afficherDonnees(eleves);
  console.log("");
}

//PARTIE 7 - APPEL  DES FONCTIONS

function main() {
  let eleves = genererEleves();
  console.log("Tableau des élèves généré : ");
  affichageEleves(eleves);
  console.log("===============================");
  console.log("Données des élèves : ");
  afficherDonnees(eleves);
  console.log("===============================");
  console.log("Tri par séléction des élèves : ");
  triParSelection(eleves);
  console.log("Tableau des élèves trié : ");
  affichageEleves(eleves);
}

console.log("Exécution de la fonction main : ");
main();
