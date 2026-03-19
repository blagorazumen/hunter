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
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.includes(name === 'shop' ? 'МАГАЗИН' : name === 'assets' ? 'ИМУЩЕСТВО' : 'ЛИДЕРЫ')) btn.classList.add('active');
    });

    if (name === 'shop') {
        ct.innerHTML = `
            <h2 style="letter-spacing:5px; margin-bottom:30px; color:var(--gold);">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderCategory('tasks')">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="renderCategory('clothes')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="renderCategory('wheels')">РУЛЬ И КОЛЁСА</button>
        `;
    } else {
        ct.innerHTML = `<h2 style="color:var(--gold); letter-spacing:5px;">СКОРО</h2><p style="opacity:0.5; margin-top:20px; text-transform:uppercase; font-size:12px;">В разработке...</p>`;
    }
}

// 1. ПОКАЗЫВАЕМ СПИСОК ДОСТУПНЫХ СХЕМ
function renderCategory(cat) {
    const ct = document.getElementById('main-content');
    if (cat === 'tasks') {
        let html = `<h2 style="margin-bottom:25px; color:var(--gold); letter-spacing:2px;">ДОСТУПНЫЕ ТЕМКИ</h2>`;
        
        // Проходим по всем схемам в базе
        DB.items.tasks.forEach((item, index) => {
            html += `
                <button class="shop-menu-btn" onclick="renderDistricts(${index})">
                    ${item.name.toUpperCase()}
                </button>
            `;
        });

        html += `<button class="back-btn" onclick="openTab('shop')">← Назад в магазин</button>`;
        ct.innerHTML = html;
    } else {
        ct.innerHTML = `<h2>ПУСТО</h2><button class="back-btn" onclick="openTab('shop')">← Назад</button>`;
    }
}

// 2. ПОКАЗЫВАЕМ РАЙОНЫ ДЛЯ ВЫБРАННОЙ СХЕМЫ
function renderDistricts(itemIdx) {
    const ct = document.getElementById('main-content');
    const item = DB.items.tasks[itemIdx];
    
    let html = `<h2 style="margin-bottom:20px; color:var(--gold); letter-spacing:1px;">${item.name}</h2>`;
    html += `<p style="font-size:10px; opacity:0.6; margin-bottom:20px;">ВЫБЕРИТЕ РАЙОН ДЛЯ МАСШТАБИРОВАНИЯ:</p>`;

    for (let key in DB.districts) {
        let d = DB.districts[key];
        let count = item.owned[key];
        let currentPrice = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, count));
        let inc = Math.floor(item.income * d.mult);

        html += `
            <div class="item-card">
                <div style="font-size:11px; text-transform:uppercase;">
                    <b>${d.name}</b><br>
                    <span style="color:var(--gold); opacity:0.8;">+${inc}/с | Доля: ${count}</span>
                </div>
                <button onclick="buy('tasks', ${itemIdx}, '${key}')" style="background:none; border:1px solid var(--gold); color:var(--gold); padding:10px; font-size:11px; min-width:90px;">
                    ${currentPrice.toLocaleString()}
                </button>
            </div>`;
    }

    html += `<button class="back-btn" onclick="renderCategory('tasks')">← К списку темок</button>`;
    ct.innerHTML = html;
}

function buy(cat, idx, key) {
    const item = DB.items[cat][idx];
    const d = DB.districts[key];
    let price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, item.owned[key]));

    if (cash >= price) {
        cash -= price;
        item.owned[key]++;
        recalc();
        updateUI();
        renderDistricts(idx); // Обновляем экран районов
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else {
        alert("Денег не хватает. Суети активнее!");
    }
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
