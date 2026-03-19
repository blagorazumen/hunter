let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let currentSubTab = null; // 'categories', 'districts'

function updateUI() {
    const formatted = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('cash-display').innerText = formatted;
    document.getElementById('income-display').innerText = `ДОХОД: ${Math.floor(income)} / СЕК`;
    
    // Обновляем баланс в шапке окна, если оно открыто
    const ovCash = document.getElementById('overlay-balance-val');
    if (ovCash) ovCash.innerText = formatted;
}

function doSueta() {
    cash += 100;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function openTab(name) {
    const ov = document.getElementById('main-overlay');
    const ct = document.getElementById('main-content');
    ov.style.display = 'flex';
    currentSubTab = null;

    // Сброс активных кнопок в меню
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if (name === 'shop') {
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        ct.innerHTML = `
            <h2 style="letter-spacing:5px; margin-bottom:30px; color:var(--gold); text-align:center;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderCategoryList('tasks')">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="alert('Скоро...')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="alert('Скоро...')">РУЛЬ И КОЛЁСА</button>
        `;
    } else if (name === 'leaderboard') {
        document.querySelectorAll('.nav-item')[2].classList.add('active');
        ct.innerHTML = `
            <h2 style="letter-spacing:5px; margin-bottom:20px; color:var(--gold); text-align:center;">СИСТЕМА</h2>
            <p style="font-size:12px; opacity:0.6; margin-bottom:20px; text-align:center;">ВВЕДИТЕ КОД ДОСТУПА:</p>
            <input type="text" id="promo-input" placeholder="000000">
            <button class="shop-menu-btn" onclick="checkCode()">АКТИВИРОВАТЬ</button>
        `;
    }
    updateUI();
}

// Кнопка НАЗАД (верхняя левая)
function goBack() {
    if (currentSubTab === 'districts') {
        renderCategoryList('tasks');
    } else if (currentSubTab === 'categories') {
        openTab('shop');
    } else {
        document.getElementById('main-overlay').style.display = 'none';
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.nav-item')[1].classList.add('active');
    }
}

function renderCategoryList(cat) {
    currentSubTab = 'categories';
    const ct = document.getElementById('main-content');
    let html = `<h2 style="margin-bottom:25px; color:var(--gold); text-align:center;">ТЕМКИ</h2>`;
    DB.items.tasks.forEach((item, index) => {
        html += `<button class="shop-menu-btn" onclick="renderDistricts(${index})">${item.name.toUpperCase()}</button>`;
    });
    ct.innerHTML = html;
}

function renderDistricts(itemIdx) {
    currentSubTab = 'districts';
    const ct = document.getElementById('main-content');
    const item = DB.items.tasks[itemIdx];
    let html = `<h2 style="margin-bottom:25px; color:var(--gold); text-align:center;">${item.name}</h2>`;

    for (let key in DB.districts) {
        let d = DB.districts[key];
        let count = item.owned[key];
        let price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, count));
        let inc = Math.floor(item.income * d.mult);

        html += `
            <div class="item-card">
                <div style="font-size:11px; text-transform:uppercase;">
                    <b>${d.name}</b><br>
                    <span style="color:var(--gold); opacity:0.8;">+${inc}/с | Доля: ${count}</span>
                </div>
                <button onclick="buy('tasks', ${itemIdx}, '${key}')" style="background:none; border:1px solid var(--gold); color:var(--gold); padding:10px; font-size:11px; min-width:90px;">
                    ${price.toLocaleString('ru-RU')}
                </button>
            </div>`;
    }
    ct.innerHTML = html;
}

function checkCode() {
    const val = document.getElementById('promo-input').value;
    if (val === '032805') {
        cash += 10000000;
        alert("Код принят! +10 000 000 СУМ");
        updateUI();
    } else {
        alert("Код не найден.");
    }
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
        renderDistricts(idx);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else {
        alert("Денег нет, но ты суети!");
    }
}

function recalc() {
    income = 0;
    DB.items.tasks.forEach(i => {
        for (let k in i.owned) { income += (i.income * DB.districts[k].mult) * i.owned[k]; }
    });
}

setInterval(() => { if (income > 0) { cash += (income / 10); updateUI(); } }, 100);
updateUI();
