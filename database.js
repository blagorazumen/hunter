const DB = {
    // Настройки экономики
    settings: {
        startCash: 100000,
        clickValue: 10000,
        bonusMaxPercent: 0.5 // Тот самый лимит 50%
    },

    // Коэффициенты районов (для папки /shop)
    districts: {
        city: { name: "CITY (MIRABAD)", priceMult: 10, mult: 5 },
        yakka: { name: "YAKKASARAY", priceMult: 5, mult: 2.5 },
        chil: { name: "CHILANZAR", priceMult: 2, mult: 1 },
        yash: { name: "YASHNABAD", priceMult: 1, mult: 0.5 },
        sergeli: { name: "SERGELI", priceMult: 0.5, mult: 0.25 }
    },

    // Твои активы
    items: {
        tasks: [
            {
                id: "cigarettes",
                name: "Точка штучных сигарет",
                desc: "Классика жанра. Спрос есть всегда, вопросы тоже.",
                basePrice: 500000, // Цена с учетом клика в 10к
                baseIncome: 500,
                owned: { city: 0, yakka: 0, chil: 0, yash: 0, sergeli: 0 }
            },
            {
                id: "delivery",
                name: "Доставка на Дамасе",
                desc: "Развозим лепешки и запчасти. Скорость — наше всё.",
                basePrice: 2000000,
                baseIncome: 2500,
                owned: { city: 0, yakka: 0, chil: 0, yash: 0, sergeli: 0 }
            }
        ]
    }
};
