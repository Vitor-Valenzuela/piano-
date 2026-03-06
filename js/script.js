// DOM Elements
const keys = document.querySelectorAll('.key');
const checkbox = document.querySelector('.checkbox__keys');
const switcher = document.querySelector('.switcher');
const keysSection = document.querySelector('.piano__keys');

// Audio Cache para melhor performance
const audioCache = {};

// Caminho base para funcionar em GitHub Pages e localhost
const getAudioPath = (note) => {
    // usamos caminho relativo para que o áudio seja carregado tanto
    // em localhost quanto no GitHub Pages independe do nome do repositório.
    // evitar a barra inicial ('/') porque em file:// apontaria para a raiz do drive.
    const basePath = './notes/';
    return basePath + note + '.wav';
}

const playNote = (note) => {
    const path = getAudioPath(note);
    console.log('playing note', note, '=>', path);
    if (!audioCache[note]) {
        audioCache[note] = new Audio(path);
    }
    
    // Reinicia o áudio se ele já está tocando
    audioCache[note].currentTime = 0;
    audioCache[note].play().catch(error => console.error('Erro ao tocar nota:', error));
}

const handleMouseDown = (key) => {
    playNote(key.getAttribute('data-note'));
    key.classList.add(key.classList.contains('black') ? 'black--pressed' : 'white--pressed');
}

const handleMouseUp = (key) => {
    key.classList.remove(key.classList.contains('black') ? 'black--pressed' : 'white--pressed');
    if (key.classList.contains('white')) {
        key.style.background = 'white';
    }
}

// Adicionar event listeners para mouse e touch
keys.forEach((key) => {
    key.addEventListener('mousedown', () => handleMouseDown(key));
    key.addEventListener('mouseup', () => handleMouseUp(key));
    key.addEventListener('mouseleave', () => handleMouseUp(key));
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMouseDown(key);
    });
    key.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleMouseUp(key);
    });
});

// Toggle para mostrar/esconder labels das teclas
checkbox.addEventListener('change', ({ target }) => {
    switcher.classList.toggle('switcher--active', target.checked);
    keysSection.classList.toggle('disabled-keys', !target.checked);
});

// Mapa de teclas para índices de notas
const keyIndexMap = {
    "Tab": 0, "1": 1, "q": 2, "2": 3, "w": 4, "e": 5, "4": 6,
    "r": 7, "5": 8, "t": 9, "6": 10, "y": 11, "u": 12, "8": 13,
    "i": 14, "9": 15, "o": 16, "p": 17, "-": 18, "[": 19,
    "=": 20, "]": 21, "Backspace": 22, "\\": 23
};

// Rastrear teclas que estão sendo pressionadas para evitar repetição
const pressedKeys = new Set();

document.addEventListener('keydown', (event) => {
    const keyIndex = keyIndexMap[event.key];
    
    if (keyIndex !== undefined && !pressedKeys.has(event.key)) {
        event.preventDefault();
        pressedKeys.add(event.key);
        handleMouseDown(keys[keyIndex]);
    }
});

document.addEventListener('keyup', (event) => {
    const keyIndex = keyIndexMap[event.key];
    
    if (keyIndex !== undefined) {
        pressedKeys.delete(event.key);
        handleMouseUp(keys[keyIndex]);
    }
});
