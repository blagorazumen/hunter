function openCategory(cat) {
    const content = document.getElementById('tab-content');
    const backBtn = `<br><button onclick="showShopMain()" class="back-link">← НАЗАД В МАГАЗИН</button>`;

    if (cat === 'tasks') {
        content.innerHTML = `
            <h3 style="letter-spacing:3px;">ТЕМКИ</h3>
            <div class="menu-item" onclick="openSubCategory('cigarettes')">
                <b>СИГАРЕТНЫЕ АПАЮШКИ</b><br>
                <small style="opacity:0.5">Развивай сеть по всему Ташкенту</small>
            </div>
            ${backBtn}
        `;
    }
}

// Новая функция для вложенного меню районов
function openSubCategory(taskId) {
    const content = document.getElementById('tab-content');
    const task = DB.tasks.find(t => t.id === taskId);
    
    let html = `<h3 style="letter-spacing:2px;">${task.name}</h3>`;
    
    // Перебираем все районы для этой темки
    for (let tier in task.districts) {
        let d = task.districts[tier];
        let currentPrice = d.price * Math.pow(1.15, d.count); // Рост цены на 15%
        
        html += `
            <div class="district-card">
                <div class="dist-info">
                    <b>${d.name}</b> [${tier}] — ${d.count} шт.<br>
                    <small>Доход: +${Math.floor(d.income * d.multiplier)}/сек</small>
                </div>
                <button class="buy-dist-btn" onclick="buyInDistrict('${taskId}', '${tier}')">
                    ${Math.floor(currentPrice).toLocaleString()} СУМ
                </button>
            </div>
        `;
    }
    
    html += `<br><button onclick="openCategory('tasks')" class="back-link">← НАЗАД К ТЕМКАМ</button>`;
    content.innerHTML = html;
}

// Логика покупки в конкретном районе
function buyInDistrict(taskId, tier) {
    const task = DB.tasks.find(t => t.id === taskId);
    const d = task.districts[tier];
    let currentPrice = d.price * Math.pow(1.15, d.count);

    if (cash >= currentPrice) {
        cash -= currentPrice;
        d.count++;
        income += (d.income * d.multiplier); // Добавляем доход с учетом множителя района
        tg.HapticFeedback.notificationOccurred('success');
        updateUI();
        openSubCategory(taskId); // Обновляем экран районов
    } else {
        tg.HapticFeedback.notificationOccurred('error');
    }
}
