const DB = {
    // Районы Ташкента с их множителями цены и дохода
    districts: {
        city: { name: "CITY (MIRABAD)", priceMult: 5, mult: 5 },
        yakka: { name: "YAKKASARAY/M.ULUGBEK", priceMult: 2.5, mult: 2.5 },
        chil: { name: "CHILANZAR/YUNUSABAD", priceMult: 1, mult: 1 },
        yash: { name: "YASHNABAD/ALMAZAR", priceMult: 0.5, mult: 0.5 },
        sergeli: { name: "SERGELI/BEKTEMIR", priceMult: 0.25, mult: 0.25 }
    },

    // Твои бизнес-активы (Темки)
    items: {
        tasks: [
            {
                name: "Точка штучных сигарет",
                basePrice: 50000, // Базовая цена для расчетов
                income: 33,      // Базовый доход в секунду
                owned: {
                    city: 0,
                    yakka: 0,
                    chil: 0,
                    yash: 0,
                    sergeli: 0
                }
            }
        ],
        clothes: [], // Задел на будущее
        wheels: []   // Задел на будущее
    }
};
