// Caesar Cipher
function caesarEncrypt(text, shift) {
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
    });
}

function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, 26 - shift);
}

// Vigenère Cipher
function vigenereEncrypt(text, key) {
    text = text.toUpperCase();
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Z]/.test(char)) {
            const shift = key.charCodeAt(keyIndex % key.length) - 65;
            result += String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26) + 65);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

function vigenereDecrypt(text, key) {
    text = text.toUpperCase();
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[A-Z]/.test(char)) {
            const shift = key.charCodeAt(keyIndex % key.length) - 65;
            result += String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
            keyIndex++;
        } else {
            result += char;
        }
    }
    return result;
}

// Substitution Cipher
function substitutionEncrypt(text, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        return key[alphabet.indexOf(char)];
    });
}

function substitutionDecrypt(text, key) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    key = key.toUpperCase();
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        return alphabet[key.indexOf(char)];
    });
}

// Columnar Transposition Cipher
function columnarEncrypt(text, key) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    key = key.toUpperCase();
    
    const keyOrder = [...key].map((char, i) => ({ char, i }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({ oldIndex: item.i, newIndex }));
    
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);
    const grid = Array(rows).fill().map(() => Array(cols).fill(''));
    
    let index = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (index < text.length) {
                grid[r][c] = text[index++];
            }
        }
    }
    
    let result = '';
    keyOrder.sort((a, b) => a.newIndex - b.newIndex).forEach(item => {
        for (let r = 0; r < rows; r++) {
            result += grid[r][item.oldIndex];
        }
    });
    
    return result;
}

function columnarDecrypt(text, key) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    key = key.toUpperCase();
    
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);
    const keyOrder = [...key].map((char, i) => ({ char, i }))
        .sort((a, b) => a.char.localeCompare(b.char))
        .map((item, newIndex) => ({ oldIndex: item.i, newIndex }));
    
    const grid = Array(rows).fill().map(() => Array(cols).fill(''));
    
    let index = 0;
    keyOrder.sort((a, b) => a.newIndex - b.newIndex).forEach(item => {
        for (let r = 0; r < rows; r++) {
            if (index < text.length) {
                grid[r][item.oldIndex] = text[index++];
            }
        }
    });
    
    let result = '';
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            result += grid[r][c];
        }
    }
    
    return result;
}
