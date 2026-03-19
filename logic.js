let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 50;

function updateUI() {
    let cashEl = document.getElementById('cash-display');
    let incEl = document.getElementById('income-display');
    if (cashEl) cashEl.innerText = Math.floor(cash).toLocaleString('ru-RU');
    if (incEl) incEl.innerText = `Доход: ${Math.floor(income)} / сек`;
}

function doSueta() {
    cash += clickValue;
    if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

// ЗАЩИТА ОТ КЭША: реагируем и на старое, и на новое имя кнопки
function switchTab(tabName) { openTab(tabName); }

function openTab(tabName) {
    // Ищем окно по новому или старому ID
    const overlay = document.getElementById('overlay') || document.getElementById('tab-overlay');
    const content = document.getElementById('overlay-content') || document.getElementById('tab-content');
    
    if (!overlay || !content) return; // Если не нашел, ничего не делаем
    
    overlay.style.display = 'flex';

    if (tabName === 'shop') {
        content.innerHTML = `
            <h2 style="letter-spacing: 5px; margin-bottom: 30px;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderTasks()">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="alert('Жди завоз!')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="alert('Жди завоз!')">РУЛЬ И КОЛЁСА</button>
            <br><button onclick="closeTab()" style="margin-top:20px; color:#d4af37; background:none; border:none;">[ ЗАКРЫТЬ ]</button>
        `;
    } else {
        content.innerHTML = `
            <h2 style="margin-top: 50px;">В РАЗРАБОТКЕ</h2>
            <br><button onclick="closeTab()" style="margin-top:20px; color:#d4af37; background:none; border:none;">[ ЗАКРЫТЬ ]</button>
        `;
    }
}

function closeTab() {
    const overlay = document.getElementById('overlay') || document.getElementById('tab-overlay');
    if (overlay) overlay.style.display = 'none';
}

// === ВЫЧИСЛИТЕЛЬНАЯ СИСТЕМА: ТЕМКИ ===
function renderTasks() {
    const content = document.getElementById('overlay-content') || document.getElementById('tab-content');
    // Достаем сигареты из Ящика 3 (database.js)
    const cigs = DB.items.tasks[0]; 

    let html = `<h2 style="letter-spacing: 3px; margin-bottom: 20px;">${cigs.name}</h2>`;
    
    // Перебираем районы S, A, B, C, D
    for (let distKey in DB.districts) {
        let distInfo = DB.districts[distKey];
        let count = cigs.owned[distKey]; 
        
        // Математика: Цена растет на 15% за каждую точку
        let currentPrice = cigs.basePrice * Math.pow(1.15, count);
        // Математика: Базовый доход (16.66) умножаем на крутость района
        let currentIncome = cigs.baseIncome * distInfo.multiplier;

        html += `
            <div style="background: rgba(255,255,255,0.05); border: 1px solid #333; padding: 15px; margin-bottom: 10px; text-align: left; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <b>${distInfo.name} [${distKey}]</b><br>
                    <small style="opacity:0.6">Доход: +${Math.floor(currentIncome)}/сек | Точек: ${count}</small>
                </div>
                <button onclick="buyTask('cig', '${distKey}')" style="background:none; border:1px solid #d4af37; color:#d4af37; padding:8px; font-size:12px; cursor:pointer;">
                    ${Math.floor(currentPrice).toLocaleString()}
                </button>
            </div>
        `;
    }

    html += `<br><button onclick="openTab('shop')" style="margin-top: 20px; color: #d4af37; background: none; border: none; letter-spacing: 2px;">← НАЗАД</button>`;
    content.innerHTML = html;
}

// === ЛОГИКА ПОКУПКИ ===
function buyTask(taskId, distKey) {
    const item = DB.items.tasks.find(t => t.id === taskId);
    let count = item.owned[distKey];
    let currentPrice = item.basePrice * Math.pow(1.15, count);

    if (cash >= currentPrice) {
        cash -= currentPrice;
        item.owned[distKey]++; // Добавляем +1 точку
        
        recalculateIncome(); // Пересчитываем общий доход
        if (tg && tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        
        updateUI();
        renderTasks(); // Обновляем цены на экране
    } else {
        alert("Не хватает сум! Суети активнее.");
    }
}

// === ПЕРЕСЧЕТ ДОХОДА ===
function recalculateIncome() {
    income = 0;
    // Считаем точки по всем районам
    DB.items.tasks.forEach(item => {
        for (let distKey in item.owned) {
            let count = item.owned[distKey];
            let distInfo = DB.districts[distKey];
            if (count > 0) {
                income += (item.baseIncome * distInfo.multiplier) * count;
            }
        }
    });
}

setInterval(() => {
    if (income > 0) {
        cash += (income / 10);
        updateUI();
    }
}, 100);

updateUI();
