let cash = 100000;
let history = ['main'];
const emojis = ['😈','☠️','💘','💣','🤏','💯','💥','💫','🐰','✨'];

function updateUI() {
    const display = document.getElementById('cash-display');
    if (display) display.innerText = Math.floor(cash).toLocaleString('ru-RU');
}

function suetaClick() {
    cash += 10000;
    spawnEmojis();
    updateUI();
}

function spawnEmojis() {
    const container = document.getElementById('emoji-container');
    for (let i = 0; i < 6; i++) {
        const span = document.createElement('span');
        span.className = 'emoji-fly';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.setProperty('--x', `${(Math.random() - 0.5) * 300}px`);
        span.style.setProperty('--y', `${(Math.random() - 0.5) * 300 - 100}px`);
        span.style.left = '50%'; span.style.top = '50%';
        container.appendChild(span);
        setTimeout(() => span.remove(), 800);
    }
}

// Открытие вкладок
function openTab(tab, title) {
    document.getElementById('main-overlay').style.display = 'flex';
    document.getElementById('overlay-title').innerText = title.toUpperCase();
    if (history[history.length - 1] !== tab) history.push(tab);

    if (tab === 'shop') renderShop();
    else document.getElementById('main-content').innerHTML = '<p>В разработке...</p>';
}

// Главный экран магазина
function renderShop() {
    let html = `
        <p style="margin-bottom:20px; text-align:center;">ВЫБЕРИ НАПРАВЛЕНИЕ:</p>
        <button class="menu-btn" onclick="openCigaretteBranch()">Точка штучных сигарет</button>
        <button class="menu-btn" onclick="showDialog('Доставка на Дамасе скоро...', ['ОК'])">Доставка на Дамасе</button>
    `;
    document.getElementById('main-content').innerHTML = html;
}

// ВЕТКА СИГАРЕТ (Внутреннее меню)
function openCigaretteBranch() {
    history.push('cigs'); // Добавляем в историю
    let html = '<p style="margin-bottom:20px; text-align:center;">ВЫБЕРИ РАЙОН:</p>';
    
    // Генерируем кнопки районов прямо из базы данных
    for (let key in DB.districts) {
        let d = DB.districts[key];
        let price = 500000 * d.priceMult; 
        html += `
            <button class="menu-btn" onclick="buyItem('${d.name}', ${price})">
                ${d.name} <br> <span style="color:var(--gold); font-size:12px;">ЦЕНА: ${price.toLocaleString()}</span>
            </button>
        `;
    }
    document.getElementById('main-content').innerHTML = html;
}

function buyItem(name, price) {
    if (cash >= price) {
        cash -= price;
        updateUI();
        showDialog(`Куплено: ${name}`, ['ОТЛИЧНО']);
    } else {
        showDialog('Не хватает суеты (денег)!', ['ПОНЯЛ']);
    }
}

// Кнопка НАЗАД
function goBack() {
    if (history.length <= 1) {
        closeAll();
        return;
    }
    history.pop();
    let current = history[history.length - 1];
    
    if (current === 'main') closeAll();
    else if (current === 'shop') renderShop();
}

function closeAll() {
    document.getElementById('main-overlay').style.display = 'none';
    history = ['main'];
}

function showDialog(text, options) {
    let btns = options.map(o => `<button class="menu-btn" onclick="closeAll()">${o}</button>`).join('');
    document.getElementById('main-content').innerHTML = `<div style="text-align:center; margin-bottom:20px;">${text}</div>${btns}`;
}

updateUI();

