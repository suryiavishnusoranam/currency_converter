// Add an event listener to the button with the ID 'convert' that listens for a 'click' event
document.getElementById('convert').addEventListener('click', function() {
    
    // Get the value of the input field with the ID 'amount'
    const amount = document.getElementById('amount').value;
    
    // Get the value of the select element with the ID 'from-currency'
    const fromCurrency = document.getElementById('from-currency').value;
    
    // Get the value of the select element with the ID 'to-currency'
    const toCurrency = document.getElementById('to-currency').value;
    
    // Define the API key (currently not used in the code)
    const apiKey = '02ca28d7c364f5fcd59df26d'; 

    // Check if the amount input is empty and show an alert if it is
    if (amount === '') {
        alert('Please enter an amount');
        return;
    }

    // Construct the URL for fetching exchange rates, using the fromCurrency value
    const url = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

    // Show a loading message while fetching data
    document.getElementById('result').innerText = 'Loading...';

    // Fetch the exchange rates data from the API
    fetch(url)
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            // Get the exchange rate for the desired toCurrency
            const rate = data.rates[toCurrency];
            
            // Check if the rate is available
            if (!rate) {
                throw new Error(`Exchange rate not found for ${toCurrency}`);
            }
            
            // Calculate the converted amount and format it to 2 decimal places
            const convertedAmount = (amount * rate).toFixed(2);
            
            // Display the converted amount in the element with the ID 'result'
            document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            
            // Add conversion history
            addConversionToHistory(amount, fromCurrency, convertedAmount, toCurrency);
            
            // Update recent conversions display
            updateRecentConversions();
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error fetching exchange rates:', error);
            // Show an alert to the user if there's an error fetching the exchange rates
            alert('Error fetching exchange rates. Please try again later.');
        });
});

// Function to add conversion to history (localStorage)
function addConversionToHistory(amount, fromCurrency, convertedAmount, toCurrency) {
    // Create or retrieve history from localStorage
    let conversionsHistory = JSON.parse(localStorage.getItem('conversionsHistory')) || [];
    
    // Add new conversion to history
    conversionsHistory.unshift({
        amount: amount,
        fromCurrency: fromCurrency,
        convertedAmount: convertedAmount,
        toCurrency: toCurrency,
        timestamp: new Date().toLocaleString() // Capture timestamp
    });

    // Store updated history back to localStorage
    localStorage.setItem('conversionsHistory', JSON.stringify(conversionsHistory));
}

// Function to update recent conversions display
function updateRecentConversions() {
    // Retrieve conversions history from localStorage
    const conversionsHistory = JSON.parse(localStorage.getItem('conversionsHistory')) || [];
    
    // Select the element where recent conversions will be displayed
    const recentConversionsElement = document.getElementById('recent-conversions');
    
    // Clear previous content
    recentConversionsElement.innerHTML = '<h2>Recent Conversions:</h2>';
    
    // Limit the number of recent conversions to display
    const maxRecentConversions = 5;
    const recentConversions = conversionsHistory.slice(0, maxRecentConversions);
    
    // Iterate through recent conversions and display each one
    recentConversions.forEach((conversion, index) => {
        const conversionElement = document.createElement('p');
        conversionElement.textContent = `${index + 1}. ${conversion.amount} ${conversion.fromCurrency} = ${conversion.convertedAmount} ${conversion.toCurrency} (${conversion.timestamp})`;
        recentConversionsElement.appendChild(conversionElement);
    });
}

// Function to initialize the application
function initializeApp() {
    // Update recent conversions display on page load
    updateRecentConversions();
}

// Call initializeApp function on page load
initializeApp();
