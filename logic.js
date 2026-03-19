// Проверка подключения Telegram
let tg = window.Telegram.WebApp;
if (tg) {
    tg.expand();
}

// Переменные
let cash = 328000;
let income = 0;
let clickValue = 50;

// Обновление цифр на экране
function updateUI() {
    const cashElement = document.getElementById('cash-display');
    const incomeElement = document.getElementById('income-display');
    
    if (cashElement) {
        cashElement.innerText = Math.floor(cash).toLocaleString('ru-RU');
    }
    if (incomeElement) {
        incomeElement.innerText = `Доход: ${Math.floor(income)} / сек`;
    }
}

// Функция клика
function doSueta() {
    cash += clickValue;
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    updateUI();
}

// Открытие вкладок меню
function switchTab(tab) {
    const overlay = document.getElementById('tab-overlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    
    if (tab === 'shop') {
        showShopMain();
    } else {
        document.getElementById('tab-content').innerHTML = `<h2>СКОРО</h2><p>Раздел в разработке</p>`;
    }
}

function showShopMain() {
    const content = document.getElementById('tab-content');
    content.innerHTML = `
        <h2 style="letter-spacing: 5px;">МАГАЗИН</h2>
        <div class="shop-nav-grid">
            <button class="shop-btn" onclick="openCategory('tasks')">ТЕМКИ</button>
            <button class="shop-btn" onclick="openCategory('wheels')">РУЛЬ И КОЛЁСА</button>
            <button class="shop-btn" onclick="openCategory('clothes')">ОДЁЖКА</button>
        </div>
    `;
}

function openCategory(cat) {
    const content = document.getElementById('tab-content');
    const backBtn = `<br><button onclick="showShopMain()" class="back-link">← НАЗАД</button>`;

    if (cat === 'tasks') {
        content.innerHTML = `
            <h3>ТЕМКИ</h3>
            <div class="menu-item" onclick="openSubCategory('cigarettes')">
                <b>СИГАРЕТНЫЕ АПАЮШКИ</b><br><small style="opacity:0.5">Сеть по Ташкенту</small>
            </div>
            ${backBtn}
        `;
    } else {
        content.innerHTML = `<h3>СКОРО...</h3>${backBtn}`;
    }
}

function openSubCategory(taskId) {
    const content = document.getElementById('tab-content');
    // Ищем данные в database.js
    const task = DB.tasks.find(t => t.id === taskId);
    let html = `<h3>${task.name}</h3>`;
    
    for (let tier in task.districts) {
        let d = task.districts[tier];
        let price = Math.floor(d.price * Math.pow(1.15, d.count));
        html += `
            <div class="district-card" style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
                <div style="text-align:left; font-size:12px;"><b>${d.name}</b><br>+${Math.floor(d.income * d.multiplier)}/с</div>
                <button onclick="buyInDistrict('${taskId}', '${tier}')" style="background:none; border:1px solid gold; color:gold; font-size:10px;">
                    ${price.toLocaleString()}
                </button>
            </div>
        `;
    }
    html += `<br><button onclick="openCategory('tasks')" class="back-link">← НАЗАД</button>`;
    content.innerHTML = html;
}

function buyInDistrict(taskId, tier) {
    const task = DB.tasks.find(t => t.id === taskId);
    const d = task.districts[tier];
    let price = Math.floor(d.price * Math.pow(1.15, d.count));

    if (cash >= price) {
        cash -= price;
        d.count++;
        income += (d.income * d.multiplier);
        updateUI();
        openSubCategory(taskId);
    } else {
        alert("Мало сум!");
    }
}

function closeTab() {
    document.getElementById('tab-overlay').style.display = 'none';
}

// Запуск пассивного дохода
setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

// Инициализация при запуске
updateUI();
