let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let currentSubTab = null;

function updateUI() {
    const formatted = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('cash-display').innerText = formatted;
    document.getElementById('income-display').innerText = `ДОХОД: ${Math.floor(income)} / СЕК`;
    
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

    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    if (name === 'shop') {
        document.getElementById('shop-nav').classList.add('active');
        ct.innerHTML = `
            <h2 style="color:var(--gold); text-align:center; margin-bottom:20px;">МАГАЗИН</h2>
            <button class="shop-menu-btn" onclick="renderCategoryList()">ТЕМКИ</button>
            <button class="shop-menu-btn" onclick="alert('Скоро...')">ОДЁЖКА</button>
            <button class="shop-menu-btn" onclick="alert('Скоро...')">РУЛЬ И КОЛЁСА</button>
        `;
    } else if (name === 'leaderboard') {
        document.getElementById('code-nav').classList.add('active');
        ct.innerHTML = `
            <h2 style="color:var(--gold); text-align:center; margin-bottom:20px;">СИСТЕМА</h2>
            <input type="text" id="promo-input" placeholder="КОД">
            <button class="shop-menu-btn" onclick="checkCode()">АКТИВИРОВАТЬ</button>
        `;
    }
    updateUI();
}

function goBack() {
    if (currentSubTab === 'districts') {
        renderCategoryList();
    } else {
        document.getElementById('main-overlay').style.display = 'none';
    }
}

function renderCategoryList() {
    currentSubTab = 'categories';
    const ct = document.getElementById('main-content');
    let html = `<h2 style="color:var(--gold); text-align:center; margin-bottom:20px;">ТЕМКИ</h2>`;
    DB.items.tasks.forEach((item, index) => {
        html += `<button class="shop-menu-btn" onclick="renderDistricts(${index})">${item.name}</button>`;
    });
    ct.innerHTML = html;
}

function renderDistricts(idx) {
    currentSubTab = 'districts';
    const ct = document.getElementById('main-content');
    const item = DB.items.tasks[idx];
    let html = `<h2 style="color:var(--gold); text-align:center; margin-bottom:20px;">${item.name}</h2>`;

    for (let key in DB.districts) {
        let d = DB.districts[key];
        let price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, item.owned[key]));
        let inc = Math.floor(item.income * d.mult);
        html += `
            <div class="item-card">
                <div style="font-size:11px;"><b>${d.name}</b><br>+${inc}/с | Доля: ${item.owned[key]}</div>
                <button class="buy-btn" onclick="buy(${idx}, '${key}')" style="background:none; border:1px solid var(--gold); color:var(--gold); padding:10px; font-size:10px;">
                    ${price.toLocaleString('ru-RU')}
                </button>
            </div>`;
    }
    ct.innerHTML = html;
}

function buy(idx, key) {
    const item = DB.items.tasks[idx];
    const d = DB.districts[key];
    let price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, item.owned[key]));
    if (cash >= price) {
        cash -= price;
        item.owned[key]++;
        recalc();
        updateUI();
        renderDistricts(idx);
    } else {
        alert("Мало денег!");
    }
}

function checkCode() {
    if (document.getElementById('promo-input').value === '032805') {
        cash += 10000000;
        alert("+10 000 000 СУМ!");
        updateUI();
    }
}

function recalc() {
    income = 0;
    DB.items.tasks.forEach(i => {
        for (let k in i.owned) income += (i.income * DB.districts[k].mult) * i.owned[k];
    });
}

setInterval(() => { if (income > 0) { cash += (income / 10); updateUI(); } }, 100);
updateUI();

