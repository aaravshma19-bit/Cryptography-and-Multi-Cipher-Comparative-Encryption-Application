// Pattern Analysis Functions
function countRepeatedLetters(text) {
    const freq = {};
    let repeated = 0;
    
    for (const char of text.toUpperCase()) {
        if (/[A-Z]/.test(char)) {
            freq[char] = (freq[char] || 0) + 1;
        }
    }
    
    for (const count of Object.values(freq)) {
        if (count > 1) repeated += count;
    }
    
    return repeated;
}

function countVowels(text) {
    return (text.match(/[AEIOU]/gi) || []).length;
}

function getTopLetters(text, n = 3) {
    const freq = {};
    
    for (const char of text.toUpperCase()) {
        if (/[A-Z]/.test(char)) {
            freq[char] = (freq[char] || 0) + 1;
        }
    }
    
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([char, count]) => `${char}(${count})`)
        .join(', ');
}

function analyzePattern(text) {
    return {
        length: text.replace(/[^A-Z]/gi, '').length,
        repeated: countRepeatedLetters(text),
        vowels: countVowels(text),
        topLetters: getTopLetters(text)
    };
}

// Main Application Logic
const ciphers = [
    {
        name: 'Caesar',
        encrypt: (text, keys) => caesarEncrypt(text, parseInt(keys.caesar)),
        decrypt: (text, keys) => caesarDecrypt(text, parseInt(keys.caesar))
    },
    {
        name: 'Vigenère',
        encrypt: (text, keys) => vigenereEncrypt(text, keys.vigenere),
        decrypt: (text, keys) => vigenereDecrypt(text, keys.vigenere)
    },
    {
        name: 'Substitution',
        encrypt: (text, keys) => substitutionEncrypt(text, keys.substitution),
        decrypt: (text, keys) => substitutionDecrypt(text, keys.substitution)
    },
    {
        name: 'Columnar Transposition',
        encrypt: (text, keys) => columnarEncrypt(text, keys.columnar),
        decrypt: (text, keys) => columnarDecrypt(text, keys.columnar)
    }
];

let encryptedResults = [];

document.getElementById('encryptBtn').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    
    if (!message.trim()) {
        alert('Please enter a message to encrypt');
        return;
    }
    
    const keys = {
        caesar: document.getElementById('caesarKey').value,
        vigenere: document.getElementById('vigenereKey').value,
        substitution: document.getElementById('substitutionKey').value,
        columnar: document.getElementById('columnarKey').value
    };
    
    // Validate substitution key
    if (keys.substitution.length !== 26 || new Set(keys.substitution.toUpperCase()).size !== 26) {
        alert('Substitution key must contain exactly 26 unique letters');
        return;
    }
    
    encryptedResults = [];
    const resultsBody = document.getElementById('resultsBody');
    const analysisBody = document.getElementById('analysisBody');
    
    resultsBody.innerHTML = '';
    analysisBody.innerHTML = '';
    
    ciphers.forEach((cipher, index) => {
        const encrypted = cipher.encrypt(message, keys);
        encryptedResults.push({ cipher: cipher.name, text: encrypted, keys });
        
        // Results row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cipher.name}</strong></td>
            <td>${encrypted}</td>
            <td><button class="btn-decrypt" data-index="${index}">Decrypt</button></td>
        `;
        resultsBody.appendChild(row);
        
        // Analysis row
        const analysis = analyzePattern(encrypted);
        const analysisRow = document.createElement('tr');
        analysisRow.innerHTML = `
            <td><strong>${cipher.name}</strong></td>
            <td>${analysis.length}</td>
            <td>${analysis.repeated}</td>
            <td>${analysis.vowels}</td>
            <td>${analysis.topLetters}</td>
        `;
        analysisBody.appendChild(analysisRow);
    });
    
    document.getElementById('results').style.display = 'block';
    document.getElementById('decryptSection').style.display = 'none';
    
    // Add decrypt button listeners
    document.querySelectorAll('.btn-decrypt').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            const result = encryptedResults[index];
            const decrypted = ciphers[index].decrypt(result.text, result.keys);
            
            document.getElementById('decryptCipher').textContent = `${result.cipher} Decryption:`;
            document.getElementById('decryptText').textContent = decrypted;
            document.getElementById('decryptSection').style.display = 'block';
            document.getElementById('decryptSection').scrollIntoView({ behavior: 'smooth' });
        });
    });
});
