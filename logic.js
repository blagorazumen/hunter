let tg = window.Telegram.WebApp;
tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 50;

// Обновление цифр на экране
function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('income-display').innerText = `Доход: ${income} / сек`;
}

// Клик
function doSueta() {
    cash += clickValue;
    tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

// Переключение вкладок меню
function switchTab(tab) {
    tg.HapticFeedback.selectionChanged();
    const overlay = document.getElementById('tab-overlay');
    const content = document.getElementById('tab-content');
    overlay.style.display = 'flex';

    if (tab === 'shop') {
        content.innerHTML = `
            <h2>МАГАЗИН ТЕМ</h2>
            <div style="border: 1px solid #333; padding: 10px; margin-top: 20px;" onclick="buyBusiness(100000, 500)">
                Связи на заправке<br><small>Цена: 100к | Доход: +500/сек</small>
            </div>
        `;
    } else if (tab === 'leaderboard') {
        content.innerHTML = `<h2>ТАБЛИЦА ЛИДЕРОВ</h2><p>Ты на 1-м месте (тест)</p>`;
    } else if (tab === 'assets') {
        content.innerHTML = `<h2>ТВОЁ ИМУЩЕСТВО</h2><p>Пока только пыль на ботинках...</p>`;
    }
}

function closeTab() {
    document.getElementById('tab-overlay').style.display = 'none';
}

function buyBusiness(cost, boost) {
    if (cash >= cost) {
        cash -= cost;
        income += boost;
        tg.HapticFeedback.notificationOccurred('success');
        updateUI();
        closeTab();
    } else {
        alert("Недостаточно сум для этой темы.");
    }
}

// Пассивный доход (работает только если куплен бизнес)
setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

updateUI();

