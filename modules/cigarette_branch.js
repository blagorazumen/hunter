// Логика ветви "Точка штучных сигарет"
function openCigaretteMenu() {
    let html = `
        <p style="margin-bottom:20px; text-align:center;">ВЫБЕРИ РАЙОН ДЛЯ ТОЧКИ:</p>
        <div class="districts-list">
    `;

    // Берем районы из нашей базы данных
    for (let key in DB.districts) {
        let d = DB.districts[key];
        let price = DB.items.tasks[0].basePrice * d.pM; // Цена сигарет * множитель района
        
        html += `
            <button class="menu-btn" onclick="buyCigarettePoint('${key}', ${price})">
                <span style="color:var(--gold);">${d.name}</span><br>
                <small>Вход: ${price.toLocaleString()} СУМ</small>
            </button>
        `;
    }

    html += `</div>`;
    
    // Открываем в нашем универсальном окне
    document.getElementById('main-content').innerHTML = html;
    history.push('cigarette_branch'); // Добавляем в историю для кнопки "Назад"
}

function buyCigarettePoint(districtId, price) {
    if (cash >= price) {
        cash -= price;
        // Здесь будет логика сохранения купленной точки
        updateUI();
        showDialog(`Поздравляю! Теперь у тебя есть точка в районе ${DB.districts[districtId].name}.`, ["ОТЛИЧНО"]);
    } else {
        showDialog("Недостаточно насуетил денег для этого района.", ["ПОНЯЛ"]);
    }
}

