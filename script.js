document.addEventListener('DOMContentLoaded', (event) => {
    fetchExchangeRates();
    updateTime();
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', toggleTheme)
});

async function fetchExchangeRates() {
    const apiKey = 'f8ff6484f2bee648997b9965'; // Replace with your actual API key
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/AOA`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.result === 'error') {
            throw new Error(data['error-type']);
        }
        populateExchangeRates(data.conversion_rates);
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        alert('Failed to fetch exchange rates. Please try again later.');
    }
}

function populateExchangeRates(rates) {
    const exchangeRates = [
        { currency: 'EUR', rate: rates['EUR'], compra: rates['EUR'] * 0.98, venda: rates['EUR'] * 1.02 },
        { currency: 'USD', rate: rates['USD'], compra: rates['USD'] * 0.98, venda: rates['USD'] * 1.02 },
        { currency: 'CAD', rate: rates['CAD'], compra: rates['CAD'] * 0.98, venda: rates['CAD'] * 1.02 },
        { currency: 'CHF', rate: rates['CHF'], compra: rates['CHF'] * 0.98, venda: rates['CHF'] * 1.02 },
        { currency: 'CNY', rate: rates['CNY'], compra: rates['CNY'] * 0.98, venda: rates['CNY'] * 1.02 },
        { currency: 'DKK', rate: rates['DKK'], compra: rates['DKK'] * 0.98, venda: rates['DKK'] * 1.02 },
        { currency: 'GBP', rate: rates['GBP'], compra: rates['GBP'] * 0.98, venda: rates['GBP'] * 1.02 },
        { currency: 'JPY', rate: rates['JPY'], compra: rates['JPY'] * 0.98, venda: rates['JPY'] * 1.02 }
    ];

    const ratesTableBody = document.getElementById('exchangeRates');
    ratesTableBody.innerHTML = ''; // Clear any existing rows


    exchangeRates.forEach(rate => {
        const compraDivisas = (1 / (rate.rate * 0.98)).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
        const vendaDivisas = (1 / rate.rate).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
        const compraNotas = (1 / rate.rate).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
        const vendaNotas = (1 / (rate.rate * 1.02)).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="https://flagcdn.com/16x12/${rate.currency.slice(0, 2).toLowerCase()}.png" alt="${rate.currency}" class="me-2">
                1 ${rate.currency} <br> ${rate.currency === 'EUR' ? 'Euro' : rate.currency === 'USD' ? 'Dólar dos Estados Unidos' : ''}
            </td>
            <td>${compraDivisas}</td>
            <td>${vendaDivisas}</td>
            <td>${compraNotas}</td>
            <td>${vendaNotas}</td>
        `;
        ratesTableBody.appendChild(row);
    });
}

function updateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleDateString('pt-PT', options).replace(',', ' às');
    document.getElementById('update-time').innerText = `Taxas de Câmbio atualizadas a ${formattedTime}`;
}
async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value.replace(',', '.')); // Convert comma to dot for consistency
    const baseCurrency = document.getElementById('currency').value;
    const apiKey = 'f8ff6484f2bee648997b9965'; // Replace with your actual API key
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.result === 'error') {
            throw new Error(data['error-type']);
        }
        const conversionRate = data.conversion_rates['AOA'];

        if (!conversionRate) {
            alert('Conversion rate not available');
            return;
        }

        // Clear previous conversion results
        const resultTableBody = document.getElementById('conversionResult');
        resultTableBody.innerHTML = '';

        // Calculate conversion
        const convertedAmount = (amount * conversionRate).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="https://flagcdn.com/16x12/ao.png" alt="AOA" class="me-2">
                AOA <br> Kwanza
            </td>
            <td class="divisas">${convertedAmount}</td>
            <td class="notas">${convertedAmount}</td>
        `;
        resultTableBody.appendChild(row);

        const row2 = document.createElement('tr');
        row2.innerHTML = `
            <td></td>
            <td class="divisas">1 ${baseCurrency} = ${conversionRate.toLocaleString('pt-PT', { minimumFractionDigits: 6 })}</td>
            <td class="notas">1 ${baseCurrency} = ${conversionRate.toLocaleString('pt-PT', { minimumFractionDigits: 6 })}</td>
        `;
        resultTableBody.appendChild(row2);

    } catch (error) {
        console.error('Error converting currency:', error);
        alert('Failed to convert currency. Please try again later.');
    }
}
function toggleTheme() {
    const body = document.getElementById('body');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.nextElementSibling.querySelector('i');

    if (body.classList.contains('bg-light')) {
        body.classList.remove('bg-light');
        body.classList.add('bg-dark', 'text-white');
        themeIcon.classList.remove('bi-brightness-high-fill');
        themeIcon.classList.add('bi-moon-fill');
    } else {
        body.classList.remove('bg-dark', 'text-white');
        body.classList.add('bg-light');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-brightness-high-fill');
    }
}





// function toggleTheme() {
//     const body = document.getElementById('body');
//     const themeToggle = document.getElementById('theme-toggle');

//     if (body.classList.contains('bg-light')) {
//         body.classList.remove('bg-light');
//         body.classList.add('bg-dark', 'text-white');
//         themeToggle.textContent = 'Switch to Light Mode';
//     } else {
//         body.classList.remove('bg-dark', 'text-white');
//         body.classList.add('bg-light');
//         themeToggle.textContent = 'Switch to Dark Mode';
//     }
// }
// async function convertCurrency() {
//     const amount = parseFloat(document.getElementById('amount').value.replace(',', '.')); // Convert comma to dot for consistency
//     const baseCurrency = document.getElementById('currency').value;
//     const apiKey = 'f8ff6484f2bee648997b9965'; // Replace with your actual API key
//     const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

//     if (isNaN(amount) || amount <= 0) {
//         alert('Please enter a valid amount');
//         return;
//     }

//     try {
//         const response = await fetch(apiUrl);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         if (data.result === 'error') {
//             throw new Error(data['error-type']);
//         }
//         const conversionRates = data.conversion_rates;

//         // Clear previous conversion results
//         const resultTableBody = document.getElementById('conversionResult');
//         resultTableBody.innerHTML = '';

//         // Loop through each currency and calculate conversion
//         for (const currency in conversionRates) {
//             if (currency !== baseCurrency) {
//                 const conversionRate = conversionRates[currency];
//                 const convertedAmount = (amount * conversionRate).toLocaleString('pt-PT', { minimumFractionDigits: 6 });
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>
//                         <img src="https://flagcdn.com/16x12/${currency.slice(0, 2).toLowerCase()}.png" alt="${currency}" class="me-2">
//                         ${currency} <br> ${currency === 'EUR' ? 'Euro' : currency === 'USD' ? 'Dólar dos Estados Unidos' : ''}
//                     </td>
//                     <td class="divisas">${convertedAmount}</td>
//                     <td class="notas">1 ${baseCurrency} = ${conversionRate.toLocaleString('pt-PT', { minimumFractionDigits: 6 })}</td>
//                 `;
//                 resultTableBody.appendChild(row);
//             }
//         }
//     } catch (error) {
//         console.error('Error converting currency:', error);
//         alert('Failed to convert currency. Please try again later.');
//     }
// }
