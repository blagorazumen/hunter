let cash = 100000;
let history = ['main']; // Для кнопки "Назад"

const emojis = ['😈','☠️','💘','💣','🤏','💯','💥','💫','🐰','✨'];

function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
}

function suetaClick() {
    // Базовый доход
    cash += 10000;
    
    // Рандомный бонус (шанс 2%)
    if (Math.random() < 0.02) {
        let bonus = Math.floor(Math.random() * (cash * 0.5));
        cash += bonus;
        showDialog(`Фартануло! Ты насуетил лишние ${bonus.toLocaleString()} сум.`, ["От души!"]);
    }
    
    spawnEmojis();
    updateUI();
}

function spawnEmojis() {
    const container = document.getElementById('emoji-container');
    for (let i = 0; i < 8; i++) {
        const span = document.createElement('span');
        span.className = 'emoji-fly';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        // Случайное направление взрыва
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300 - 100;
        span.style.setProperty('--x', `${x}px`);
        span.style.setProperty('--y', `${y}px`);
        
        span.style.left = '50%';
        span.style.bottom = '150px';
        
        container.appendChild(span);
        setTimeout(() => span.remove(), 800);
    }
}

// Навигация
function openOverlay(title, contentHtml, stateName) {
    document.getElementById('overlay-title').innerText = title;
    document.getElementById('overlay-content').innerHTML = contentHtml;
    document.getElementById('overlay').style.display = 'flex';
    history.push(stateName);
    
    document.getElementById('back-btn').onclick = goBack;
}

function goBack() {
    history.pop();
    let prevState = history[history.length - 1];
    if (prevState === 'main') closeAll();
    else {
        // Логика возврата в конкретные подменю
        if (prevState === 'shop') openShop();
    }
}

function closeAll() {
    document.getElementById('overlay').style.display = 'none';
    history = ['main'];
}

// Функции-заглушки для меню
function openShop() { openOverlay('МАГАЗИН', '<button class="dialog-option" onclick="showDialog(\'Хочешь взять сигареты оптом?\', [\'Да\', \'Нет\'])">ТЕМКИ</button>', 'shop'); }
function openAssets() { openOverlay('ИМУЩЕСТВО', '<p>Тут будет твой арсенал...</p>', 'assets'); }
function openMenu() { openOverlay('МЕНЮ', '<p>Настройки системы</p>', 'menu'); }

// Функция диалога (черный фон, золото, курсив)
function showDialog(text, options) {
    let html = `<p style="margin-bottom:20px; line-height:1.6;">${text}</p>`;
    options.forEach(opt => {
        html += `<button class="dialog-option" onclick="closeAll()">${opt}</button>`;
    });
    openOverlay('ДИАЛОГ', html, 'dialog');
}

updateUI();

