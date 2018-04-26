// Anzahl der Spieler
var players = 5; 

// Aktueller Spieler
var player = 0;

// Zeiten der Spieler
var times = [];

var colors = [
    'red', 'green', 'blue', 'yellow', 'orange', 'white', 'black', 'silver'
];

var shapes = [
    '<svg width="124" height="124" viewbox="0 0 124 124" xmlns="http://www.w3.org/2000/svg"><circle fill="currentColor" cx="62" cy="62" r="62" /></svg>',
    '<svg width="310" height="93" viewbox="0 0 310 93" xmlns="http://www.w3.org/2000/svg"><path d="M152 60.981l.069.019a.395.395 0 0 1-.036-.024l-.033.005zm-1.154-1.763c-3.306-3.363-5.28-7.52-9.192-18.738l-.143-.413c-4.692-13.452-7.569-19.849-13.429-27.035-9.615-11.792-27.605-18.518-39.418-7.27-6.85 6.521-10.574 13.654-16.43 28.274.063-.155-1.388 3.477-1.788 4.47-7.34 18.21-11.78 23.43-21.33 23.543-13.72.162-15.54-2.932-18.359-26.688a571.367 571.367 0 0 0-.743-6.115c-.783-6.113-1.584-10.878-2.713-15.542L0 21.64c.788 3.254 1.403 6.915 2.042 11.909.199 1.546.305 2.432.705 5.802 2.105 17.734 3.776 25.591 9.013 34.5 7.6 12.927 20.257 19.35 37.661 19.144C73.455 92.71 84.9 79.255 96.284 51.01c.422-1.049 1.895-4.735 1.815-4.537 2.905-7.252 4.934-11.647 6.772-14.472.941.547 1.784 1.205 2.147 1.65 2.813 3.45 4.626 7.481 8.108 17.465l.143.41c5.44 15.603 8.804 22.688 16.356 30.372 17.84 18.151 33.935 10.737 48.294-10.647a228.602 228.602 0 0 0 3.649-5.638c.596-.947 2.899-4.628 3.455-5.51 10.42-16.54 14.652-19.828 20.198-17.05 6.655 3.334 11.582 7.908 22.372 19.951 14.214 15.866 21.47 22.442 33.356 27.696 15.344 6.783 30.847-5.614 38.248-21.145 4.773-10.014 6.104-17.993 7.4-35.308.532-7.118.827-10.152 1.403-13.603l-27.785-5.564c-.8 4.795-1.16 8.497-1.77 16.638-.988 13.203-1.858 18.418-4.285 23.512-.888 1.863-2.761 4.27-4.524 5.68-6.264-3.033-11.474-7.964-21.669-19.343-13.41-14.968-20.147-21.223-31.002-26.66-12.657-6.341-24.973-4.662-35.636 3.624-6.959 5.407-12.05 12.083-19.551 23.99-.593.94-2.894 4.618-3.453 5.505a199.85 199.85 0 0 1-3.156 4.883c-2.426 3.612-4.31 5.925-5.52 7.086-.226-.205-.494-.46-.803-.776zM273 61.816c.149.053.299.114.45.184l-.15-.07-.3-.114z" fill="currentColor"/></svg>',
    '<svg width="124" height="124" viewbox="0 0 124 124" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M0 0h124v124H0z" fill-rule="evenodd"/></svg>'
];

/**
 * Liefert einen zufälligen ganzzahligen Wert von <min> bis <max> zurück.
 */
function random(min, max) {
    var diff = max - min;
    return min + Math.round(Math.random() * diff);
}

/**
 * Liefert aus der übergebenen Liste einen zufälligen Eintrag zurück.
 */
function randomItem(array) {
    return array[random(0, array.length - 1)]
}


var buzzerTimeout;

/**
 * Stellt den Timer auf einen zufälligen Wert.
 */
function setBuzzerTimeout() {
    // Timer stellen
    buzzerTimeout = setTimeout(buzz, 35000);

    // Buzzer-Sound starten und gleich wieder pausieren!
    buzzerAudio.play().then(() => buzzerAudio.pause());

    // Ticken abspielen
    tickingAudio.play();
}

function buzz() {
    showScreen('timeoutScreen');
    updatePlayerInfo();
    times[player] += 50000;
    tickingAudio.pause();
    buzzerAudio.onended = nextPlayer;
    buzzerAudio.play();
}

/**
 * Zeigt die <section> mit der angegebenen ID an und versteckt alle anderen. 
 */
function showScreen(id) {
    document.querySelectorAll('section').forEach(screen => 
        screen.classList.toggle('active', screen.id == id)
    );
}

/**
 * Aktualisiert die Anzahl der Spieler.
 */
function updatePlayers(change) {
    if (change) {
        var newPlayers = players + change;
        if (newPlayers > 1 && newPlayers < 30) {
            players = newPlayers;
        }
    }
    for (var i = 0; i < players; i++) {
        times[i] = 0;
    }
    playerCount.innerText = players;
}

function updatePlayerInfo() {
    playerText.innerText = nextPlayerText.innerText = 'Spieler ' + (player + 1);
}

function setup() {
    updatePlayers();
    showScreen('setupScreen');
}

function startRound() {
    setBuzzerTimeout();
    showScreen('challengeScreen');
    start = Date.now();
    updatePlayerInfo();

    shape1.innerHTML = randomItem(shapes);
    shape2.innerHTML = randomItem(shapes);
    shape3.innerHTML = randomItem(shapes);

    shape1.style.color = randomItem(colors);
    shape2.style.color = randomItem(colors);
    shape3.style.color = randomItem(colors);
}

/**
 * 
 */
function answer() {
    clearTimeout(buzzerTimeout);
    tickingAudio.pause();
    answerAudio.play();
    times[player] += Date.now() - start;
    nextPlayer();
}

function nextPlayer() {
    player++;
    updatePlayerInfo();
    if (player == players) {
        ranking.innerHTML = times
            .slice(0, players)
            .map((time, player) => ({ time, player }))
            .sort((a, b) => a.time - b.time)
            .slice(0, 8)
            .map(rank => `<div>Spieler ${rank.player + 1} (${rank.time})</div>`)
            .join('')
        showScreen('endOfRoundScreen');    
        return;
    }
    showScreen('nextPlayerScreen');
}

function nextRound() {
    player = 0;
    updatePlayerInfo();
    startRound();
}

// So, hier geht's los:
setup();
