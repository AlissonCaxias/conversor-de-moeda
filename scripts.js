const convertBtn = document.getElementById('convert-btn');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amount = document.getElementById('amount');
const result = document.getElementById('result');

/*
const API_KEY = '58e4f061-fff1-4dec-895c-767bcac66208';
const BASE_URL = `https://apiv6.exchangerate-api.com/v6/${API_KEY}`;

// Armazena as taxas de câmbio baixadas
let ratesCache = {};

// Flags e Nomes das Moedas
const flags = {
    "BRL": { file: "./assets/flag-BRL.png", name: "Real" },
    "USD": { file: "./assets/flag-USD.png", name: "Dólar" },
    "EUR": { file: "./assets/flag-EUR.png", name: "Euro" },
    "GBP": { file: "./assets/flag-GBP.png", name: "Libra" },
    "JPY": { file: "./assets/flag-JPY.png", name: "Iene" },
    "CAD": { file: "./assets/flag-CAD.png", name: "Dólar Canadense" },
    "AUD": { file: "./assets/flag-AUD.png", name: "Dólar Australiano" },
    "CHF": { file: "./assets/flag-CHF.png", name: "Franco Suíço" },
    "CNY": { file: "./assets/flag-CNY.png", name: "Yuan Chinês" },
    "MXN": { file: "./assets/flag-MXN.png", name: "Peso Mexicano" }
};

function updateFlag(selectElement, imgElement, nameElement) {
    const selectedValue = selectElement.value;
    if (flags[selectedValue]) {
        imgElement.src = flags[selectedValue].file;
        imgElement.alt = `Imagem ${selectedValue}`;
        nameElement.textContent = flags[selectedValue].name;
    }
}

fromCurrencySelect.addEventListener("change", () => {
    updateFlag(fromCurrencySelect, document.querySelector('.box-current img'), document.querySelector('.from-currency-result'));
});

toCurrencySelect.addEventListener("change", () => {
    updateFlag(toCurrencySelect, document.querySelector('.box-target img'), document.querySelector('.to-currency-result'));
});

async function fetchRates(fromCurrency) {
    if (!ratesCache[fromCurrency]) {
        try {
            const response = await fetch(`${BASE_URL}/latest/${fromCurrency}`);
            const data = await response.json();
            if (data.result === "success" && data.conversion_rates) {
                ratesCache[fromCurrency] = data.conversion_rates;
                console.log(`Taxas para ${fromCurrency} baixadas.`);
            } else {
                console.error("API error", data);
                return null;
            }
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }
    return ratesCache[fromCurrency];
}

convertBtn.addEventListener("click", async function() {
    const from = fromCurrencySelect.value;
    const to = toCurrencySelect.value;
    const amountValue = parseFloat(amountInput.value);

    if (isNaN(amountValue) || amountValue <= 0) {
        alert("Por favor, insira um valor válido.");
        return;
    }

    const rates = await fetchRates(from);
    if (!rates) {
        alert("Não foi possível obter as taxas de câmbio. Tente novamente.");
        return;
    }

    const exchangeRate = rates[to];
    if (exchangeRate === undefined) {
        alert("Taxa de câmbio não disponível para esta conversão.");
        return;
    }

    const resultValue = amountValue * exchangeRate;

    document.getElementById('current-rate').textContent = `${from} ${amountValue.toFixed(2)}`;
    document.getElementById('target-rate').textContent = `${to} ${resultValue.toFixed(2)}`;
});

// Inicialização
updateFlag(fromCurrencySelect, document.querySelector('.box-current img'), document.querySelector('.from-currency-result'));
updateFlag(toCurrencySelect, document.querySelector('.box-target img'), document.querySelector('.to-currency-result'));

convertBtn.addEventListener("click", function() {
    /*convert();
    getExchangeRate();
    console.log("Apertei o botão");
    console.log(fromCurrency.value);
    console.log(toCurrency.value);
    console.log(amount.value);

});

function convert() {
    const fromCurrencyValue = fromCurrency.value;
    const toCurrencyValue = toCurrency.value;
    const amountValue = amount.value;

    const resultValue = amountValue * fromCurrencyValue;

    result.textContent = resultValue;
}

async function getExchangeRate() {
    const apiKey = '58e4f061-fff1-4dec-895c-767bcac66208';
    const url = `https://apiv6.exchangerate-api.com/v6/latest/${fromCurrency.value}?apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const exchangeRate = data.conversion_rates[toCurrency.value];
    return exchangeRate;
}

switch (fromCurrency.value) {
    case "BRL":
        fromCurrencyResult.textContent = "./assets/flag-BRL.png";
        break;
    case "USD":
        fromCurrencyResult.textContent = "./assets/flag-USD.png";
        break;
    case "EUR":
        fromCurrencyResult.textContent = "./assets/flag-EUR.png";
        break;
    case "GBP":
        fromCurrencyResult.textContent = "./assets/flag-GBP.png";
        break;
    case "JPY":
        fromCurrencyResult.textContent = "./assets/flag-JPY.png";
        break;
    case "CAD":
        fromCurrencyResult.textContent = "./assets/flag-CAD.png";
        break;
    case "AUD":
        fromCurrencyResult.textContent = "./assets/flag-AUD.png";
        break;
    case "CHF":
        fromCurrencyResult.textContent = "./assets/flag-CHF.png";
        break;
    case "CNY":
        fromCurrencyResult.textContent = "./assets/flag-CNY.png";
        break;
    case "MXN":
        fromCurrencyResult.textContent = "./assets/flag-MXN.png";
        break;

    default:
        break;
}

switch (toCurrency.value) {
    case "BRL":
        toCurrencyResult.textContent = "./assets/flag-BRL.png";
        break;
    case "USD":
        toCurrencyResult.textContent = "./assets/flag-USD.png";
        break;
    case "EUR":
        toCurrencyResult.textContent = "./assets/flag-EUR.png";
        break;
    case "GBP":
        toCurrencyResult.textContent = "./assets/flag-GBP.png";
        break;
    case "JPY":
        toCurrencyResult.textContent = "./assets/flag-JPY.png";
        break;
    case "CAD":
        toCurrencyResult.textContent = "./assets/flag-CAD.png";
        break;
    case "AUD":
        toCurrencyResult.textContent = "./assets/flag-AUD.png";
        break;
    case "CHF":
        toCurrencyResult.textContent = "./assets/flag-CHF.png";
        break;
    case "CNY":
        toCurrencyResult.textContent = "./assets/flag-CNY.png";
        break;
    case "MXN":
        toCurrencyResult.textContent = "./assets/flag-MXN.png";
        break;

    default:
        break;
}
*/