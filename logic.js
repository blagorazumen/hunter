let tg = window.Telegram.WebApp;
tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 50;

function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('income-display').innerText = `Доход: ${income} / сек`;
}

function doSueta() {
    cash += clickValue;
    tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

// Главная навигация (нижнее меню)
function switchTab(tab) {
    tg.HapticFeedback.selectionChanged();
    const overlay = document.getElementById('tab-overlay');
    const content = document.getElementById('tab-content');
    overlay.style.display = 'flex';

    if (tab === 'shop') {
        showShopMain();
    } else if (tab === 'leaderboard') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px;">ЛИДЕРЫ</h2>
            <p style="opacity:0.4; margin-top:40px;">Здесь будут те, кто навел больше всего суеты в городе.</p>
        `;
    } else if (tab === 'assets') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px;">ИМУЩЕСТВО</h2>
            <p style="opacity:0.4; margin-top:40px;">Список твоих приобретений пока пуст.</p>
        `;
    }
}

// Главный экран магазина
function showShopMain() {
    const content = document.getElementById('tab-content');
    content.innerHTML = `
        <h2 style="letter-spacing: 5px;">МАГАЗИН</h2>
        <div class="shop-nav-grid">
            <button class="shop-btn" onclick="openCategory('wheels')">РУЛЬ И КОЛЁСА</button>
            <button class="shop-btn" onclick="openCategory('clothes')">ОДЁЖКА</button>
            <button class="shop-btn" onclick="openCategory('tasks')">ТЕМКИ</button>
        </div>
    `;
}

// Внутренние категории с кнопкой НАЗАД
function openCategory(cat) {
    tg.HapticFeedback.selectionChanged();
    const content = document.getElementById('tab-content');
    
    // Заготовка под кнопку Назад (стиль: золото, без рамки)
    const backBtn = `<br><button onclick="showShopMain()" style="margin-top:40px; color:#d4af37; background:none; border:none; letter-spacing:3px; font-size:10px; cursor:pointer;">← НАЗАД В МАГАЗИН</button>`;

    if (cat === 'wheels') {
        content.innerHTML = `
            <h3 style="letter-spacing:3px;">РУЛЬ И КОЛЁСА</h3>
            <div style="opacity:0.5; padding:20px;">Диски «Арбузы», тонировка «в круг» и чехлы появятся в следующем обновлении.</div>
            ${backBtn}
        `;
    } else if (cat === 'clothes') {
        content.innerHTML = `
            <h3 style="letter-spacing:3px;">ОДЁЖКА</h3>
            <div style="opacity:0.5; padding:20px;">Стильные ветровки и кепки для правильного вида на районе.</div>
            ${backBtn}
        `;
    } else if (cat === 'tasks') {
        content.innerHTML = `
            <h3 style="letter-spacing:3px;">ТЕМКИ</h3>
            <div style="opacity:0.5; padding:20px;">Здесь ты будешь покупать свой пассивный доход. Первые лоты уже готовятся.</div>
            ${backBtn}
        `;
    }
}

function closeTab() {
    document.getElementById('tab-overlay').style.display = 'none';
}

// Пассивный доход
setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

updateUI();
