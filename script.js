let gems = 0;
let currentIndex = 0;
let playing = false;
const soldiers = [
  { name: "Mage", size: 30, health: 30, cooldown: 0.1, color: "lightblue", damage: 4, speed: 1.2 },
  { name: "Swordsman", size: 50, health: 70, cooldown: 1, color: "lightgray", damage: 20, speed: 1.5 },
  { name: "Assassin", size: 40, health: 60, cooldown: 0.5, color: "rgba(0, 0, 0, 0.3)", damage: 15, speed: 2 },
  { name: "Sacrifice", size: 40, health: 70, cooldown: 5, color: "red", damage: 10, speed: 1.3 },
  { name: "Defender", size: 60, health: 160, cooldown: 2, color: "lightgray", damage: 10, speed: 1 },
];
let deckSoldiers = [];

function startGame() {
  document.getElementById("main").style.display = "none";
  document.getElementById('play').style.display = "block";
  playing = true;
}

function endGame() {
  document.getElementById('main').style.display = "block";
  document.getElementById('play').style.display = "none";
  playing = false;
}

document.getElementById(`abort`).addEventListener('click', endGame); //abort

document.getElementById('start').addEventListener('click', startGame); //start

//updates gem count
function addGems(amount) {
  gems += amount;
  document.getElementById('gems').textContent = `GEMS: ${gems}`;
}

function updateCarousel() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.classList.remove('active', 'inactive', 'left', 'right');

    if (index === currentIndex) {
      card.classList.add('active');
    } else {
      card.classList.add('inactive');
      if (index < currentIndex) {
        card.classList.add('left');
      } else {
        card.classList.add('right');
      }
    }
  });
  updateArrowVisibility();
}

function updateArrowVisibility() {
  const leftArrow = document.getElementById('left');
  const rightArrow = document.getElementById('right');

  // Ensure currentIndex is within bounds
  currentIndex = Math.min(Math.max(currentIndex, 0), soldiers.length - 1);

  // Show or hide arrows based on currentIndex and soldiers array length
  leftArrow.style.display = (currentIndex > 0) ? 'block' : 'none';
  rightArrow.style.display = (currentIndex < soldiers.length - 1) ? 'block' : 'none';
}

function displayCards() {
  const cardContainer = document.getElementById('card-container');
  cardContainer.innerHTML = ''; // Clear previous cards

  soldiers.forEach((soldier, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundColor = soldier.color; // Set the card color

    // Set the onclick event directly on the card
    card.onclick = () => {
      console.log(`Clicked on ${soldier.name}`); // Log click
      removeCard(index); // Attempt to remove the card when clicked
    };

    const nameElement = document.createElement('div');
    nameElement.innerText = soldier.name; // Set the soldier name

    const cardView = document.createElement('div');
    cardView.classList.add('card-view');

    const attributesContainer = document.createElement('div');
    attributesContainer.classList.add('attributes');
    const damageElement = document.createElement('div');
    damageElement.innerText = `Damage: ${soldier.damage || 'N/A'}`;
    const speedElement = document.createElement('div');
    speedElement.innerText = `Speed: ${soldier.speed}`;
    const cooldownElement = document.createElement('div');
    cooldownElement.innerText = `Cooldown: ${soldier.cooldown}`;
    const healthElement = document.createElement('div');
    healthElement.innerText = `Health: ${soldier.health}`;

    // Append attributes to the attributes container
    attributesContainer.appendChild(damageElement);
    attributesContainer.appendChild(speedElement);
    attributesContainer.appendChild(cooldownElement);
    attributesContainer.appendChild(healthElement);

    // Append elements to the card
    card.appendChild(nameElement);
    card.appendChild(cardView);
    card.appendChild(attributesContainer);
    cardContainer.appendChild(card);
  });

  updateCarousel(); // Update the carousel view
}

function removeCard(index) {
  const deck = document.querySelector('#deck');

  // Check if the deck is full before removing the card
  if (deck.children.length < 3) {
    const soldier = soldiers.splice(index, 1)[0]; // Remove the soldier from the array
    addCardToDeck(soldier); // Move soldier to the deck
  } else {
    console.log("Deck is full! Cannot add card."); // Log if deck is full
  }

  // Update currentIndex if necessary
  if (currentIndex >= soldiers.length) {
    currentIndex = Math.max(0, soldiers.length - 1);
  }

  displayCards(); // Re-display cards
}

function addCardToDeck(soldier) {
  const deck = document.querySelector('#deck');

  // Check if the deck already has 3 cards
  if (deck.children.length >= 3) {
    console.log("Deck is full! Cannot add more soldiers."); // Log message if the deck is full
    return; // Exit if the deck is full
  }

  // Add to the global deck array
  deckSoldiers.push(soldier);

  // Check if the card-deck already exists
  const existingDeckCard = Array.from(deck.children).find(card => card.dataset.name === soldier.name);

  if (!existingDeckCard) {
    const cardDeckElement = document.createElement('div');
    cardDeckElement.classList.add('card-deck');
    cardDeckElement.style.backgroundColor = soldier.color; // Set color
    cardDeckElement.dataset.name = soldier.name; // Store the name for identification

    cardDeckElement.onclick = () => {
      console.log(`Restoring ${soldier.name}`); // Log restoration
      soldiers.push(soldier); // Add back to soldiers
      deck.removeChild(cardDeckElement); // Remove from deck
      deckSoldiers = deckSoldiers.filter(s => s.name !== soldier.name); // Update the global deck
      displayCards(); // Re-display cards
      populateDeck(); // Update the deck display
    };

    deck.appendChild(cardDeckElement); // Add to the deck
  }
}

function populateDeck() {
  const deck = document.querySelector('#deck');
  deck.innerHTML = ''; // Clear the deck display

  deckSoldiers.forEach(soldier => {
    const cardDeckElement = document.createElement('div');
    cardDeckElement.classList.add('card-deck');
    cardDeckElement.style.backgroundColor = soldier.color; //color setting thingy
    cardDeckElement.dataset.name = soldier.name; //identification storing

    cardDeckElement.onclick = () => {
      console.log(`Restoring ${soldier.name}, Playing: ${playing}`);
      if (!playing) {
        soldiers.push(soldier); //add back to soldiers
        deck.removeChild(cardDeckElement); //remove from deck
        deckSoldiers = deckSoldiers.filter(s => s.name !== soldier.name); //update the deck
        displayCards();
        populateDeck(); 
      }
    };

    deck.appendChild(cardDeckElement);
  });
}

//card movement logic
document.getElementById('left').addEventListener("click", function() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  } else {
    console.log("At the beginning of the carousel.");
  }
});

document.getElementById('right').addEventListener("click", function() {
  if (currentIndex < soldiers.length - 1) {
    currentIndex++;
    updateCarousel();
  } else {
    console.log("At the end of the carousel.");
  }
});

//initialize cards on page load
document.addEventListener("DOMContentLoaded", displayCards);

document.addEventListener("keydown", function(event) {
  if (event.key === 'Escape') {
      toggleSettings();
  }
});
//toggles settings when the esc key is pressed
function toggleSettings() {
  const settings = document.getElementById('settings');
  settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
}
//closes settings when the button is pressed
document.getElementById('close-settings').addEventListener("click", function() {
  toggleSettings();
});
