// Основные переменные
let cash = 100000;
let history = ['main']; // Стек для навигации
const emojis = ['😈','☠️','💘','💣','🤏','💯','💥','💫','🐰','✨'];

// Функция обновления интерфейса
function updateUI() {
    const display = document.getElementById('cash-display');
    if (display) {
        display.innerText = Math.floor(cash).toLocaleString('ru-RU');
    }
}

// Главный клик (Суетить)
function suetaClick() {
    // Берем значение клика из базы (10 000)
    cash += DB.config.clickValue;
    
    // Рандомный бонус (шанс 3%)
    if (Math.random() < 0.03) {
        let maxBonus = cash * DB.config.bonusMaxPercent;
        let luckyBonus = Math.floor(Math.random() * maxBonus);
        cash += luckyBonus;
        
        showDialog(`Насуетил бонус: <br><span style="color:var(--gold);">+${luckyBonus.toLocaleString()} СУМ</span>`, ["ОТ ДУШИ"]);
    }
    
    spawnEmojis();
    updateUI();
}

// Анимация эмодзи
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
        span.style.top = '50%';
        
        container.appendChild(span);
        setTimeout(() => span.remove(), 800);
    }
}

// Открытие вкладок (Магазин, Имущество, Меню)
function openTab(tabName, title) {
    document.getElementById('main-overlay').style.display = 'flex';
    document.getElementById('overlay-title').innerText = title.toUpperCase();
    
    // Если мы переходим из главной, очищаем историю до ['main', tabName]
    if (history.length === 1) history.push(tabName);
    else if (history[history.length-1] !== tabName) history.push(tabName);

    if (tabName === 'shop') renderShop();
    else document.getElementById('main-content').innerHTML = '<p style="text-align:center; opacity:0.5;">В разработке...</p>';
}

// Отрисовка главного меню магазина
function renderShop() {
    let html = `<p style="margin-bottom:20px; text-align:center;">ВЫБЕРИ НАПРАВЛЕНИЕ:</p>`;
    
    // Кнопка для сигаретной ветви (функция лежит в cigarette_branch.js)
    html += `<button class="menu-btn" onclick="openCigaretteMenu()">Точка штучных сигарет</button>`;
    
    // Заглушка для Дамаса
    html += `<button class="menu-btn" onclick="showDialog('Ветка Дамаса будет доступна в следующем обновлении.', ['ЖДУ'])">Доставка на Дамасе</button>`;
    
    document.getElementById('main-content').innerHTML = html;
}

// Кнопка НАЗАД (Железная логика)
function goBack() {
    if (history.length <= 1) {
        closeAll();
        return;
    }
    
    history.pop(); // Убираем текущее состояние
    let prevState = history[history.length - 1];

    if (prevState === 'main') {
        closeAll();
    } else if (prevState === 'shop') {
        renderShop();
    }
}

// Полный выход
function closeAll() {
    document.getElementById('main-overlay').style.display = 'none';
    history = ['main'];
}

// Универсальное окно диалога
function showDialog(text, options) {
    const overlay = document.getElementById('main-overlay');
    const content = document.getElementById('main-content');
    
    overlay.style.display = 'flex';
    document.getElementById('overlay-title').innerText = "СУЕТА";
    
    let btnsHtml = options.map(opt => `<button class="dialog-option" onclick="closeAll()">${opt}</button>`).join('');
    
    content.innerHTML = `
        <div style="font-style: italic; color: var(--ivory); line-height: 1.6; margin-bottom: 20px;">
            ${text}
        </div>
        ${btnsHtml}
    `;
}

// Инициализация при загрузке
updateUI();
