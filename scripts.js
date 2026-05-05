// ─── Seleção de Elementos ────────────────────────────────────────────────────
const convertBtn = document.getElementById('convert-btn');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amount = document.getElementById('amount');
const swapBtn = document.getElementById('swap-btn');

const currentRateEl = document.getElementById('current-rate');
const targetRateEl = document.getElementById('target-rate');

const fromFlagImg = document.querySelector('.box-current img');
const fromNameEl = document.querySelector('.from-currency-result');
const toFlagImg = document.querySelector('.box-target img');
const toNameEl = document.querySelector('.to-currency-result');
//Valor inicial do campo Valor a converter
amount.value = 0.01;

// ─── Cache das Taxas ─────────────────────────────────────────────────────
let ratesCache = {};

// ─── Dados das Bandeiras e Nomes ─────────────────────────────────────────────
const flags = {
    BRL: { file: './assets/flag-BRL.png', name: 'Real' },
    USD: { file: './assets/flag-USD.png', name: 'Dólar' },
    EUR: { file: './assets/flag-EUR.png', name: 'Euro' },
    GBP: { file: './assets/flag-GBP.png', name: 'Libra' },
    JPY: { file: './assets/flag-JPY.png', name: 'Iene' },
    CAD: { file: './assets/flag-CAD.png', name: 'Dólar Canadense' },
    AUD: { file: './assets/flag-AUD.png', name: 'Dólar Australiano' },
    CHF: { file: './assets/flag-CHF.png', name: 'Franco Suíço' },
    CNY: { file: './assets/flag-CNY.png', name: 'Yuan Chinês' },
    MXN: { file: './assets/flag-MXN.png', name: 'Peso Mexicano' },
};

// ─── Atualiza Bandeira e Nome ─────────────────────────────────────────────
function updateFlag(selectEl, imgEl, nameEl) {
    const opt = selectEl.options[selectEl.selectedIndex];
    const code = opt.getAttribute('name');
    if (flags[code]) {
        imgEl.src = flags[code].file;
        imgEl.alt = `Bandeira ${code}`;
        nameEl.textContent = flags[code].name;
    }
}

// ─── Busca Taxas da API (com cache e reserva) ────────────────────────────────
async function fetchRates(fromCode) {
    if (!fromCode) return null;
    const code = fromCode.trim(); // Garante que não haja espaços invisíveis

    if (ratesCache[code]) return ratesCache[code];

    const primaryUrl = `https://open.er-api.com/v6/latest/${code}`;
    const fallbackUrl = `https://api.frankfurter.app/latest?from=${code}`;

    // Tentativa 1: API Principal
    try {
        console.log("Tentando API Principal...");
        const response = await fetch(primaryUrl);
        if (response.ok) {
            const data = await response.json();
            // Pega o que estiver disponível: rates ou conversion_rates
            const rates = data.rates || data.conversion_rates;
            if (rates) {
                rates[code] = 1;
                ratesCache[code] = rates;
                console.log("Sucesso: API Principal");
                return rates;
            }
        }
    } catch (e) {
        console.warn("API Principal falhou.");
    }

    // Tentativa 2: API Reserva
    try {
        console.log("Tentando API Reserva...");
        const response = await fetch(fallbackUrl);
        if (response.ok) {
            const data = await response.json();
            const rates = data.rates || data.conversion_rates;
            if (rates) {
                rates[code] = 1;
                ratesCache[code] = rates;
                console.log("Sucesso: API Reserva");
                return rates;
            }
        }
    } catch (e) {
        console.error("API Reserva falhou.");
    }

    return null;
}

// ─── Conversão Principal ─────────────────────────────────────────────────────
async function convertValues() {
    const optFrom = fromCurrency.options[fromCurrency.selectedIndex];
    const optTo = toCurrency.options[toCurrency.selectedIndex];

    const nameFrom = optFrom.getAttribute('name');
    const nameTo = optTo.getAttribute('name');
    const langFrom = optFrom.getAttribute('lang');
    const langTo = optTo.getAttribute('lang');

    const amountValue = parseFloat(amount.value);

    if (isNaN(amountValue) || amountValue <= 0) {
        alert('Por favor, insira um valor válido.');
        return;
    }

    // Busca as taxas
    const rates = await fetchRates(nameFrom);

    if (!rates) {
        alert('Não foi possível obter as taxas de câmbio. Verifique sua conexão.');
        return;
    }

    const exchangeRate = rates[nameTo];
    if (exchangeRate === undefined) {
        alert('Taxa de câmbio não disponível para esta moeda.');
        return;
    }

    const resultValue = amountValue * exchangeRate;

    currentRateEl.innerHTML = new Intl.NumberFormat(`${langFrom}`, { style: 'currency', currency: `${nameFrom}` }).format(amountValue);
    targetRateEl.innerHTML = new Intl.NumberFormat(`${langTo}`, { style: 'currency', currency: `${nameTo}` }).format(resultValue);
}

// ─── Trocar Moedas ────────────────────────────────────────────────────────────
function swapCurrencies() {
    const codeFrom = fromCurrency.options[fromCurrency.selectedIndex].getAttribute('name');
    const codeTo = toCurrency.options[toCurrency.selectedIndex].getAttribute('name');

    for (const opt of fromCurrency.options) {
        if (opt.getAttribute('name') === codeTo) {
            opt.selected = true;
            break;
        }
    }
    for (const opt of toCurrency.options) {
        if (opt.getAttribute('name') === codeFrom) {
            opt.selected = true;
            break;
        }
    }

    updateFlag(fromCurrency, fromFlagImg, fromNameEl);
    updateFlag(toCurrency, toFlagImg, toNameEl);
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

// Botão de Converter
convertBtn.addEventListener('click', convertValues);

// Botão de Trocar (Swap)
swapBtn.addEventListener('click', () => {
    swapCurrencies();
    convertValues(); // Converte logo após trocar
});

// Mudança no select "De"
fromCurrency.addEventListener('change', () => {
    updateFlag(fromCurrency, fromFlagImg, fromNameEl);
    convertValues(); // Converte automaticamente ao mudar a moeda
});

// Mudança no select "Para"
toCurrency.addEventListener('change', () => {
    updateFlag(toCurrency, toFlagImg, toNameEl);
    convertValues(); // Converte automaticamente ao mudar a moeda
});

// ─── Inicialização ────────────────────────────────────────────
updateFlag(fromCurrency, fromFlagImg, fromNameEl);
updateFlag(toCurrency, toFlagImg, toNameEl);