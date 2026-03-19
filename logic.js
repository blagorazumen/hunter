// Подключаем Telegram WebApp для красоты (если запускаешь в ТГ)
let tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

// Берем стартовые данные из нашей новой базы данных
let cash = DB.config.startCash; 
let income = 0;
let history = ['main']; // Стек для навигации (кнопка Назад)

const emojis = ['😈','☠️','💘','💣','🤏','💯','💥','💫','🐰','✨'];

function updateUI() {
    const display = document.getElementById('cash-display');
    const ovDisplay = document.getElementById('ov-cash');
    const val = Math.floor(cash).toLocaleString('ru-RU');
    
    if (display) display.innerText = val;
    if (ovDisplay) ovDisplay.innerText = val;
    
    document.getElementById('income-display').innerText = `ДОХОД: ${Math.floor(income)} / СЕК`;
}

// Главная функция клика (+10 000 сум)
function suetaClick() {
    cash += DB.config.clickValue; // Тянем 10000 из базы
    
    // Рандомный бонус (шанс 2%)
    if (Math.random() < 0.02) {
        // Бонус не больше 50% от текущего банка (из базы)
        let maxBonus = cash * DB.config.bonusMaxPercent;
        let luckyBonus = Math.floor(Math.random() * maxBonus);
        cash += luckyBonus;
        
        // Вызываем то самое золотое окно диалога
        showDialog(`Фартануло на суете! <br> Прилипло лишних: <span style="color:var(--gold);">${luckyBonus.toLocaleString()} сум</span>`, ["ОТ ДУШИ"]);
    }
    
    spawnEmojis();
    updateUI();
}

// Анимация разлетающихся эмодзи
function spawnEmojis() {
    const container = document.getElementById('emoji-container');
    if (!container) return;

    for (let i = 0; i < 6; i++) {
        const span = document.createElement('span');
        span.className = 'emoji-fly';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        
        const x = (Math.random() - 0.5) * 400;
        const y = (Math.random() - 0.5) * 400 - 150;
        span.style.setProperty('--x', `${x}px`);
        span.style.setProperty('--y', `${y}px`);
        
        span.style.left = '50%';
        span.style.bottom = '200px';
        
        container.appendChild(span);
        setTimeout(() => span.remove(), 800);
    }
}

// Управление окнами (Навигация)
function openTab(tabName, title) {
    const overlay = document.getElementById('main-overlay');
    const content = document.getElementById('main-content');
    const titleEl = document.getElementById('overlay-title');
    
    overlay.style.display = 'flex';
    titleEl.innerText = title.toUpperCase();
    history.push(tabName);

    if (tabName === 'shop') {
        renderShop();
    } else if (tabName === 'menu') {
        content.innerHTML = `<button class="dialog-option" onclick="showDialog('Версия 1.0. Фундамент заложен.', ['ПОНЯЛ'])">О ПРИЛОЖЕНИИ</button>`;
    }
}

function renderShop() {
    let html = `<p style="margin-bottom:20px; text-align:center;">ВЫБЕРИ НАПРАВЛЕНИЕ:</p>`;
    DB.items.tasks.forEach((item, idx) => {
        html += `<button class="menu-btn" onclick="showDistricts(${idx})">${item.name}</button>`;
    });
    document.getElementById('main-content').innerHTML = html;
}

// Кнопка НАЗАД
function goBack() {
    if (history.length <= 1) {
        closeAll();
        return;
    }
    history.pop();
    let prevState = history[history.length - 1];
    
    if (prevState === 'main') closeAll();
    else if (prevState === 'shop') renderShop();
}

function closeAll() {
    document.getElementById('main-overlay').style.display = 'none';
    history = ['main'];
}

// Функция для диалогов (Черный фон, золото, курсив)
function showDialog(text, buttons) {
    const overlay = document.getElementById('main-overlay');
    const content = document.getElementById('main-content');
    
    overlay.style.display = 'flex';
    document.getElementById('overlay-title').innerText = "УВЕДОМЛЕНИЕ";
    
    let btnsHtml = buttons.map(b => `<button class="dialog-option" onclick="closeAll()">${b}</button>`).join('');
    content.innerHTML = `<div style="font-style: italic; color: var(--ivory); line-height: 1.6;">${text}</div><div style="margin-top:25px;">${btnsHtml}</div>`;
}

// Запуск
updateUI();
