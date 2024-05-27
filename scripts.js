let participants = [];

function getParticipantNames() {
    const numParticipants = document.getElementById('numParticipants').value;
    if (numParticipants < 1 || numParticipants > 10) {
        alert('Please enter a number between 1 and 10.');
        return;
    }

    const participantNamesDiv = document.getElementById('participantNames');
    participantNamesDiv.innerHTML = '';
    participantNamesDiv.style.display = 'block';

    for (let i = 1; i <= numParticipants; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `participant-name-${i}`;
        input.placeholder = `Enter name for Participant ${i}`;
        participantNamesDiv.appendChild(input);
        participantNamesDiv.appendChild(document.createElement('br'));
    }

    const button = document.createElement('button');
    button.textContent = 'Create Tabs';
    button.onclick = createParticipantTabs;
    participantNamesDiv.appendChild(button);
}

function createParticipantTabs() {
    const numParticipants = document.getElementById('numParticipants').value;
    const participantNamesDiv = document.getElementById('participantNames');

    participants = [];
    for (let i = 1; i <= numParticipants; i++) {
        const name = document.getElementById(`participant-name-${i}`).value;
        if (!name) {
            alert('Please enter all participant names.');
            return;
        }
        participants.push({
            name: name,
            allrounder: [],
            batsman: [],
            bowler: [],
            wicketkeeper: [],
            totalAmount: 0
        });
    }

    participantNamesDiv.style.display = 'none';
    const tabsContainer = document.getElementById('tabs');
    tabsContainer.innerHTML = ''; // Clear any existing tabs

    participants.forEach((participant, index) => {
        const i = index + 1;
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.id = `participant-${i}`;
        tab.innerHTML = `
            <h2>${participant.name}</h2>
            <div class="category">
                <h3>All-Rounder</h3>
                <ul class="player-list" id="allrounder-list-${i}"></ul>
            </div>
            <div class="category">
                <h3>Batsman</h3>
                <ul class="player-list" id="batsman-list-${i}"></ul>
            </div>
            <div class="category">
                <h3>Bowler</h3>
                <ul class="player-list" id="bowler-list-${i}"></ul>
            </div>
            <div class="category">
                <h3>Wicketkeeper</h3>
                <ul class="player-list" id="wicketkeeper-list-${i}"></ul>
            </div>
            <div class="add-player-form">
                <input type="text" id="player-name-${i}" placeholder="Player Name">
                <input type="number" id="player-price-${i}" placeholder="Price">
                <select id="player-category-${i}">
                    <option value="allrounder">All-Rounder</option>
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="wicketkeeper">Wicketkeeper</option>
                </select>
                <button onclick="addPlayer(${i})">Add Player</button>
            </div>
            <div class="total-amount" id="total-amount-${i}">Total Amount: ₹0</div>
        `;
        tabsContainer.appendChild(tab);
    });

    document.getElementById('saveButton').style.display = 'block';
}

function addPlayer(participantId) {
    const playerName = document.getElementById(`player-name-${participantId}`).value;
    const playerPrice = parseFloat(document.getElementById(`player-price-${participantId}`).value);
    const playerCategory = document.getElementById(`player-category-${participantId}`).value;
    
    if (!playerName || isNaN(playerPrice) || playerPrice <= 0) {
        alert('Please enter a valid player name and price.');
        return;
    }

    const playerList = document.getElementById(`${playerCategory}-list-${participantId}`);
    const listItem = document.createElement('li');
    listItem.innerHTML = `${playerName}: ₹${playerPrice.toFixed(2)} <button class="delete-button" onclick="deletePlayer(${participantId}, '${playerCategory}', this, ${playerPrice})">Delete</button>`;
    playerList.appendChild(listItem);

    // Update total amount
    const participant = participants[participantId - 1];
    participant[playerCategory].push({ name: playerName, price: playerPrice });
    participant.totalAmount += playerPrice;
    const totalAmountElement = document.getElementById(`total-amount-${participantId}`);
    totalAmountElement.textContent = `Total Amount: ₹${participant.totalAmount.toFixed(2)}`;

    // Clear input fields
    document.getElementById(`player-name-${participantId}`).value = '';
    document.getElementById(`player-price-${participantId}`).value = '';
    document.getElementById(`player-category-${participantId}`).value = 'allrounder';
}

function deletePlayer(participantId, category, button, price) {
    const participant = participants[participantId - 1];
    participant[category] = participant[category].filter(player => player.price !== price || player.name !== button.parentElement.firstChild.textContent.split(':')[0]);
    participant.totalAmount -= price;
    button.parentElement.remove();

    const totalAmountElement = document.getElementById(`total-amount-${participantId}`);
    totalAmountElement.textContent = `Total Amount: ₹${participant.totalAmount.toFixed(2)}`;
}

function saveData() {
    const condensedData = participants.map(participant => ({
        name: participant.name,
        allrounder: participant.allrounder,
        batsman: participant.batsman,
        bowler: participant.bowler,
        wicketkeeper: participant.wicketkeeper,
        totalAmount: participant.totalAmount
    }));

    localStorage.setItem('auctionData', JSON.stringify(condensedData));
    window.location.href = 'summary.html';
}
