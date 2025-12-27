export const mainCurrencies = [
    // --- Monedas G10 (Más negociadas) ---
    {
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: '$',
    },
    {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
    },
    {
        code: 'JPY',
        name: 'Yen Japonés',
        symbol: '¥',
    },
    {
        code: 'GBP',
        name: 'Libra Esterlina',
        symbol: '£',
    },
    {
        code: 'AUD',
        name: 'Dólar Australiano',
        symbol: 'A$',
    },
    {
        code: 'CAD',
        name: 'Dólar Canadiense',
        symbol: 'C$',
    },
    {
        code: 'CHF',
        name: 'Franco Suizo',
        symbol: 'Fr',
    },
    {
        code: 'CNY',
        name: 'Yuan Chino',
        symbol: '¥',
    },

    // --- Monedas Relevantes (Latinoamérica) ---
    {
        code: 'VES',
        name: 'Bolívar Soberano',
        symbol: 'Bs.',
    },
    {
        code: 'BRL',
        name: 'Real Brasileño',
        symbol: 'R$',
    },
    {
        code: 'MXN',
        name: 'Peso Mexicano',
        symbol: '$',
    },
    {
        code: 'ARS',
        name: 'Peso Argentino',
        symbol: '$',
    },
    {
        code: 'COP',
        name: 'Peso Colombiano',
        symbol: '$',
    },
    {
        code: 'CLP',
        name: 'Peso Chileno',
        symbol: '$',
    },
    {
        code: 'PEN',
        name: 'Sol Peruano',
        symbol: 'S/',
    },

    // --- Otras monedas importantes ---
    {
        code: 'INR',
        name: 'Rupia India',
        symbol: '₹',
    },
    {
        code: 'RUB',
        name: 'Rublo Ruso',
        symbol: '₽',
    },
];

export type ClientInvoice = {
    invoice_id: string;
    branch_id: string;
    issue_date: string;
    total_amount: string;
    status: string;
};

export type InvoiceList = {
    client_name: string;
    invoice_id: string;
    invoice_number: string;
    issue_date: string;
    status: string;
    total_amount: number;
};
