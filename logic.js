let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let clickValue = 100;

function updateUI() {
    document.getElementById('cash-display').innerText = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('income-display').innerText = `Доход: ${Math.floor(income)} / сек`;
}

function doSueta() {
    cash += clickValue;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function openTab(name) {
    const ov = document.getElementById('main-overlay');
    const ct = document.getElementById('main-content');
    ov.style.display = 'flex';

    if (name === 'shop') {
        ct.innerHTML = `
            <h2 style="letter-spacing:5px; margin-bottom:30px;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderCategory('tasks')">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="renderCategory('clothes')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="renderCategory('wheels')">РУЛЬ И КОЛЁСА</button>
        `;
    } else {
        ct.innerHTML = `<h2>СКОРО</h2><p style="opacity:0.5; margin-top:20px;">Раздел в разработке...</p>`;
    }
}

function renderCategory(cat) {
    const ct = document.getElementById('main-content');
    if (cat === 'tasks') {
        const item = DB.items.tasks[0];
        let html = `<h2 style="margin-bottom:20px;">${item.name}</h2>`;
        for (let key in DB.districts) {
            let d = DB.districts[key];
            let count = item.owned[key];
            let price = Math.floor(item.price * Math.pow(1.15, count));
            let inc = Math.floor(item.income * d.mult);
            html += `
                <div class="item-card">
                    <div style="font-size:12px;"><b>${d.name}</b><br><small>+${inc}/с | Куплено: ${count}</small></div>
                    <button onclick="buy('tasks', 0, '${key}')" style="background:none; border:1px solid #d4af37; color:#d4af37; padding:8px; font-size:11px;">
                        ${price.toLocaleString()}
                    </button>
                </div>`;
        }
        html += `<button onclick="openTab('shop')" style="margin-top:20px; color:#d4af37; background:none; border:none;">← НАЗАД</button>`;
        ct.innerHTML = html;
    } else {
        ct.innerHTML = `<h2>ПУСТО</h2><button onclick="openTab('shop')" style="margin-top:20px; color:#d4af37; background:none; border:none;">← НАЗАД</button>`;
    }
}

function buy(cat, idx, key) {
    const item = DB.items[cat][idx];
    let price = Math.floor(item.price * Math.pow(1.15, item.owned[key]));
    if (cash >= price) {
        cash -= price;
        item.owned[key]++;
        recalc();
        updateUI();
        renderCategory(cat);
    } else { alert("Мало сум!"); }
}

function recalc() {
    income = 0;
    DB.items.tasks.forEach(i => {
        for (let k in i.owned) { income += (i.income * DB.districts[k].mult) * i.owned[k]; }
    });
}

function closeTab() { document.getElementById('main-overlay').style.display = 'none'; }

setInterval(() => { if (income > 0) { cash += (income / 10); updateUI(); } }, 100);
updateUI();

