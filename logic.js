let tg = window.Telegram.WebApp;
tg.expand();

// Основные переменные игрока
let cash = 328000;
let income = 0;
let clickValue = 50;

// Вычислительная система: Обновление экрана
function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('income-display').innerText = `Доход: ${Math.floor(income)} / сек`;
}

// Вычислительная система: Клик
function doSueta() {
    cash += clickValue;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

// Управление окнами (Навигация)
function openTab(tabName) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('overlay-content');
    overlay.style.display = 'flex';

    if (tabName === 'shop') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px; margin-bottom: 30px;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderCategory('tasks')">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="renderCategory('clothes')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="renderCategory('wheels')">РУЛЬ И КОЛЁСА</button>
        `;
    } else {
        content.innerHTML = `<h2 style="margin-top: 50px;">В РАЗРАБОТКЕ</h2>`;
    }
}

// Отрисовка конкретной категории (читает из database.js)
function renderCategory(categoryType) {
    const content = document.getElementById('overlay-content');
    content.innerHTML = `<h3 style="margin-bottom: 20px; letter-spacing: 2px;">РАЗДЕЛ</h3>`;
    
    // Позже мы напишем логику, которая будет перебирать товары из DB.items[categoryType]
    content.innerHTML += `<p style="opacity: 0.5;">Тут будут подгружаться товары из базы...</p>`;
    
    // Кнопка НАЗАД
    content.innerHTML += `<br><button onclick="openTab('shop')" style="margin-top: 30px; color: #d4af37; background: none; border: none; letter-spacing: 2px;">← НАЗАД</button>`;
}

function closeTab() {
    document.getElementById('overlay').style.display = 'none';
}

// Вычислительная система: Пассивный доход (крутится 10 раз в секунду)
setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

// Запуск при загрузке
updateUI();

