/**
 * 頭痛予報 Application - GAS対応版
 * Main application initialization and event handling
 */

// Set to true to enable debug panel
const DEBUG_MODE = false;

// GAS Web App URL - 実際のURL に変更してください
// GASでWebアプリをデプロイした後に取得できるURLを設定
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyPIjg-fPB_BYQ3sSn6-HHgvQoMcZJXoFdEj8zZg01DRyOujtKYZOGKo5nzc6I5dt7w/exec';

/**
 * Debug logging function - only logs when debug mode is enabled
 * @param {string} message - Message to log
 */
function debugLog(message) {
  if (DEBUG_MODE) {
    console.log(message);
    const logElement = document.getElementById('debug-log');
    if (logElement) {
      const timestamp = new Date().toLocaleTimeString();
      logElement.innerHTML += `<div>[${timestamp}] ${message}</div>`;
      
      // Auto-scroll to bottom
      logElement.scrollTop = logElement.scrollHeight;
    }
  }
}

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  debugLog("DOM loaded");
  
  // Show debug panel in debug mode
  if (DEBUG_MODE) {
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      debugPanel.classList.remove('hidden');
    }
  }
  
  // Initialize LIFF after DOM is loaded
  initializeLiff();
  
  // Populate prefecture dropdown
  populatePrefectures();
  
  // Add event listeners
  setupEventListeners();
  
  // Check for URL parameters to auto-search
  checkUrlParameters();
  
  // Add location detection option
  addLocationDetection();
});

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
  debugLog("Setting up event listeners");
  
  // Prefecture select change event
  const prefectureSelect = document.getElementById('prefecture');
  if (prefectureSelect) {
    prefectureSelect.addEventListener('change', handlePrefectureChange);
  }
  
  // City select change event
  const citySelect = document.getElementById('city');
  if (citySelect) {
    citySelect.addEventListener('change', handleCityChange);
  }
  
  // Search button click event
  const searchButton = document.getElementById('search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', fetchWeatherData);
  }
  
  // Send to chat button click event
  const sendButton = document.getElementById('send-btn');
  if (sendButton) {
    sendButton.addEventListener('click', sendResultToChat);
  }
  
  // Auto-detect location button (if added)
  const locationButton = document.getElementById('location-btn');
  if (locationButton) {
    locationButton.addEventListener('click', detectCurrentLocation);
  }
}

/**
 * Add location detection button
 */
function addLocationDetection() {
  const searchSection = document.getElementById('search-section');
  if (searchSection && navigator.geolocation) {
    const locationDiv = document.createElement('div');
    locationDiv.className = 'text-center mt-4';
    locationDiv.innerHTML = `
      <button id="location-btn" class="text-blue-600 hover:text-blue-800 text-sm">
        📍 現在地から検索
      </button>
    `;
    searchSection.appendChild(locationDiv);
    
    // Add event listener
    const locationButton = document.getElementById('location-btn');
    if (locationButton) {
      locationButton.addEventListener('click', detectCurrentLocation);
    }
  }
}

/**
 * Detect current location
 */
async function detectCurrentLocation() {
  debugLog("Detecting current location");
  
  try {
    showLoading(true);
    const location = await getCurrentLocation();
    
    // Set detected location to Tokyo (fallback)
    document.getElementById('prefecture').value = '13'; // Tokyo
    handlePrefectureChange();
    
    // Trigger search
    setTimeout(() => {
      fetchWeatherData();
    }, 500);
    
  } catch (error) {
    debugLog(`Location detection error: ${error.message}`);
    alert('位置情報の取得に失敗しました。手動で地域を選択してください。');
  } finally {
    showLoading(false);
  }
}

/**
 * Check URL parameters for pre-selected location
 */
function checkUrlParameters() {
  debugLog("Checking URL parameters");
  
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city');
  
  if (city) {
    debugLog(`URL parameter city found: ${city}`);
    selectMatchingLocation(city);
  }
}

/**
 * Select the matching prefecture and city from URL parameter
 * @param {string} cityParam - City name from URL parameter
 */
function selectMatchingLocation(cityParam) {
  debugLog(`Selecting location: ${cityParam}`);
  
  // Find matching prefecture
  for (const pref of prefectures) {
    if (cityParam.includes(pref.name)) {
      // Select the prefecture
      document.getElementById('prefecture').value = pref.code;
      handlePrefectureChange();
      
      // Find matching city
      const citySelect = document.getElementById('city');
      for (let i = 0; i < citySelect.options.length; i++) {
        if (cityParam.includes(citySelect.options[i].value) && citySelect.options[i].value !== "") {
          citySelect.selectedIndex = i;
          debugLog(`City selected: ${citySelect.options[i].value}`);
          break;
        }
      }
      
      // Trigger search
      setTimeout(() => {
        fetchWeatherData();
      }, 500);
      break;
    }
  }
}

/**
 * Handle prefecture selection change
 */
function handlePrefectureChange() {
  const prefCode = document.getElementById('prefecture').value;
  const citySelect = document.getElementById('city');
  
  debugLog(`Prefecture changed: ${prefCode}`);
  
  // Reset city dropdown
  citySelect.innerHTML = '<option value="">市区町村を選択（任意）</option>';
  
  if (prefCode) {
    // Get cities for selected prefecture
    const cities = majorCities[prefCode] || [];
    debugLog(`Adding ${cities.length} cities`);
    
    // Add cities to dropdown
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });
    
    // Enable city selection
    citySelect.disabled = false;
  } else {
    // Disable city selection if no prefecture is selected
    citySelect.disabled = true;
    debugLog("City selection disabled");
  }
}

/**
 * Handle city selection change
 */
function handleCityChange() {
  const city = document.getElementById('city').value;
  debugLog(`City changed: ${city}`);
  
  // Enable search button if location is selected
  updateSearchButtonState();
}

/**
 * Update search button state based on selections
 */
function updateSearchButtonState() {
  const prefecture = document.getElementById('prefecture').value;
  const searchButton = document.getElementById('search-btn');
  
  if (prefecture) {
    searchButton.disabled = false;
    searchButton.classList.remove('opacity-50');
  } else {
    searchButton.disabled = true;
    searchButton.classList.add('opacity-50');
  }
}

/**
 * Fetch weather data from the GAS Web App
 */
async function fetchWeatherData() {
  debugLog("fetchWeatherData started");
  
  const prefecture = document.getElementById('prefecture');
  const city = document.getElementById('city');
  
  if (!prefecture.value) {
    alert('都道府県を選択してください');
    debugLog("Error: No prefecture selected");
    return;
  }
  
  // Get location (city if selected, otherwise prefecture)
  let location;
  if (city.value) {
    location = city.value;
  } else {
    location = prefectures.find(p => p.code === prefecture.value).name;
  }
  
  debugLog(`Location for search: ${location}`);
  
  // Show loading, hide results and errors
  showLoading(true);
  hideResult();
  hideError();
  
  try {
    // Fetch weather data from GAS
    debugLog("Fetching weather data from GAS");
    
    const url = `${GAS_WEB_APP_URL}?city=${encodeURIComponent(location)}`;
    debugLog(`GAS URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    debugLog("Weather data fetched successfully");
    debugLog(`Response data: ${JSON.stringify(data)}`);
    
    if (!data.success) {
      throw new Error(data.error || '天気データの取得に失敗しました');
    }
    
    // Display location
    document.getElementById('location-display').textContent = data.currentWeather.location || location;
    
    // Display current weather
    document.getElementById('current-weather').textContent = data.currentWeather.weatherMain;
    document.getElementById('current-temp').textContent = `${data.currentWeather.temperature}℃`;
    document.getElementById('current-humidity').textContent = `${data.currentWeather.humidity}%`;
    document.getElementById('current-pressure').textContent = `${data.currentWeather.pressure}hPa`;
    
    // Display forecast
    if (data.forecast.today) {
      document.getElementById('today-weather').textContent = data.forecast.today.weather;
      document.getElementById('today-max-temp').textContent = `${data.forecast.today.maxTemp}℃`;
      document.getElementById('today-min-temp').textContent = `${data.forecast.today.minTemp}℃`;
      document.getElementById('today-pressure').textContent = `${data.forecast.today.avgPressure}hPa`;
    } else {
      document.getElementById('today-weather').textContent = '予報なし';
      document.getElementById('today-max-temp').textContent = '-';
      document.getElementById('today-min-temp').textContent = '-';
      document.getElementById('today-pressure').textContent = '-';
    }
    
    if (data.forecast.tomorrow) {
      document.getElementById('tomorrow-weather').textContent = data.forecast.tomorrow.weather;
      document.getElementById('tomorrow-max-temp').textContent = `${data.forecast.tomorrow.maxTemp}℃`;
      document.getElementById('tomorrow-min-temp').textContent = `${data.forecast.tomorrow.minTemp}℃`;
      document.getElementById('tomorrow-pressure').textContent = `${data.forecast.tomorrow.avgPressure}hPa`;
    } else {
      document.getElementById('tomorrow-weather').textContent = '予報なし';
      document.getElementById('tomorrow-max-temp').textContent = '-';
      document.getElementById('tomorrow-min-temp').textContent = '-';
      document.getElementById('tomorrow-pressure').textContent = '-';
    }
    
    // Calculate and display headache risk
    const headacheRisk = calculateHeadacheRisk(
      data.currentWeather.pressure, 
      data.currentWeather.weatherMain
    );
    
    displayHeadacheRisk(headacheRisk);
    
    // Show results
    showResult();
    debugLog("Results displayed");
    
  } catch (error) {
    debugLog(`Error occurred: ${error.message || error}`);
    
    let errorMessage = error.message;
    
    // より具体的なエラーメッセージ
    if (errorMessage.includes('Failed to fetch')) {
      errorMessage = 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
    } else if (errorMessage.includes('地域名が正しくありません')) {
      errorMessage = '選択された地域の天気情報が見つかりません。別の地域を選択してください。';
    }
    
    document.getElementById('error-text').textContent = errorMessage;
    showError();
  } finally {
    showLoading(false);
  }
}

/**
 * Display headache risk information
 * @param {Object} risk - Risk calculation result
 */
function displayHeadacheRisk(risk) {
  debugLog(`Displaying risk level: ${risk.level}`);
  
  const riskIndicator = document.getElementById('risk-indicator');
  riskIndicator.className = `p-4 rounded-lg mb-6 ${risk.class}`;
  
  document.getElementById('risk-icon').innerHTML = risk.icon;
  document.getElementById('risk-level').textContent = `頭痛リスク：${risk.level}`;
  document.getElementById('risk-forecast').textContent = risk.forecast;
  document.getElementById('risk-advice').textContent = risk.advice;
}

/**
 * UI display toggle functions
 */
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.display = show ? 'flex' : 'none';
  }
  debugLog(`Loading display: ${show ? 'visible' : 'hidden'}`);
}

function showResult() {
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.style.display = 'block';
  }
  debugLog("Result section displayed");
}

function hideResult() {
  const resultSection = document.getElementById('result-section');
  if (resultSection) {
    resultSection.style.display = 'none';
  }
  debugLog("Result section hidden");
}

function showError() {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.style.display = 'block';
  }
  debugLog("Error message displayed");
}

function hideError() {
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
  debugLog("Error message hidden");
}

/**
 * Populate prefecture dropdown with data from prefectures.js
 */
function populatePrefectures() {
  debugLog("Populating prefecture dropdown");
  
  const prefectureSelect = document.getElementById('prefecture');
  
  if (prefectureSelect) {
    prefectures.forEach(prefecture => {
      const option = document.createElement('option');
      option.value = prefecture.code;
      option.textContent = prefecture.name;
      prefectureSelect.appendChild(option);
    });
    
    debugLog(`${prefectures.length} prefectures added to dropdown`);
    
    // Initial button state
    updateSearchButtonState();
  }
}
