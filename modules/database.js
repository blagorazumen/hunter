const DB = {
    // Основные настройки «движка»
    config: {
        startCash: 100000,      // Стартовый капитал: 100 000 сум
        clickValue: 10000,      // Один клик: 10 000 сум
        bonusMaxPercent: 0.5,   // Лимит бонуса: не более 50% от баланса
        currency: "СУМ"
    },

    // Коэффициенты районов Ташкента
    districts: {
        city: { 
            name: "CITY (MIRABAD)", 
            priceMult: 10, 
            incomeMult: 5,
            desc: "Элита города. Огромные вложения, но статус решает всё."
        },
        yakka: { 
            name: "YAKKASARAY", 
            priceMult: 5, 
            incomeMult: 2.5,
            desc: "Центральные улицы, солидные клиенты."
        },
        chil: { 
            name: "CHILANZAR", 
            priceMult: 2, 
            incomeMult: 1,
            desc: "Золотая середина. Здесь крутится основная суета."
        },
        yash: { 
            name: "YASHNABAD", 
            priceMult: 1, 
            incomeMult: 0.5,
            desc: "Рабочие кварталы, стабильный небольшой доход."
        },
        sergeli: { 
            name: "SERGELI", 
            priceMult: 0.5, 
            incomeMult: 0.25,
            desc: "Родные края. Дешевый вход в бизнес."
        }
    },

    // Список доступных «Темок»
    items: {
        tasks: [
            {
                id: "cigarettes",
                name: "Точка штучных сигарет",
                basePrice: 500000,
                baseIncome: 500,
                desc: "Штучный товар всегда в цене на остановках.",
                owned: { city: 0, yakka: 0, chil: 0, yash: 0, sergeli: 0 }
            },
            {
                id: "delivery",
                name: "Доставка на Дамасе",
                basePrice: 2500000,
                baseIncome: 3000,
                desc: "Развозим всё: от лепешек до запчастей.",
                owned: { city: 0, yakka: 0, chil: 0, yash: 0, sergeli: 0 }
            }
        ],
        // Место под будущую «Одёжку» и «Машины»
        clothes: [],
        garage: []
    }
};

