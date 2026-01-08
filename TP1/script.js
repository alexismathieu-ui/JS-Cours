//Parti 1- Information générale

const className = 'Math 101';
let students = 15;
let ClassOpen = true;

console.log(className);
console.log(students);
console.log(ClassOpen);

console.log('============================================')

//Partie 2 - Représenter un élève

let student = {
    name: 'Jaqueline',
    MathNote: 18,
    FrenchNote: 7
};

console.log(student.name);


console.log('============================================')

//Partie 3 - Gérer plusieurs élèves

let studentsList = [
    {
        name: 'Marguerrite',
        MathNote: 18,
        FrenchNote: 19
    },
    {
        name: 'Marc',
        MathNote: 18,
        FrenchNote: 9
    },
    {
        name: 'Sophie',
        MathNote: 9,
        FrenchNote: 16
    },
    {
        name: 'Timmy',
        MathNote: 14,
        FrenchNote: 16
    },
    {
        name: 'Coca',
        MathNote: 17,
        FrenchNote: 6
    },
    {
        name: 'Milka',
        MathNote: 9,
        FrenchNote: 12
    },
    {
        name: 'Jack',
        MathNote: 7,
        FrenchNote: 14
    }
    
];

for (let i = 0; i < studentsList.length; i++) {
    console.log(studentsList[i].name);
}


console.log('============================================')

//Partie 4- Calcul de la moyenne

for (let i = 0; i < studentsList.length; i++) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    let average = averagecalculated;
    console.log(average);
}

console.log('============================================')

//Partie 5- Résultat de l'élève

for (let i = 0; i < studentsList.length; i++) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    let isAdmitted = averagecalculated;
    if (isAdmitted >= 10) {
        console.log(`admis`);
    } else {
        console.log(`non admis`);
    }
}

console.log('============================================')

//Partie 6- Mention

for (let i = 0; i < studentsList.length; i++) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    let average = averagecalculated;
    let mention = '';
    switch (true) {
        case (average < 10):
            mention = 'Insuffisant';
            break;
        case (average >= 10 && average < 12):
            mention = 'Passable';
            break;
        case (average >= 12 && average < 14):
            mention = 'Assez Bien';
            break;
        case (average >= 14 && average < 16):
            mention = 'Bien';
            break;
        case (average >= 16):
            mention = 'Très Bien';
            break;
    }
    console.log(mention);
}

console.log('============================================')

//Partie 7- Statistiques de la classe

let i = 0;
let admittedCount = 0;

while (i < studentsList.length) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    let average = averagecalculated;
    if (average >= 10) {
        admittedCount++;
    }
    i++;
}

console.log(admittedCount);
i = 0;

console.log('============================================')

//BONUS

//Calcule moyenne Global (on calcule la moyenne de tous les élèves puis on divise par le nombre d'élèves)

let averageglobal = 0;

while (i < studentsList.length) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    averageglobal = averageglobal + averagecalculated;
    i++;
}

averageglobal = averageglobal / studentsList.length;

console.log(averageglobal);

//Nombre d'élève (on utilise push pour ajouter a la fin du tableau un élève)
studentsList.push({
        name: 'Thierry',
        MathNote: 9,
        FrenchNote: 11
    })

console.log(studentsList.length)

i = 0

//Felicitation D'Admission

while (i < studentsList.length) {
    let averagecalculated = (studentsList[i].MathNote + studentsList[i].FrenchNote) / 2;
    let average = averagecalculated;
    if (average >= 10) {
        admittedCount++;
    }
    i++;
}
if (admittedCount === studentsList.length) {
    console.log('Félicitation tous les élèves sont admis !')
}

console.log('============================================')