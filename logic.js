let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 100;

function updateUI() {
    const cashEl = document.getElementById('cash-display');
    const incEl = document.getElementById('income-display');
    if (cashEl) cashEl.innerText = Math.floor(cash).toLocaleString('ru-RU');
    if (incEl) incEl.innerText = `Доход: ${Math.floor(income)} / сек`;
}

function doSueta() {
    cash += clickValue;
    if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

// ГЛАВНАЯ ФУНКЦИЯ ОТКРЫТИЯ ОКОН
function openTab(tabName) {
    const overlay = document.getElementById('main-overlay');
    const content = document.getElementById('main-content');

    if (!overlay || !content) {
        alert("Ошибка: Не найдены ID 'main-overlay' или 'main-content' в HTML!");
        return;
    }

    overlay.style.display = 'flex';

    if (tabName === 'shop') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px; margin-bottom: 30px;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderTasks()">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="alert('Раздел в пути...')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="alert('Раздел в пути...')">РУЛЬ И КОЛЁСА</button>
        `;
    } else {
        content.innerHTML = `<h2 style="margin-top: 50px;">СКОРО</h2><p>Этот раздел еще не завезли.</p>`;
    }
}

function closeTab() {
    const overlay = document.getElementById('main-overlay');
    if (overlay) overlay.style.display = 'none';
}

// ОТРИСОВКА ТЕМОК ИЗ БАЗЫ
function renderTasks() {
    const content = document.getElementById('main-content');
    
    // Проверка: загрузился ли ящик database.js
    if (typeof DB === 'undefined') {
        alert("Ошибка: База данных (database.js) не загружена!");
        return;
    }

    const cigs = DB.items.tasks[0];
    let html = `<h2 style="letter-spacing: 3px; margin-bottom: 20px;">${cigs.name}</h2>`;
    
    for (let distKey in DB.districts) {
        let distInfo = DB.districts[distKey];
        let count = cigs.owned[distKey];
        let price = Math.floor(cigs.basePrice * Math.pow(1.15, count));
        let inc = Math.floor(cigs.baseIncome * distInfo.multiplier);

        html += `
            <div style="background:rgba(255,255,255,0.05); border:1px solid #333; padding:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <div style="text-align:left; font-size:12px;">
                    <b>${distInfo.name} [${distKey}]</b><br>
                    <small>+${inc}/сек | Куплено: ${count}</small>
                </div>
                <button onclick="buyItem('${distKey}')" style="background:none; border:1px solid #d4af37; color:#d4af37; padding:5px 10px; font-size:11px;">
                    ${price.toLocaleString()}
                </button>
            </div>
        `;
    }
    html += `<button onclick="openTab('shop')" style="margin-top:20px; color:#d4af37; background:none; border:none;">← НАЗАД</button>`;
    content.innerHTML = html;
}

// Логика покупки
function buyItem(distKey) {
    const cigs = DB.items.tasks[0];
    let price = Math.floor(cigs.basePrice * Math.pow(1.15, cigs.owned[distKey]));

    if (cash >= price) {
        cash -= price;
        cigs.owned[distKey]++;
        recalculate();
        updateUI();
        renderTasks(); // Обновляем экран
    } else {
        alert("Мало сум!");
    }
}

function recalculate() {
    income = 0;
    const cigs = DB.items.tasks[0];
    for (let key in cigs.owned) {
        income += (cigs.baseIncome * DB.districts[key].multiplier) * cigs.owned[key];
    }
}

setInterval(() => { if (income > 0) { cash += (income / 10); updateUI(); } }, 100);
updateUI();
