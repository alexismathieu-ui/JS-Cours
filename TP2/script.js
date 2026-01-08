//////////////////////// Code fourni (ne pas moidifier) ////////////////////////

// Définir la taille du tableau de notes au hasard entre 15 et 30 éléments
let taille_minimum = 7;
let taille_maximum = 10;
let taille = Math.floor(Math.random() * (taille_maximum - taille_minimum + 1)) + taille_minimum;

// Déclarer le tableau pour stocker les notes
let notes = [];
// Définir la note maximale (pas besoin de définir la note minimale car elle est 0 par défaut)
let note_maximum = 20;

// Itérer autant de fois qu'on a de notes aléatoires à générer
for (let i = 0; i < taille; i++) {
    // Générer une note aléatoire entre 0 et note_maximum (inclus)
    let note = Math.floor(Math.random() * (note_maximum + 1));
    // Ajouter la note générée au tableau
    notes.push(note);
}

///////////////////////////////////////////////////////////////////////////////

let NonTri = [];

for (let i = 0; i < notes.length; i++){
    NonTri[i] = notes[i]

}

// PARTIE 1 - ETUDE DES VALEURS

let minNote = notes[0]

let maxNote = notes[0]


for (let i = 0; i < notes.length; i++){
    if (notes[i] < minNote) {
        minNote = notes[i];
    }

    if (notes[i] > maxNote) {
        maxNote = notes[i];
    }
}
console.log("La plus petite valeur du tableau : " + minNote);

console.log("La plus grande valeur du tableau : " + maxNote);

console.log("Le tableau en lui-même : " + notes);

console.log('===============================');

//PARTIE 2: PREMIERE ETAPE DU TRI 
let indiceMin = 0;
for (let i = 1; i < notes.length; i++) {
    if (notes[i] < notes[indiceMin]) {
        indiceMin = i;
    }
}

console.log("L'indice de la plus petite valeur du tableau : " + indiceMin);
console.log("La plus petite valeur du tableau : " + notes[indiceMin]);

console.log('===============================');

//PARTIE 3: ECHANGE DE VALEURS
let temp = notes[0];
notes[0] = notes[indiceMin];
notes[indiceMin] = temp;
console.log("Le tableau après échange : " + notes);


console.log('===============================');

//PARTIE 4: TRI PAR SELECTION COMPLET

for (let i = 0; i < notes.length - 1; i++) {
    let indiceMin = i;
    for (let j = i + 1; j < notes.length; j++) {
        if (notes[j] < notes[indiceMin]) {
            indiceMin = j;
        }
    }
    let temp = notes[i];
    notes[i] = notes[indiceMin];
    notes[indiceMin] = temp;
}

console.log("Le tableau trié : " + notes);

console.log('===============================');

//PARTIE 5 : AFFICHAGE DU RESULTAT

console.log("Le tableau avant tri était : " + NonTri);
console.log("Le tableau après tri est : " + notes);

console.log('===============================');

//BONUS

//Affichage du tableau a chaque échange sans le tri complet

let notesBonus = [];

for (let i = 0; i < NonTri.length; i++){
    notesBonus[i] = NonTri[i]
}

for (let i = 0; i < notesBonus.length - 1; i++) {
    let indiceMin = i;
    for (let j = i + 1; j < notesBonus.length; j++) {
        if (notesBonus[j] < notesBonus[indiceMin]) {
            indiceMin = j;
        }
    }
    let temp = notesBonus[i];
    notesBonus[i] = notesBonus[indiceMin];
    notesBonus[indiceMin] = temp;
    console.log("Le tableau après échange à l'itération " + (i + 1) + " : " + notesBonus);
}

console.log('========');

//Compter le nombre de vérifications et d’échanges effectués, puis les afficher à la fin du tri
let notesCount = [];
for (let i = 0; i < NonTri.length; i++){
    notesCount[i] = NonTri[i]
}
let verificationCount = 0;
let exchangeCount = 0;

for (let i = 0; i < notesCount.length - 1; i++) {
    let indiceMin = i;
    for (let j = i + 1; j < notesCount.length; j++) {
        verificationCount++;
        if (notesCount[j] < notesCount[indiceMin]) {
            indiceMin = j;
        }
    }
    if (indiceMin !== i) {
        let temp = notesCount[i];
        notesCount[i] = notesCount[indiceMin];
        notesCount[indiceMin] = temp;
        exchangeCount++;
    }
}

console.log("Nombre total de vérifications effectuées : " + verificationCount);
console.log("Nombre total d'échanges effectués : " + exchangeCount);

console.log('========');

//Récupérer le tableau trié et le trier par ordre décroissant avec un copier-coller modifié de votre tri par sélection, en incluant les deux premiers bonus. 

let notesDecroissant = [];
for (let i = 0; i < notes.length; i++){
    notesDecroissant[i] = notes[i]
}

let verificationCountDecroissant = 0;
let exchangeCountDecroissant = 0;
for (let i = 0; i < notesDecroissant.length - 1; i++) {
    let indiceMax = i;
    for (let j = i + 1; j < notesDecroissant.length; j++) {
        verificationCountDecroissant++;
        if (notesDecroissant[j] > notesDecroissant[indiceMax]) {
            indiceMax = j;
        }
    }
    if (indiceMax !== i) {
        let temp = notesDecroissant[i];
        notesDecroissant[i] = notesDecroissant[indiceMax];
        notesDecroissant[indiceMax] = temp;
        exchangeCountDecroissant++;
    }
    console.log("Le tableau après échange à l'itération " + (i + 1) + " : " + notesDecroissant);
}
console.log("Le tableau trié en ordre décroissant est : " + notesDecroissant);
console.log("Nombre total de vérifications effectuées (décroissant) : " + verificationCountDecroissant);
console.log("Nombre total d'échanges effectués (décroissant) : " + exchangeCountDecroissant);
