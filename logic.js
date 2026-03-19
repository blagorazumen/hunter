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

function switchTab(tab) {
    tg.HapticFeedback.selectionChanged();
    const overlay = document.getElementById('tab-overlay');
    const content = document.getElementById('tab-content');
    overlay.style.display = 'flex';

    if (tab === 'shop') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px;">МАГАЗИН</h2>
            <div class="shop-nav-grid">
                <button class="shop-btn" onclick="openCategory('wheels')">РУЛЬ И КОЛЁСА</button>
                <button class="shop-btn" onclick="openCategory('clothes')">ОДЁЖКА</button>
                <button class="shop-btn" onclick="openCategory('tasks')">ТЕМКИ</button>
            </div>
        `;
    } else if (tab === 'leaderboard') {
        content.innerHTML = `<h2>ЛИДЕРЫ</h2><p style="opacity:0.5; margin-top:20px;">Список лучших суетологов пуст.</p>`;
    } else if (tab === 'assets') {
        content.innerHTML = `<h2>ИМУЩЕСТВО</h2><p style="opacity:0.5; margin-top:20px;">Пока только амбиции и 328к.</p>`;
    }
}

function openCategory(cat) {
    const content = document.getElementById('tab-content');
    if (cat === 'wheels') {
        content.innerHTML = `<h3>РУЛЬ И КОЛЁСА</h3><p style="opacity:0.5; margin-top:20px;">Диски-арбузы появятся позже.</p><br><button onclick="switchTab('shop')" style="color:#d4af37; background:none; border:none; letter-spacing:2px;">НАЗАД</button>`;
    } else if (cat === 'clothes') {
        content.innerHTML = `<h3>ОДЁЖКА</h3><p style="opacity:0.5; margin-top:20px;">Присматриваешь ветровку?</p><br><button onclick="switchTab('shop')" style="color:#d4af37; background:none; border:none; letter-spacing:2px;">НАЗАД</button>`;
    } else if (cat === 'tasks') {
        content.innerHTML = `<h3>ТЕМКИ</h3><p style="opacity:0.5; margin-top:20px;">Тут будет твой пассивный доход.</p><br><button onclick="switchTab('shop')" style="color:#d4af37; background:none; border:none; letter-spacing:2px;">НАЗАД</button>`;
    }
}

function closeTab() {
    document.getElementById('tab-overlay').style.display = 'none';
}

setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

updateUI();
