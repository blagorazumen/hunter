let tg = window.Telegram.WebApp;
tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 50;

function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('income-display').innerText = `Доход: ${Math.floor(income)} / сек`;
}

function doSueta() {
    cash += clickValue;
    tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function switchTab(tab) {
    tg.HapticFeedback.selectionChanged();
    const overlay = document.getElementById('tab-overlay');
    overlay.style.display = 'flex';
    
    if (tab === 'shop') showShopMain();
    else if (tab === 'leaderboard') document.getElementById('tab-content').innerHTML = `<h2>ЛИДЕРЫ</h2><p>Пусто...</p>`;
    else if (tab === 'assets') document.getElementById('tab-content').innerHTML = `<h2>ИМУЩЕСТВО</h2><p>Пусто...</p>`;
}

function showShopMain() {
    document.getElementById('tab-content').innerHTML = `
        <h2 style="letter-spacing: 5px;">МАГАЗИН</h2>
        <div class="shop-nav-grid">
            <button class="shop-btn" onclick="openCategory('wheels')">РУЛЬ И КОЛЁСА</button>
            <button class="shop-btn" onclick="openCategory('clothes')">ОДЁЖКА</button>
            <button class="shop-btn" onclick="openCategory('tasks')">ТЕМКИ</button>
        </div>
    `;
}

function openCategory(cat) {
    const content = document.getElementById('tab-content');
    const backBtn = `<br><button onclick="showShopMain()" class="back-link">← НАЗАД В МАГАЗИН</button>`;

    if (cat === 'tasks') {
        content.innerHTML = `
            <h3>ТЕМКИ</h3>
            <div class="menu-item" onclick="openSubCategory('cigarettes')">
                <b>СИГАРЕТНЫЕ АПАЮШКИ</b><br><small style="opacity:0.5">Развивай сеть по Ташкенту</small>
            </div>
            ${backBtn}
        `;
    } else {
        content.innerHTML = `<h3>СКОРО...</h3>${backBtn}`;
    }
}

function openSubCategory(taskId) {
    const content = document.getElementById('tab-content');
    const task = DB.tasks.find(t => t.id === taskId);
    let html = `<h3>${task.name}</h3>`;
    
    for (let tier in task.districts) {
        let d = task.districts[tier];
        let price = Math.floor(d.price * Math.pow(1.15, d.count));
        html += `
            <div class="district-card">
                <div class="dist-info"><b>${d.name}</b> [${tier}] — ${d.count} шт.<br>+${Math.floor(d.income * d.multiplier)}/сек</div>
                <button class="buy-dist-btn" onclick="buyInDistrict('${taskId}', '${tier}')">${price.toLocaleString()} СУМ</button>
            </div>
        `;
    }
    html += `<br><button onclick="openCategory('tasks')" class="back-link">← НАЗАД К ТЕМКАМ</button>`;
    content.innerHTML = html;
}

function buyInDistrict(taskId, tier) {
    const d = DB.tasks.find(t => t.id === taskId).districts[tier];
    let price = Math.floor(d.price * Math.pow(1.15, d.count));

    if (cash >= price) {
        cash -= price;
        d.count++;
        income += (d.income * d.multiplier);
        tg.HapticFeedback.notificationOccurred('success');
        updateUI();
        openSubCategory(taskId);
    } else {
        tg.HapticFeedback.notificationOccurred('error');
    }
}

function closeTab() { document.getElementById('tab-overlay').style.display = 'none'; }

setInterval(() => { if (income > 0) { cash += (income / 10); updateUI(); } }, 100);
updateUI();
