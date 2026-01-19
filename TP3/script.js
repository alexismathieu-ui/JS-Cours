// TP3 - UTILISATION DES OBJETS

//PARTIE 1 - GENERATION DES ELEVES

let prenomsPossibles = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank', 'Grace', 'Jackie','Roberto','Valorant','Salami','Croustibatte','Kevin','Zoe'];

let nombreEleves = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
let eleves = [];

for (let i = 0; i < nombreEleves; i++) {
    let prenomAleatoire = prenomsPossibles[Math.floor(Math.random() * prenomsPossibles.length)];
    let noteFrancais = Math.floor(Math.random() * 21);
    let noteMaths = Math.floor(Math.random() * 21);
    let noteHistoire = Math.floor(Math.random() * 21);
    let moyenne = (noteFrancais + noteMaths + noteHistoire) / 3;

    eleves.push({
        Prenom: prenomAleatoire,
        NoteFrancais: noteFrancais,
        NoteMaths: noteMaths,
        NoteHistoire: noteHistoire,
        Moyenne: moyenne
    });
}
console.log(eleves);

elevesNonTries = [];

for (let i = 0; i < eleves.length; i++){
    elevesNonTries[i] = eleves[i]
}

elevesmatiere = [];

for (let i = 0; i < eleves.length; i++){
    elevesmatiere[i] = eleves[i]
}

console.log('===============================');


//PARTIE 2 - ETUDE DES VALEURS

console.log("Nombre total d'élèves : " + eleves.length);

let minMoyenne = eleves[0].Moyenne;
let maxMoyenne = eleves[0].Moyenne;
for (let i = 1; i < eleves.length; i++) {
    if (eleves[i].Moyenne < minMoyenne) {
        minMoyenne = eleves[i].Moyenne;
    }
    if (eleves[i].Moyenne > maxMoyenne) {
        maxMoyenne = eleves[i].Moyenne;
    }
}
console.log("La plus petite moyenne : " + minMoyenne.toFixed(2));
console.log("La plus grande moyenne : " + maxMoyenne.toFixed(2));

console.log('===============================');

//PARTIE 3 - PREMIERE ETAPE DU TRI

let indiceMinMoyenne = 0;
for (let i = 1; i < eleves.length; i++) {
    if (eleves[i].Moyenne < eleves[indiceMinMoyenne].Moyenne) {
        indiceMinMoyenne = i;
    }
}

console.log("L'indice de l'élève avec la plus petite moyenne : " + indiceMinMoyenne);
console.log("Le prénom de cet élève : " + eleves[indiceMinMoyenne].Prenom);
console.log("La moyenne de cet élève : " + eleves[indiceMinMoyenne].Moyenne.toFixed(2));


console.log('===============================');

//PARTIE 4 - ECHANGE DE VALEURS

let tempEleve = eleves[0];
eleves[0] = eleves[indiceMinMoyenne];
eleves[indiceMinMoyenne] = tempEleve;
console.log("Le tableau des élèves après échange : ");

for (let i = 0; i < eleves.length; i++) {
    console.log("Prénom: " + eleves[i].Prenom + ", Moyenne: " + eleves[i].Moyenne.toFixed(2));
}


console.log('===============================');

//PARTIE 5 - TRI PAR SELECTION COMPLET

let verificationCount = 0; // Compteur de comparaisons
let exchangeCount = 0;     // Compteur d’échanges

// Boucle principale du tri
for (let i = 0; i < eleves.length - 1; i++) {
    let indiceMin = i; // Indice de la plus petite moyenne

    // Recherche de la plus petite moyenne
    for (let j = i + 1; j < eleves.length; j++) {
        verificationCount++; // Une comparaison est faite
        if (eleves[j].Moyenne < eleves[indiceMin].Moyenne) {
            indiceMin = j;   // Nouvelle plus petite moyenne trouvée
            exchangeCount++; // Échange potentiel détecté
        }
    }

    // Échange des élèves
    let temp = eleves[i];
    eleves[i] = eleves[indiceMin];
    eleves[indiceMin] = temp;
}

// Affichage du tableau trié
console.log("Le tableau des élèves trié par moyenne croissante : ");
for (let i = 0; i < eleves.length; i++) {
    console.log(
        "Prénom: " + eleves[i].Prenom +
        ", Moyenne: " + eleves[i].Moyenne.toFixed(2)
    );
}


console.log('===============================');

//PARTIE 6 - AFFICHAGE DU RESULTAT

console.log("Le tableau des élèves avant tri : ");
for (let i = 0; i < elevesNonTries.length; i++) {
    console.log("Prénom: " + elevesNonTries[i].Prenom + ", Moyenne: " + elevesNonTries[i].Moyenne.toFixed(2));
}

console.log('');
console.log("Nombre de vérifications effectuées : " + verificationCount);
console.log("Nombre d'échanges effectués : " + exchangeCount);


console.log('===============================');

//BONUS - TRI PAR MATIERE

//trier le tableau par notes obtenues dans chaque matière en question.

let matieres = ['NoteFrancais', 'NoteMaths', 'NoteHistoire'];

// Boucle sur chaque matière
for (let m = 0; m < matieres.length; m++) {
    let matiere = matieres[m]; // Matière actuelle
    let elevesMatiere = [];    // Tableau temporaire d'élèves

    // Copie des élèves dans le nouveau tableau
    for (let i = 0; i < elevesmatiere.length; i++) {
        elevesMatiere[i] = elevesmatiere[i];
    }

    // Tri des élèves par note
    for (let i = 0; i < elevesMatiere.length - 1; i++) {
        let indiceMax = i; // Indice de la meilleure note

        // Recherche de la meilleure note
        for (let j = i + 1; j < elevesMatiere.length; j++) {
            if (elevesMatiere[j][matiere] > elevesMatiere[indiceMax][matiere]) {
                indiceMax = j;
            }
        }

        // Échange des positions
        let temp = elevesMatiere[i];
        elevesMatiere[i] = elevesMatiere[indiceMax];
        elevesMatiere[indiceMax] = temp;
    }

    // Affichage du tableau trié
    console.log("Tableau des élèves trié par " + matiere + " : ");
    for (let i = 0; i < elevesMatiere.length; i++) {
        console.log(
            "Prénom: " + elevesMatiere[i].Prenom +
            ", " + matiere + ": " + elevesMatiere[i][matiere]
        );
    }
    console.log(' ');
}

console.log('===============================');

