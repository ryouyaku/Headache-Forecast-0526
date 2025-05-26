/**
 * 頭痛予報 Application - GAS対応版
 * Main application initialization and event handling
 * Enhanced with better error handling and user experience
 */

// Set to true to enable debug panel
const DEBUG_MODE = false;

// GAS Web App URL - 実際のURL に変更してください
// GASでWebアプリをデプロイした後に取得できるURLを設定
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Application state
let appState = {
    initialized: false,
    currentLocation: null,
    lastSearchResults: null,
    isLoading: false,
    hasError: false
};

/**
 * Debug logging function - only logs when debug mode is enabled
 * @param {string} message - Message to log
 * @param {*} data - Optional data to log
 */
function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        console.log(`[HeadacheApp] ${message}`, data || '');
        
        const logElement = document.getElementById('debug-log');
        if (logElement) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.innerHTML = `<span class="text-blue-300">[${timestamp}]</span> ${message}`;
            logElement.appendChild(logEntry);
            
            // Auto-scroll to bottom
            logElement.scrollTop = logElement.scrollHeight;
            
            // Limit log entries
            if (logElement.children.length > 100) {
                logElement.removeChild(logElement.firstChild);
            }
        }
    }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', async () => {
    debugLog("DOM loaded, initializing application");
    
    try {
        // Show debug panel in debug mode
        if (DEBUG_MODE) {
            const debugPanel = document.getElementById('debug-panel');
            if (debugPanel) {
                debugPanel.classList.remove('hidden');
                debugLog("Debug panel enabled");
            }
        }
        
        // Initialize LIFF (non-blocking)
        initializeLiff().catch(error => {
            debugLog(`LIFF initialization failed: ${error.message}`);
        });
        
        // Populate prefecture dropdown
        await populatePrefectures();
        
        // Add event listeners
        setupEventListeners();
        
        // Add location detection if available
        addLocationDetection();
        
        // Check for URL parameters to auto-search
        checkUrlParameters();
        
        // Initialize UI state
        updateSearchButtonState();
        
        appState.initialized = true;
        debugLog("Application initialized successfully");
        
    } catch (error) {
        debugLog(`Application initialization error: ${error.message}`);
        showError('アプリケーションの初期化に失敗しました。ページを再読み込みしてください。');
    }
});

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    debugLog("Setting up event listeners");
    
    try {
        // Prefecture select change event
        const prefectureSelect = document.getElementById('prefecture');
        if (prefectureSelect) {
            prefectureSelect.addEventListener('change', handlePrefectureChange);
            debugLog("Prefecture select listener added");
        }
        
        // City select change event
        const citySelect = document.getElementById('city');
        if (citySelect) {
            citySelect.addEventListener('change', handleCityChange);
            debugLog("City select listener added");
        }
        
        // Search button click event
        const searchButton = document.getElementById('search-btn');
        if (searchButton) {
            searchButton.addEventListener('click', handleSearchClick);
            debugLog("Search button listener added");
        }
        
        // Send to chat button click event
        const sendButton = document.getElementById('send-btn');
        if (sendButton) {
            sendButton.addEventListener('click', handleSendToChat);
            debugLog("Send button listener added");
        }
        
        // Refresh button (if exists)
        const refreshButton = document.getElementById('refresh-btn');
        if (refreshButton) {
            refreshButton.addEventListener('click', handleRefresh);
            debugLog("Refresh button listener added");
        }
        
        // Enter key support for search
        document.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !appState.isLoading) {
                const searchButton = document.getElementById('search-btn');
                if (searchButton && !searchButton.disabled) {
                    handleSearchClick();
                }
            }
        });
        
    } catch (error) {
        debugLog(`Error setting up event listeners: ${error.message}`);
    }
}

/**
 * Add location detection functionality
 */
function addLocationDetection() {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        debugLog("Geolocation not supported");
        return;
    }
    
    const searchSection = document.getElementById('search-section');
    if (!searchSection) return;
    
    // Find or create location detection div
    let locationDiv = document.getElementById('location-detection');
    if (!locationDiv) {
        locationDiv = document.createElement('div');
        locationDiv.id = 'location-detection';
        locationDiv.className = 'text-center pt-2';
        searchSection.appendChild(locationDiv);
    }
    
    locationDiv.innerHTML = `
        <button 
            id="location-btn" 
            class="text-blue-600 hover:text-blue-800 text-sm transition-colors duration-200 flex items-center justify-center mx-auto"
        >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            現在地から検索
        </button>
    `;
    
    // Add event listener
    const locationButton = document.getElementById('location-btn');
    if (locationButton) {
        locationButton.addEventListener('click', detectCurrentLocation);
        debugLog("Location detection button added");
    }
}

/**
 * Detect current location and set prefecture
 */
async function detectCurrentLocation() {
    debugLog("Detecting current location");
    
    const locationButton = document.getElementById('location-btn');
    
    try {
        // Update button state
        if (locationButton) {
            locationButton.disabled = true;
            locationButton.innerHTML = `
                <div class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                位置情報取得中...
            `;
        }
        
        showLoading(true, '位置情報を取得中...');
        
        // Get current location
        const location = await getCurrentLocation();
        debugLog(`Detected location: ${location}`);
        
        // Set prefecture based on detected location
        const prefecture = getPrefectureByName(location);
        if (prefecture) {
            document.getElementById('prefecture').value = prefecture.code;
            handlePrefectureChange();
            debugLog(`Prefecture set to: ${prefecture.name}`);
        } else {
            // Fallback to Tokyo
            document.getElementById('prefecture').value = '13';
            handlePrefectureChange();
            debugLog("Fallback to Tokyo");
        }
        
        // Show success message
        showTemporaryMessage(`現在地を「${location}」に設定しました`, 'success');
        
        // Auto-search after a short delay
        setTimeout(() => {
            if (!appState.isLoading) {
                handleSearchClick();
            }
        }, 1000);
        
    } catch (error) {
        debugLog(`Location detection error: ${error.message}`);
        showTemporaryMessage(error.message, 'warning');
    } finally {
        showLoading(false);
        
        // Restore button state
        if (locationButton) {
            locationButton.disabled = false;
            locationButton.innerHTML = `
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                現在地から検索
            `;
        }
    }
}

/**
 * Check URL parameters for pre-selected location
 */
function checkUrlParameters() {
    debugLog("Checking URL parameters");
    
    try {
        const params = new URLSearchParams(window.location.search);
        const city = params.get('city');
        const prefecture = params.get('prefecture');
        
        if (city) {
            debugLog(`URL parameter city found: ${city}`);
            selectMatchingLocation(city);
        } else if (prefecture) {
            debugLog(`URL parameter prefecture found: ${prefecture}`);
            selectMatchingLocation(prefecture);
        }
    } catch (error) {
        debugLog(`Error checking URL parameters: ${error.message}`);
    }
}

/**
 * Select the matching prefecture and city from parameter
 * @param {string} locationParam - Location name from parameter
 */
function selectMatchingLocation(locationParam) {
    debugLog(`Selecting location: ${locationParam}`);
    
    try {
        // Find matching prefecture
        const prefecture = getPrefectureByName(locationParam);
        if (prefecture) {
            document.getElementById('prefecture').value = prefecture.code;
            handlePrefectureChange();
            
            // Auto-search after setup
            setTimeout(() => {
                if (!appState.isLoading) {
                    handleSearchClick();
                }
            }, 500);
            
            return;
        }
        
        // Try to find as city name
        const searchResults = searchCities(locationParam);
        if (searchResults.length > 0) {
            const result = searchResults[0];
            document.getElementById('prefecture').value = result.prefecture.code;
            handlePrefectureChange();
            
            // Set city after prefecture is loaded
            setTimeout(() => {
                const citySelect = document.getElementById('city');
                for (let i = 0; i < citySelect.options.length; i++) {
                    if (citySelect.options[i].value === result.name) {
                        citySelect.selectedIndex = i;
                        break;
                    }
                }
                
                // Auto-search
                setTimeout(() => {
                    if (!appState.isLoading) {
                        handleSearchClick();
                    }
                }, 500);
            }, 100);
        }
        
    } catch (error) {
        debugLog(`Error selecting location: ${error.message}`);
    }
}

/**
 * Handle prefecture selection change
 */
function handlePrefectureChange() {
    const prefCode = document.getElementById('prefecture').value;
    const citySelect = document.getElementById('city');
    
    debugLog(`Prefecture changed: ${prefCode}`);
    
    try {
        // Reset city dropdown
        citySelect.innerHTML = '<option value="">市区町村を選択（任意）</option>';
        
        if (prefCode) {
            // Get cities for selected prefecture
            const cities = getCitiesForPrefecture(prefCode);
            debugLog(`Adding ${cities.length} cities for prefecture ${prefCode}`);
            
            // Add cities to dropdown
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.name;
                option.textContent = city.name;
                if (city.popular) {
                    option.textContent += ' ⭐';
                }
                citySelect.appendChild(option);
            });
            
            // Enable city selection
            citySelect.disabled = false;
            debugLog("City selection enabled");
        } else {
            // Disable city selection if no prefecture is selected
            citySelect.disabled = true;
            debugLog("City selection disabled");
        }
        
        // Update search button state
        updateSearchButtonState();
        
    } catch (error) {
        debugLog(`Error handling prefecture change: ${error.message}`);
    }
}

/**
 * Handle city selection change
 */
function handleCityChange() {
    const city = document.getElementById('city').value;
    debugLog(`City changed: ${city}`);
    
    // Update search button state
    updateSearchButtonState();
}

/**
 * Update search button state based on selections
 */
function updateSearchButtonState() {
    const prefecture = document.getElementById('prefecture').value;
    const searchButton = document.getElementById('search-btn');
    
    if (!searchButton) return;
    
    if (prefecture && !appState.isLoading) {
        searchButton.disabled = false;
        searchButton.classList.remove('opacity-50');
        searchButton.classList.add('hover:bg-green-600');
    } else {
        searchButton.disabled = true;
        searchButton.classList.add('opacity-50');
        searchButton.classList.remove('hover:bg-green-600');
    }
}

/**
 * Handle search button click
 */
async function handleSearchClick() {
    if (appState.isLoading) {
        debugLog("Search already in progress, ignoring click");
        return;
    }
    
    await fetchWeatherData();
}

/**
 * Handle send to chat button click
 */
async function handleSendToChat() {
    debugLog("Send to chat button clicked");
    
    try {
        await sendResultToChat();
    } catch (error) {
        debugLog(`Error sending to chat: ${error.message}`);
    }
}

/**
 * Handle refresh button click
 */
function handleRefresh() {
    debugLog("Refresh button clicked");
    location.reload();
}

/**
 * Fetch weather data and display results
 */
async function fetchWeatherData() {
    debugLog("fetchWeatherData started");
    
    const prefecture = document.getElementById('prefecture');
    const city = document.getElementById('city');
    
    if (!prefecture.value) {
        showTemporaryMessage('都道府県を選択してください', 'warning');
        debugLog("Error: No prefecture selected");
        return;
    }
    
    // Set loading state
    appState.isLoading = true;
    appState.hasError = false;
    
    // Get location (city if selected, otherwise prefecture)
    let location;
    if (city.value) {
        location = city.value;
        appState.currentLocation = { type: 'city', name: city.value, prefecture: prefecture.value };
    } else {
        const prefData = getPrefectureByCode(prefecture.value);
        location = prefData ? prefData.name : prefecture.value;
        appState.currentLocation = { type: 'prefecture', name: location, code: prefecture.value };
    }
    
    debugLog(`Location for search: ${location}`);
    
    // Show loading, hide results and errors
    showLoading(true, `${location}の天気データを取得中...`);
    hideResult();
    hideError();
    updateSearchButtonState();
    
    try {
        // Fetch weather data
        debugLog("Fetching weather data from API");
        const weatherData = await getWeatherData(location);
        
        if (!weatherData) {
            throw new Error('天気データが取得できませんでした');
        }
        
        debugLog("Weather data fetched successfully", weatherData);
        appState.lastSearchResults = weatherData;
        
        // Display weather information
        displayWeatherData(weatherData, location);
        
        // Calculate and display headache risk
        const headacheRisk = calculateHeadacheRisk(
            weatherData.currentWeather.pressure, 
            weatherData.currentWeather.weatherMain
        );
        
        displayHeadacheRisk(headacheRisk);
        
        // Show results with animation
        showResult();
        
        debugLog("Results displayed successfully");
        showTemporaryMessage('天気予報を取得しました', 'success');
        
    } catch (error) {
        debugLog(`Error occurred: ${error.message}`);
        appState.hasError = true;
        
        // Handle different error types
        let errorMessage = error.message;
        
        if (errorMessage.includes('GAS Web App URL')) {
            errorMessage = '設定エラー: アプリケーションが正しく設定されていません。管理者にお問い合わせください。';
        } else if (errorMessage.includes('ネットワーク')) {
            errorMessage = 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
        } else if (errorMessage.includes('地域名')) {
            errorMessage = '選択された地域の天気情報が見つかりません。別の地域を選択してください。';
        } else if (errorMessage.includes('タイムアウト')) {
            errorMessage = 'サーバーの応答が遅すぎます。しばらく待ってから再試行してください。';
        }
        
        document.getElementById('error-text').textContent = errorMessage;
        showError();
        
    } finally {
        showLoading(false);
        appState.isLoading = false;
        updateSearchButtonState();
    }
}

/**
 * Display weather data in the UI
 * @param {Object} weatherData - Weather data from API
 * @param {string} location - Location name
 */
function displayWeatherData(weatherData, location) {
    debugLog("Displaying weather data");
    
    try {
        // Display location
        const locationDisplay = document.getElementById('location-display');
        if (locationDisplay) {
            locationDisplay.textContent = weatherData.currentWeather.location || location;
        }
        
        // Display current weather
        const elements = {
            'current-weather': weatherData.currentWeather.weatherMain,
            'current-temp': `${weatherData.currentWeather.temperature}℃`,
            'current-humidity': `${weatherData.currentWeather.humidity}%`,
            'current-pressure': `${weatherData.currentWeather.pressure}hPa`
        };
        
        // Display forecast data
        if (weatherData.forecast.today) {
            elements['today-weather'] = weatherData.forecast.today.weather;
            elements['today-max-temp'] = `${weatherData.forecast.today.maxTemp}℃`;
            elements['today-min-temp'] = `${weatherData.forecast.today.minTemp}℃`;
            elements['today-pressure'] = `${weatherData.forecast.today.avgPressure}hPa`;
        } else {
            elements['today-weather'] = '予報なし';
            elements['today-max-temp'] = '-';
            elements['today-min-temp'] = '-';
            elements['today-pressure'] = '-';
        }
        
        if (weatherData.forecast.tomorrow) {
            elements['tomorrow-weather'] = weatherData.forecast.tomorrow.weather;
            elements['tomorrow-max-temp'] = `${weatherData.forecast.tomorrow.maxTemp}℃`;
            elements['tomorrow-min-temp'] = `${weatherData.forecast.tomorrow.minTemp}℃`;
            elements['tomorrow-pressure'] = `${weatherData.forecast.tomorrow.avgPressure}hPa`;
        } else {
            elements['tomorrow-weather'] = '予報なし';
            elements['tomorrow-max-temp'] = '-';
            elements['tomorrow-min-temp'] = '-';
            elements['tomorrow-pressure'] = '-';
        }
        
        // Update all elements
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
        
        debugLog("Weather data display completed");
        
    } catch (error) {
        debugLog(`Error displaying weather data: ${error.message}`);
    }
}

/**
 * Display headache risk information
 * @param {Object} risk - Risk calculation result
 */
function displayHeadacheRisk(risk) {
    debugLog(`Displaying risk level: ${risk.level}`);
    
    try {
        const riskIndicator = document.getElementById('risk-indicator');
        if (riskIndicator) {
            riskIndicator.className = `p-6 rounded-lg mb-6 transition-all duration-300 ${risk.class}`;
        }
        
        const riskElements = {
            'risk-icon': risk.icon,
            'risk-level': `頭痛リスク：${risk.level}`,
            'risk-forecast': risk.forecast,
            'risk-advice': risk.advice
        };
        
        Object.entries(riskElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (id === 'risk-icon') {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        debugLog("Risk display completed");
        
    } catch (error) {
        debugLog(`Error displaying risk: ${error.message}`);
    }
}

/**
 * Show temporary message to user
 * @param {string} message - Message to show
 * @param {string} type - Message type (success, warning, error)
 */
function showTemporaryMessage(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    messageDiv.textContent = message;
    
    document.body.appendChild(messageDiv);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 3000);
}

/**
 * UI display toggle functions
 */
function showLoading(show, message = '天気データを取得中...') {
    const loading = document.getElementById('loading');
    if (loading) {
        if (show) {
            loading.style.display = 'block';
            loading.classList.add('fade-in');
            
            // Update loading message if provided
            const loadingText = loading.querySelector('p');
            if (loadingText && message) {
                loadingText.textContent = message;
            }
        } else {
            loading.style.display = 'none';
            loading.classList.remove('fade-in');
        }
    }
    debugLog(`Loading display: ${show ? 'visible' : 'hidden'}`);
}

function showResult() {
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.style.display = 'block';
        resultSection.classList.add('fade-in');
        
        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    debugLog("Result section displayed");
}

function hideResult() {
    const resultSection = document.getElementById('result-section');
    if (resultSection) {
        resultSection.style.display = 'none';
        resultSection.classList.remove('fade-in');
    }
    debugLog("Result section hidden");
}

function showError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.classList.add('fade-in');
        
        // Scroll to error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    debugLog("Error message displayed");
}

function hideError() {
    const errorMessage = document.getElementById('error-message');
    if (errorMessage) {
        errorMessage.style.display = 'none';
        errorMessage.classList.remove('fade-in');
    }
    debugLog("Error message hidden");
}

/**
 * Populate prefecture dropdown with data from prefectures.js
 */
async function populatePrefectures() {
    debugLog("Populating prefecture dropdown");
    
    try {
        const prefectureSelect = document.getElementById('prefecture');
        
        if (prefectureSelect && typeof prefectures !== 'undefined') {
            prefectures.forEach(prefecture => {
                const option = document.createElement('option');
                option.value = prefecture.code;
                option.textContent = prefecture.name;
                prefectureSelect.appendChild(option);
            });
            
            debugLog(`${prefectures.length} prefectures added to dropdown`);
        } else {
            throw new Error('Prefecture data not available');
        }
        
    } catch (error) {
        debugLog(`Error populating prefectures: ${error.message}`);
        showTemporaryMessage('都道府県データの読み込みに失敗しました', 'error');
    }
}

/**
 * Get application state for debugging
 * @returns {Object} - Current application state
 */
function getAppState() {
    return { ...appState };
}

/**
 * Reset application state
 */
function resetAppState() {
    appState.currentLocation = null;
    appState.lastSearchResults = null;
    appState.isLoading = false;
    appState.hasError = false;
    
    hideResult();
    hideError();
    showLoading(false);
    
    // Reset form
    document.getElementById('prefecture').value = '';
    document.getElementById('city').innerHTML = '<option value="">市区町村を選択（任意）</option>';
    document.getElementById('city').disabled = true;
    
    updateSearchButtonState();
    debugLog("Application state reset");
}

// Global error handler
window.addEventListener('error', (event) => {
    debugLog(`Global error: ${event.error.message}`);
    console.error('Global error:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    debugLog(`Unhandled promise rejection: ${event.reason}`);
    console.error('Unhandled promise rejection:', event.reason);
});

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAppState,
        resetAppState,
        debugLog,
        GAS_WEB_APP_URL
    };
}
