export const OPTIONS_APPROVAL_LEVELS = [
    {
        level: 1,
        description: "Covered calls, cash-secured puts",
        allowedStrategies: ["Covered Call", "Protective Put"],
    },
    {
        level: 2,
        description: "Long options, debit spreads",
        allowedStrategies: [
            "Long Call", "Long Put", "Covered Call", "Protective Put",
            "Bull Call Spread", "Bear Put Spread", "Long Straddle", "Long Strangle",
        ],
    },
    {
        level: 3,
        description: "Credit spreads, short spreads",
        allowedStrategies: [
            "Long Call", "Long Put", "Covered Call", "Protective Put",
            "Bull Call Spread", "Bear Put Spread", "Long Straddle", "Long Strangle",
            "Call Ratio Spread", "Iron Condor", "Iron Butterfly", "Call Butterfly", "Box Spread",
        ],
    },
    {
        level: 4,
        description: "Naked options (full access)",
        allowedStrategies: ["*"],
    },
];
// Standard 2-leg and 4-leg templates
export const STRATEGY_TEMPLATES = [
    // Single leg
    {
        name: "Long Call",
        description: "Bullish directional bet with limited downside.",
        legCount: 1,
        legs: [{ side: "buy", optionType: "call", quantity: 1, ratio: 1 }],
    },
    {
        name: "Long Put",
        description: "Bearish directional bet with limited downside.",
        legCount: 1,
        legs: [{ side: "buy", optionType: "put", quantity: 1, ratio: 1 }],
    },
    // 2-leg spreads
    {
        name: "Covered Call",
        description: "Long underlying + short call. Earn premium on held assets.",
        legCount: 1,
        legs: [{ side: "sell", optionType: "call", quantity: 1, ratio: 1 }],
    },
    {
        name: "Protective Put",
        description: "Long underlying + long put. Downside protection.",
        legCount: 1,
        legs: [{ side: "buy", optionType: "put", quantity: 1, ratio: 1 }],
    },
    {
        name: "Bull Call Spread",
        description: "Long lower call + short higher call. Limited risk bullish.",
        legCount: 2,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Bear Put Spread",
        description: "Long higher put + short lower put. Limited risk bearish.",
        legCount: 2,
        legs: [
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Long Straddle",
        description: "Long call + long put at same strike. Profit from volatility.",
        legCount: 2,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Long Strangle",
        description: "Long OTM call + long OTM put. Cheaper vol play.",
        legCount: 2,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Call Ratio Spread",
        description: "Buy 1 call, sell 2 higher calls. Credit spread with upside cap.",
        legCount: 2,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 2, ratio: 2 },
        ],
    },
    // 4-leg spreads
    {
        name: "Iron Condor",
        description: "Short strangle + long wings. Profit from low volatility.",
        legCount: 4,
        legs: [
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Iron Butterfly",
        description: "Short straddle + long wings. Max profit at center strike.",
        legCount: 4,
        legs: [
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Call Butterfly",
        description: "Buy 1 lower + 1 higher call, sell 2 middle calls.",
        legCount: 4,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 2, ratio: 2 },
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
        ],
    },
    {
        name: "Box Spread",
        description: "Bull call spread + bear put spread. Arbitrage / financing.",
        legCount: 4,
        legs: [
            { side: "buy", optionType: "call", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "call", quantity: 1, ratio: 1 },
            { side: "buy", optionType: "put", quantity: 1, ratio: 1 },
            { side: "sell", optionType: "put", quantity: 1, ratio: 1 },
        ],
    },
];
//# sourceMappingURL=types.js.map