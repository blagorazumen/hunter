let tg = window.Telegram.WebApp;
if (tg) tg.expand();

let cash = 328000;
let income = 0;
let view = 'main'; 

function updateUI() {
    const val = Math.floor(cash).toLocaleString('ru-RU');
    document.getElementById('cash-display').innerText = val;
    const ovCash = document.getElementById('ov-cash');
    if (ovCash) ovCash.innerText = val;
    document.getElementById('income-display').innerText = `ДОХОД: ${Math.floor(income)} / СЕК`;
}

function doSueta() {
    cash += 100;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    updateUI();
}

function openTab(tab) {
    const ct = document.getElementById('main-content');
    document.getElementById('main-overlay').style.display = 'flex';
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    if (tab === 'shop') {
        view = 'shop';
        document.getElementById('shop-btn').classList.add('active');
        ct.innerHTML = `<h2 style="text-align:center; margin-bottom:30px; color:var(--gold);">МАГАЗИН</h2>
                        <button class="menu-btn" onclick="showTasks()">ТЕМКИ</button>
                        <button class="menu-btn" onclick="alert('Будет в обнове')">ОДЁЖКА</button>`;
    } else if (tab === 'code') {
        view = 'code';
        document.getElementById('code-btn').classList.add('active');
        ct.innerHTML = `<h2 style="text-align:center; margin-bottom:30px; color:var(--gold);">СИСТЕМА</h2>
                        <input type="text" id="code-input" placeholder="Введите код">
                        <button class="menu-btn" onclick="applyCode()">АКТИВИРОВАТЬ</button>`;
    }
    updateUI();
}

function goBack() {
    if (view === 'districts') showTasks();
    else if (view === 'tasks') openTab('shop');
    else {
        document.getElementById('main-overlay').style.display = 'none';
        view = 'main';
    }
}

function showTasks() {
    view = 'tasks';
    let html = `<h2 style="text-align:center; margin-bottom:30px; color:var(--gold);">ТЕМКИ</h2>`;
    DB.items.tasks.forEach((item, idx) => {
        html += `<button class="menu-btn" onclick="showDistricts(${idx})">${item.name}</button>`;
    });
    document.getElementById('main-content').innerHTML = html;
}

function showDistricts(idx) {
    view = 'districts';
    const item = DB.items.tasks[idx];
    let html = `<h2 style="text-align:center; margin-bottom:25px; color:var(--gold);">${item.name}</h2>`;
    for (let key in DB.districts) {
        let d = DB.districts[key];
        let price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, item.owned[key]));
        let inc = Math.floor(item.income * d.mult);
        html += `<div class="card">
            <div style="font-size:11px;"><b>${d.name}</b><br><span style="color:var(--gold);">+${inc}/с | Доля: ${item.owned[key]}</span></div>
            <button onclick="buy(${idx}, '${key}')" style="color:var(--gold); border:1px solid var(--gold); background:none; padding:8px 12px; font-size:11px;">${price.toLocaleString()}</button>
        </div>`;
    }
    document.getElementById('main-content').innerHTML = html;
}

function buy(idx, key) {
    const item = DB.items.tasks[idx];
    const d = DB.districts[key];
    const price = Math.floor((item.basePrice * d.priceMult) * Math.pow(1.15, item.owned[key]));
    if (cash >= price) {
        cash -= price;
        item.owned[key]++;
        recalc();
        updateUI();
        showDistricts(idx);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    } else {
        alert("Денег нет, суети больше!");
    }
}

function applyCode() {
    const input = document.getElementById('code-input').value;
    if (input === '032805') {
        cash += 10000000;
        alert("Код принят: +10 000 000 сум!");
        updateUI();
    } else {
        alert("Неверный код");
    }
}

function recalc() {
    income = 0;
    DB.items.tasks.forEach(i => {
        for (let k in i.owned) income += (i.income * DB.districts[k].mult) * i.owned[k];
    });
}

setInterval(() => { if(income > 0) { cash += (income/10); updateUI(); } }, 100);
updateUI();

