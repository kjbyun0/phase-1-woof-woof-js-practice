
let pupList = [];

document.addEventListener('DOMContentLoaded', e => {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(pups => {
        pupList = pups;
        updateDogBar(false);
    })
    .catch(error => console.log(error));

    const btnFilter = document.getElementById('good-dog-filter');
    btnFilter.addEventListener('click', e => {
        if (e.target.textContent.slice(-3).trim() === 'OFF') {
            e.target.textContent = 'Filter good dogs: ON';
            updateDogBar(true);
        } else {
            e.target.textContent = 'Filter good dogs: OFF';
            updateDogBar(false);
        }
    });
});

function updateDogBar(isGoodDogOn) {
    const divDogBar = document.getElementById('dog-bar');
    divDogBar.innerHTML = '';
    pupList.forEach(pup => {
        if (!isGoodDogOn || pup.isGoodDog) {
            const spanPup = document.createElement('span');
            spanPup.textContent = pup.name;
            spanPup.addEventListener('click', e => displayDoggo(e));
            divDogBar.appendChild(spanPup);
        }
    });

    const divDogInfo = document.getElementById('dog-info');
    if (isGoodDogOn && divDogInfo.children.length !== 0) {
        const btnPup = divDogInfo.children[2];
        if (btnPup.textContent.slice(0,4).trim() === 'Bad') {
            divDogInfo.innerHTML = '';
        } 
    }
}

function displayDoggo(e) {
    const divDogInfo = document.getElementById('dog-info');
    divDogInfo.innerHTML = '';
    pupName = e.target.textContent;
    for (let i = 0; i < pupList.length; i++) {
        if (pupList[i].name === pupName) {
            const imgPup = document.createElement('img');
            imgPup.src = pupList[i].image;
            const h2Pup = document.createElement('h2');
            h2Pup.textContent = pupList[i].name;
            const btnPup = document.createElement('button');
            btnPup.textContent = (pupList[i].isGoodDog) ? 'Good Dog!' : 'Bad Dog!';
            btnPup.addEventListener('click', e => togglePupCharacter(e, i));
            divDogInfo.append(imgPup, h2Pup, btnPup);
            return;
        }
    }
}

function togglePupCharacter(e, idxPupList) {
    //console.log(e);
    const btnPup = e.target;
    let pupCharacter = btnPup.textContent.slice(0,4).trim();
    updatePupCharactor(idxPupList, pupCharacter !== 'Good', btnPup);
}

function updatePupCharactor(idxPupList, isGoodDog, btnPup) {
    //console.log(pupId, isGoodDog, btnPup);
    fetch(`http://localhost:3000/pups/${pupList[idxPupList].id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            'isGoodDog': isGoodDog,
        }),
    })
    .then(resp => {
        //console.log(resp);
        btnPup.textContent = isGoodDog ? 'Good Dog!' : 'Bad Dog!';
        pupList[idxPupList].isGoodDog = isGoodDog;
        //console.log(pupList);
    })
    .catch(error => console.log(error));
}