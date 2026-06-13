// DOM Elements
const passwordInput = document.getElementById('passwordInput');
const toggleBtn = document.getElementById('toggleBtn');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generateBtn');
const charCount = document.getElementById('charCount');
const progressBar = document.getElementById('progressBar');
const strengthLabel = document.getElementById('strengthLabel');
const strengthPercent = document.getElementById('strengthPercent');
const feedbackMsg = document.getElementById('feedbackMsg');
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// Rule Elements
const rules = {
    length: document.getElementById('rule-length'),
    upper: document.getElementById('rule-upper'),
    lower: document.getElementById('rule-lower'),
    number: document.getElementById('rule-number'),
    special: document.getElementById('rule-special')
};

// Regex Patterns
const patterns = {
    length: /.{8,}/,
    upper: /[A-Z]/,
    lower: /[a-z]/,
    number: /[0-9]/,
    special: /[^A-Za-z0-9]/
};

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    sunIcon.style.display = isDark ? 'block' : 'none';
    moonIcon.style.display = isDark ? 'none' : 'block';
});

// Show/Hide Password
toggleBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
});

// Copy Password
copyBtn.addEventListener('click', async () => {
    if (!passwordInput.value) return;
    try {
        await navigator.clipboard.writeText(passwordInput.value);
        
        // Brief visual feedback for copy
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => copyBtn.innerHTML = originalHTML, 2000);
    } catch (err) {
        console.error('Failed to copy', err);
    }
});

// Generate Strong Password
generateBtn.addEventListener('click', () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPassword = '';
    
    // Ensure at least one of each required type
    newPassword += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    newPassword += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    newPassword += '0123456789'[Math.floor(Math.random() * 10)];
    newPassword += '!@#$%^&*'[Math.floor(Math.random() * 8)];
    
    // Fill the rest to reach 16 characters
    for (let i = 0; i < 12; i++) {
        newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Shuffle the generated password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');
    
    passwordInput.value = newPassword;
    
    // Trigger input event to update UI
    passwordInput.dispatchEvent(new Event('input'));
});

// Real-time Validation
passwordInput.addEventListener('input', (e) => {
    const val = e.target.value;
    let score = 0;
    let missingCriteria = [];

    // Update Character Count
    charCount.textContent = `${val.length} character${val.length !== 1 ? 's' : ''}`;

    if (val.length === 0) {
        resetUI();
        return;
    }

    // Check Rules
    for (const key in patterns) {
        if (patterns[key].test(val)) {
            rules[key].classList.add('valid');
            score++;
        } else {
            rules[key].classList.remove('valid');
            missingCriteria.push(key);
        }
    }

    updateStrengthUI(score, missingCriteria);
});

function updateStrengthUI(score, missingCriteria) {
    const percentage = (score / 5) * 100;
    strengthPercent.textContent = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;

    // Dynamic Feedback Text Generation
    let feedback = "";
    if (missingCriteria.includes('length')) {
        feedback = "Password is too short.";
    } else if (missingCriteria.includes('upper') || missingCriteria.includes('lower')) {
        feedback = "Add a mix of upper and lower case letters.";
    } else if (missingCriteria.includes('number')) {
        feedback = "Add at least one number.";
    } else if (missingCriteria.includes('special')) {
        feedback = "Add a special character to make it stronger.";
    } else {
        feedback = "Excellent password! Very hard to crack.";
    }

    feedbackMsg.textContent = feedback;

    // Apply Colors and Labels based on Score
    switch(score) {
        case 1:
            setStrength('Very Weak', 'var(--color-red)');
            break;
        case 2:
            setStrength('Weak', 'var(--color-orange)');
            break;
        case 3:
            setStrength('Medium', 'var(--color-yellow)');
            break;
        case 4:
            setStrength('Strong', 'var(--color-light-green)');
            break;
        case 5:
            setStrength('Very Strong', 'var(--color-green)');
            break;
        default:
            resetUI();
    }
}

function setStrength(label, color) {
    strengthLabel.textContent = label;
    strengthLabel.style.color = color;
    progressBar.style.backgroundColor = color;
}

function resetUI() {
    progressBar.style.width = '0%';
    strengthPercent.textContent = '0%';
    setStrength('Very Weak', 'var(--text-muted)');
    feedbackMsg.textContent = "Start typing to see password strength.";
    
    for (const key in rules) {
        rules[key].classList.remove('valid');
    }
}

// Initialize
initTheme();