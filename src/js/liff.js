/**
 * LINE LIFF integration module
 * Handles LINE Front-end Framework initialization and messaging
 * Enhanced with better error handling and flexible message formatting
 */

// Replace with your actual LIFF ID from LINE Developers Console
// LIFF IDを実際のIDに変更してください
const LIFF_ID = "your-liff-id-here";

// LIFF configuration
const LIFF_CONFIG = {
    withLoginOnExternalBrowser: true,
    initTimeout: 10000, // 10 seconds timeout for initialization
    messageTimeout: 15000 // 15 seconds timeout for sending messages
};

// LIFF state
let liffState = {
    initialized: false,
    isInClient: false,
    isLoggedIn: false,
    error: null,
    userProfile: null
};

/**
 * Initialize LIFF with enhanced error handling
 * @returns {Promise<boolean>} - True if initialization successful
 */
async function initializeLiff() {
    debugLog("Initializing LIFF...");
    
    // Check if LIFF SDK is loaded
    if (typeof liff === 'undefined') {
        const error = 'LIFF SDKが読み込まれていません';
        debugLog(error);
        liffState.error = error;
        handleLiffUnavailable();
        return false;
    }
    
    // Check if LIFF ID is configured
    if (!LIFF_ID || LIFF_ID === 'your-liff-id-here') {
        const error = 'LIFF IDが設定されていません。src/js/liff.jsでLIFF_IDを設定してください。';
        debugLog(error);
        liffState.error = error;
        handleLiffUnavailable();
        return false;
    }
    
    try {
        // Initialize LIFF with timeout
        debugLog(`Initializing LIFF with ID: ${LIFF_ID}`);
        
        const initPromise = liff.init({
            liffId: LIFF_ID,
            withLoginOnExternalBrowser: LIFF_CONFIG.withLoginOnExternalBrowser
        });
        
        // Add timeout to LIFF initialization
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('LIFF初期化がタイムアウトしました')), LIFF_CONFIG.initTimeout);
        });
        
        await Promise.race([initPromise, timeoutPromise]);
        
        // Update LIFF state
        liffState.initialized = true;
        liffState.isInClient = liff.isInClient();
        liffState.isLoggedIn = liff.isLoggedIn();
        
        debugLog("LIFF initialized successfully");
        debugLog(`Is in LINE client: ${liffState.isInClient}`);
        debugLog(`Is logged in: ${liffState.isLoggedIn}`);
        
        // Get user profile if logged in
        if (liffState.isLoggedIn) {
            try {
                liffState.userProfile = await liff.getProfile();
                debugLog(`User profile: ${liffState.userProfile.displayName}`);
            } catch (error) {
                debugLog(`Failed to get user profile: ${error.message}`);
            }
        }
        
        // Update UI based on LIFF state
        updateUIForLiffState();
        
        return true;
        
    } catch (error) {
        const errorMessage = `LIFF初期化エラー: ${error.message}`;
        debugLog(errorMessage);
        liffState.error = errorMessage;
        
        // Handle specific error cases
        if (error.message.includes('Invalid LIFF ID')) {
            liffState.error = 'LIFF IDが無効です。LINE Developers Consoleで正しいIDを確認してください。';
        } else if (error.message.includes('network')) {
            liffState.error = 'ネットワーク接続に問題があります。';
        }
        
        handleLiffUnavailable();
        return false;
    }
}

/**
 * Update UI elements based on LIFF state
 */
function updateUIForLiffState() {
    const sendButton = document.getElementById('send-btn');
    
    if (!sendButton) return;
    
    if (liffState.initialized && liffState.isInClient) {
        // LIFF is available and running in LINE
        sendButton.style.display = 'flex';
        sendButton.disabled = false;
        sendButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
            </svg>
            チャットに送信する
        `;
    } else if (liffState.initialized && !liffState.isInClient) {
        // LIFF is available but running in external browser
        sendButton.style.display = 'flex';
        sendButton.disabled = true;
        sendButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            LINE内でのみ利用可能
        `;
    } else {
        // LIFF is not available
        sendButton.style.display = 'none';
    }
}

/**
 * Handle LIFF unavailable scenario
 */
function handleLiffUnavailable() {
    debugLog("LIFF is unavailable, hiding LINE-specific features");
    
    const sendButton = document.getElementById('send-btn');
    if (sendButton) {
        sendButton.style.display = 'none';
    }
    
    // Show informational message if not in LINE
    if (typeof liff !== 'undefined' && !liff.isInClient()) {
        showLiffInfo();
    }
}

/**
 * Show LIFF information message
 */
function showLiffInfo() {
    // Only show once per session
    if (sessionStorage.getItem('liff-info-shown')) return;
    
    const infoMessage = document.createElement('div');
    infoMessage.className = 'fixed bottom-4 left-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg z-50 max-w-md mx-auto';
    infoMessage.innerHTML = `
        <div class="flex items-start">
            <svg class="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1">
                <p class="text-sm font-medium">LINEで利用するとより便利です</p>
                <p class="text-xs mt-1">チャット送信機能を使用するには、LINEアプリでこのページを開いてください。</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-blue-500 hover:text-blue-700">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(infoMessage);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (infoMessage.parentNode) {
            infoMessage.remove();
        }
    }, 10000);
    
    sessionStorage.setItem('liff-info-shown', 'true');
}

/**
 * Send results to LINE chat with enhanced formatting
 */
async function sendResultToChat() {
    debugLog("Attempting to send results to chat");
    
    // Validate LIFF availability
    if (!liffState.initialized) {
        alert("LIFFが初期化されていません。ページを再読み込みしてください。");
        debugLog("LIFF not initialized, cannot send message");
        return;
    }
    
    if (!liffState.isInClient) {
        alert("この機能はLINE内でのみご利用いただけます。");
        debugLog("Not in LINE client, cannot send to chat");
        return;
    }
    
    try {
        // Get current display data
        const messageData = collectMessageData();
        if (!messageData) {
            alert("送信するデータがありません。まず天気予報を取得してください。");
            return;
        }
        
        // Create enhanced Flex Message
        const flexMessage = createFlexMessage(messageData);
        
        debugLog("Sending message to chat...");
        
        // Send message with timeout
        const sendPromise = liff.sendMessages([flexMessage]);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('メッセージ送信がタイムアウトしました')), LIFF_CONFIG.messageTimeout);
        });
        
        await Promise.race([sendPromise, timeoutPromise]);
        
        // Success feedback
        showSendSuccess();
        debugLog("Message sent to chat successfully");
        
    } catch (error) {
        debugLog(`Error sending message: ${error.message}`);
        
        let errorMessage = "送信に失敗しました。";
        
        if (error.message.includes('タイムアウト')) {
            errorMessage = "送信に時間がかかりすぎています。もう一度お試しください。";
        } else if (error.message.includes('network')) {
            errorMessage = "ネットワーク接続に問題があります。接続を確認してください。";
        } else if (error.message.includes('permission')) {
            errorMessage = "メッセージ送信の権限がありません。アプリの設定を確認してください。";
        }
        
        alert(errorMessage);
    }
}

/**
 * Collect data for message from DOM elements
 * @returns {Object|null} - Message data or null if not available
 */
function collectMessageData() {
    try {
        // Check if results are displayed
        const resultSection = document.getElementById('result-section');
        if (!resultSection || resultSection.style.display === 'none') {
            return null;
        }
        
        return {
            location: document.getElementById('location-display')?.textContent || '不明',
            riskLevel: document.getElementById('risk-level')?.textContent || '不明',
            riskForecast: document.getElementById('risk-forecast')?.textContent || '',
            riskAdvice: document.getElementById('risk-advice')?.textContent || '',
            currentWeather: document.getElementById('current-weather')?.textContent || '不明',
            currentTemp: document.getElementById('current-temp')?.textContent || '不明',
            currentHumidity: document.getElementById('current-humidity')?.textContent || '不明',
            currentPressure: document.getElementById('current-pressure')?.textContent || '不明',
            todayWeather: document.getElementById('today-weather')?.textContent || '不明',
            todayMaxTemp: document.getElementById('today-max-temp')?.textContent || '不明',
            todayMinTemp: document.getElementById('today-min-temp')?.textContent || '不明',
            todayPressure: document.getElementById('today-pressure')?.textContent || '不明',
            tomorrowWeather: document.getElementById('tomorrow-weather')?.textContent || '不明',
            tomorrowMaxTemp: document.getElementById('tomorrow-max-temp')?.textContent || '不明',
            tomorrowMinTemp: document.getElementById('tomorrow-min-temp')?.textContent || '不明',
            tomorrowPressure: document.getElementById('tomorrow-pressure')?.textContent || '不明'
        };
    } catch (error) {
        debugLog(`Error collecting message data: ${error.message}`);
        return null;
    }
}

/**
 * Create enhanced Flex Message
 * @param {Object} data - Message data
 * @returns {Object} - Flex message object
 */
function createFlexMessage(data) {
    // Determine colors based on risk level
    const riskColors = getRiskColors(data.riskLevel);
    
    // Get current timestamp
    const now = new Date();
    const timeString = now.toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return {
        type: "flex",
        altText: `${data.location}の頭痛予報 - ${data.riskLevel}`,
        contents: {
            type: "bubble",
            size: "kilo",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "🌤️ 頭痛予報",
                                weight: "bold",
                                color: "#1F76DC",
                                size: "xl",
                                flex: 1
                            },
                            {
                                type: "text",
                                text: timeString,
                                size: "xs",
                                color: "#888888",
                                align: "end"
                            }
                        ]
                    }
                ],
                backgroundColor: "#F0F8FF",
                paddingAll: "15px"
            },
            hero: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: data.location,
                        weight: "bold",
                        size: "xl",
                        margin: "md",
                        align: "center"
                    },
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: getRiskIcon(data.riskLevel),
                                size: "3xl",
                                align: "center",
                                flex: 1
                            },
                            {
                                type: "box",
                                layout: "vertical",
                                contents: [
                                    {
                                        type: "text",
                                        text: data.riskLevel,
                                        size: "xl",
                                        color: riskColors.main,
                                        weight: "bold",
                                        align: "center"
                                    },
                                    {
                                        type: "text",
                                        text: data.riskForecast,
                                        size: "sm",
                                        color: "#666666",
                                        wrap: true,
                                        align: "center",
                                        margin: "sm"
                                    }
                                ],
                                flex: 2
                            }
                        ],
                        margin: "md"
                    }
                ],
                backgroundColor: riskColors.background,
                paddingAll: "15px"
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    // Current weather section
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "text",
                                text: "📍 現在の天気",
                                weight: "bold",
                                size: "md",
                                color: "#333333"
                            },
                            {
                                type: "separator",
                                margin: "sm"
                            },
                            {
                                type: "box",
                                layout: "vertical",
                                margin: "sm",
                                spacing: "sm",
                                contents: [
                                    createDataRow("天気", data.currentWeather),
                                    createDataRow("気温", data.currentTemp),
                                    createDataRow("湿度", data.currentHumidity),
                                    createDataRow("気圧", data.currentPressure, "#DC2626")
                                ]
                            }
                        ]
                    },
                    // Forecast section
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        contents: [
                            {
                                type: "text",
                                text: "📅 予報",
                                weight: "bold",
                                size: "md",
                                color: "#333333"
                            },
                            {
                                type: "separator",
                                margin: "sm"
                            },
                            {
                                type: "box",
                                layout: "horizontal",
                                margin: "sm",
                                spacing: "md",
                                contents: [
                                    createForecastBox("今日", data.todayWeather, data.todayMaxTemp, data.todayMinTemp),
                                    createForecastBox("明日", data.tomorrowWeather, data.tomorrowMaxTemp, data.tomorrowMinTemp)
                                ]
                            }
                        ]
                    },
                    // Advice section
                    {
                        type: "box",
                        layout: "vertical",
                        margin: "lg",
                        contents: [
                            {
                                type: "text",
                                text: "💡 対処法",
                                weight: "bold",
                                size: "md",
                                color: "#333333"
                            },
                            {
                                type: "separator",
                                margin: "sm"
                            },
                            {
                                type: "text",
                                text: data.riskAdvice,
                                size: "sm",
                                color: "#555555",
                                wrap: true,
                                margin: "sm"
                            }
                        ]
                    }
                ],
                paddingAll: "15px"
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "⚠️ この予報は参考情報です。症状がある場合は医療機関にご相談ください。",
                        size: "xs",
                        color: "#888888",
                        wrap: true,
                        align: "center"
                    }
                ],
                backgroundColor: "#F8F9FA",
                paddingAll: "10px"
            }
        }
    };
}

/**
 * Create data row for Flex Message
 * @param {string} label - Label text
 * @param {string} value - Value text
 * @param {string} valueColor - Color for value (optional)
 * @returns {Object} - Flex box object
 */
function createDataRow(label, value, valueColor = "#666666") {
    return {
        type: "box",
        layout: "baseline",
        spacing: "sm",
        contents: [
            {
                type: "text",
                text: label,
                color: "#aaaaaa",
                size: "sm",
                flex: 2
            },
            {
                type: "text",
                text: value,
                wrap: true,
                color: valueColor,
                size: "sm",
                flex: 3,
                weight: "bold"
            }
        ]
    };
}

/**
 * Create forecast box for Flex Message
 * @param {string} day - Day label
 * @param {string} weather - Weather description
 * @param {string} maxTemp - Maximum temperature
 * @param {string} minTemp - Minimum temperature
 * @returns {Object} - Flex box object
 */
function createForecastBox(day, weather, maxTemp, minTemp) {
    return {
        type: "box",
        layout: "vertical",
        flex: 1,
        contents: [
            {
                type: "text",
                text: day,
                align: "center",
                weight: "bold",
                size: "sm",
                color: "#333333"
            },
            {
                type: "text",
                text: weather,
                align: "center",
                size: "xs",
                color: "#666666",
                margin: "xs"
            },
            {
                type: "text",
                text: `${maxTemp}/${minTemp}`,
                align: "center",
                size: "xs",
                color: "#888888",
                margin: "xs"
            }
        ],
        backgroundColor: "#F8F9FA",
        cornerRadius: "8px",
        paddingAll: "8px"
    };
}

/**
 * Get risk-specific colors
 * @param {string} riskLevel - Risk level text
 * @returns {Object} - Color configuration
 */
function getRiskColors(riskLevel) {
    if (riskLevel.includes("高い") || riskLevel.includes("非常に高い")) {
        return {
            main: "#EF4444",
            background: "#FEF2F2"
        };
    } else if (riskLevel.includes("中程度")) {
        return {
            main: "#F59E0B",
            background: "#FFFBEB"
        };
    } else {
        return {
            main: "#10B981",
            background: "#F0FDF4"
        };
    }
}

/**
 * Get risk-specific icon
 * @param {string} riskLevel - Risk level text
 * @returns {string} - Emoji icon
 */
function getRiskIcon(riskLevel) {
    if (riskLevel.includes("高い") || riskLevel.includes("非常に高い")) {
        return "😖";
    } else if (riskLevel.includes("中程度")) {
        return "😐";
    } else {
        return "😊";
    }
}

/**
 * Show success message after sending
 */
function showSendSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
    successMessage.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        頭痛予報をチャットに送信しました
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => successMessage.remove(), 300);
        }
    }, 3000);
}

/**
 * Get LIFF state for debugging
 * @returns {Object} - Current LIFF state
 */
function getLiffState() {
    return { ...liffState };
}

/**
 * Test LIFF functionality
 * @returns {Promise<Object>} - Test results
 */
async function testLiffFunctionality() {
    const results = {
        sdkLoaded: typeof liff !== 'undefined',
        idConfigured: LIFF_ID !== 'your-liff-id-here',
        initialized: liffState.initialized,
        inClient: liffState.isInClient,
        loggedIn: liffState.isLoggedIn,
        error: liffState.error
    };
    
    if (results.sdkLoaded && results.idConfigured && !results.initialized) {
        try {
            results.canInitialize = await initializeLiff();
        } catch (error) {
            results.initError = error.message;
        }
    }
    
    return results;
}

// Export functions if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeLiff,
        sendResultToChat,
        getLiffState,
        testLiffFunctionality,
        LIFF_ID
    };
}
