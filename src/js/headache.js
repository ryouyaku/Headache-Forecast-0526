/**
 * Headache risk calculation module
 * Calculates headache risk based on weather conditions
 * Enhanced with more detailed analysis and recommendations
 */

/**
 * Calculate headache risk based on pressure and weather conditions
 * @param {number} pressure - Atmospheric pressure in hPa
 * @param {string} weather - Weather description
 * @returns {Object} - Risk assessment with detailed information
 */
function calculateHeadacheRisk(pressure, weather) {
    debugLog(`Calculating headache risk: pressure=${pressure}hPa, weather="${weather}"`);
    
    // Initialize risk assessment
    let riskScore = 0;
    let riskLevel = 'low';
    let riskText = '低い';
    let forecast = '';
    let advice = '';
    let iconEmoji = '😊';
    let riskClass = 'risk-low';
    let urgency = 'normal';
    
    // Pressure-based risk calculation
    const pressureRisk = calculatePressureRisk(pressure);
    riskScore += pressureRisk.score;
    
    // Weather-based risk calculation
    const weatherRisk = calculateWeatherRisk(weather);
    riskScore += weatherRisk.score;
    
    // Determine overall risk level
    const riskAssessment = determineRiskLevel(riskScore, pressureRisk, weatherRisk);
    
    // Generate detailed forecast and advice
    const recommendations = generateRecommendations(riskAssessment, pressure, weather);
    
    debugLog(`Risk calculation result: ${riskAssessment.level} (score: ${riskScore})`);
    
    return {
        level: riskAssessment.text,
        forecast: recommendations.forecast,
        advice: recommendations.advice,
        icon: riskAssessment.icon,
        class: riskAssessment.class,
        score: riskScore,
        urgency: riskAssessment.urgency,
        pressureInfo: pressureRisk,
        weatherInfo: weatherRisk,
        recommendations: recommendations.detailed
    };
}

/**
 * Calculate risk based on atmospheric pressure
 * @param {number} pressure - Atmospheric pressure in hPa
 * @returns {Object} - Pressure risk assessment
 */
function calculatePressureRisk(pressure) {
    let score = 0;
    let description = '';
    let impact = '';
    
    if (pressure < 980) {
        // Very low pressure - severe risk
        score = 8;
        description = '非常に低い気圧';
        impact = '頭痛が起こりやすい非常に危険な状態';
    } else if (pressure < 1000) {
        // Low pressure - high risk
        score = 6;
        description = '低い気圧';
        impact = '頭痛が起こりやすい状態';
    } else if (pressure < 1013) {
        // Slightly low pressure - medium risk
        score = 3;
        description = 'やや低い気圧';
        impact = '軽度の頭痛の可能性';
    } else if (pressure < 1020) {
        // Normal pressure - low risk
        score = 0;
        description = '標準的な気圧';
        impact = '気圧による影響は少ない';
    } else if (pressure < 1030) {
        // High pressure - very low risk
        score = -1;
        description = '高い気圧';
        impact = '気圧は安定している';
    } else {
        // Very high pressure - potential risk for some people
        score = 2;
        description = '非常に高い気圧';
        impact = '敏感な方は軽い不調の可能性';
    }
    
    return {
        score: score,
        pressure: pressure,
        description: description,
        impact: impact,
        category: getPressureCategory(pressure)
    };
}

/**
 * Calculate risk based on weather conditions
 * @param {string} weather - Weather description
 * @returns {Object} - Weather risk assessment
 */
function calculateWeatherRisk(weather) {
    let score = 0;
    let description = '';
    let impact = '';
    
    if (!weather) {
        return {
            score: 0,
            description: '不明',
            impact: '天気による影響は評価できません'
        };
    }
    
    const weatherLower = weather.toLowerCase();
    
    // High-risk weather patterns
    if (weatherLower.includes('嵐') || weatherLower.includes('雷雨') || weatherLower.includes('台風')) {
        score = 5;
        description = '激しい天候';
        impact = '急激な気圧変化により頭痛リスクが高い';
    }
    // Medium-high risk
    else if (weatherLower.includes('雨') || weatherLower.includes('雪')) {
        score = 3;
        description = '降水';
        impact = '湿度と気圧の変化により頭痛の可能性';
    }
    // Medium risk
    else if (weatherLower.includes('曇') || weatherLower.includes('くもり')) {
        score = 2;
        description = '曇天';
        impact = '気圧が不安定になりやすい';
    }
    // Low risk
    else if (weatherLower.includes('晴') || weatherLower.includes('快晴')) {
        score = 0;
        description = '晴天';
        impact = '天気による影響は少ない';
    }
    // Special conditions
    else if (weatherLower.includes('霧') || weatherLower.includes('靄')) {
        score = 2;
        description = '霧・靄';
        impact = '湿度が高く軽い不調の可能性';
    }
    else {
        score = 1;
        description = 'その他の天候';
        impact = '軽微な影響の可能性';
    }
    
    return {
        score: score,
        weather: weather,
        description: description,
        impact: impact
    };
}

/**
 * Determine overall risk level based on combined scores
 * @param {number} totalScore - Combined risk score
 * @param {Object} pressureRisk - Pressure risk data
 * @param {Object} weatherRisk - Weather risk data
 * @returns {Object} - Overall risk assessment
 */
function determineRiskLevel(totalScore, pressureRisk, weatherRisk) {
    let level, text, icon, riskClass, urgency;
    
    if (totalScore >= 8) {
        level = 'very-high';
        text = '非常に高い';
        icon = '🔴';
        riskClass = 'risk-high';
        urgency = 'urgent';
    } else if (totalScore >= 6) {
        level = 'high';
        text = '高い';
        icon = '😖';
        riskClass = 'risk-high';
        urgency = 'high';
    } else if (totalScore >= 3) {
        level = 'medium';
        text = '中程度';
        icon = '😐';
        riskClass = 'risk-medium';
        urgency = 'moderate';
    } else if (totalScore >= 1) {
        level = 'low-medium';
        text = 'やや注意';
        icon = '🙂';
        riskClass = 'risk-low';
        urgency = 'low';
    } else {
        level = 'low';
        text = '低い';
        icon = '😊';
        riskClass = 'risk-low';
        urgency = 'normal';
    }
    
    return {
        level: level,
        text: text,
        icon: icon,
        class: riskClass,
        urgency: urgency,
        score: totalScore
    };
}

/**
 * Generate detailed recommendations based on risk assessment
 * @param {Object} riskAssessment - Overall risk assessment
 * @param {number} pressure - Atmospheric pressure
 * @param {string} weather - Weather conditions
 * @returns {Object} - Detailed recommendations
 */
function generateRecommendations(riskAssessment, pressure, weather) {
    let forecast = '';
    let advice = '';
    let detailed = {};
    
    // Generate forecast
    switch (riskAssessment.urgency) {
        case 'urgent':
            forecast = '気圧が非常に低く、激しい天候により頭痛が起こりやすい危険な状態です。';
            break;
        case 'high':
            forecast = '気圧の変化と天候により、頭痛が起こりやすい状態です。';
            break;
        case 'moderate':
            forecast = '気圧や天候の影響で、軽度の頭痛や不調の可能性があります。';
            break;
        case 'low':
            forecast = '軽微な気圧の変化により、敏感な方は軽い不調を感じる可能性があります。';
            break;
        default:
            forecast = '現在の気圧と天候は安定しており、頭痛のリスクは低い状態です。';
    }
    
    // Generate advice
    switch (riskAssessment.urgency) {
        case 'urgent':
            advice = '外出を控え、室内で安静にしてください。頭痛薬を準備し、症状が現れたらすぐに服用してください。水分を多めに摂取し、首や肩のマッサージで血行を促進しましょう。';
            detailed = {
                immediate: ['外出を控える', '頭痛薬を準備', '安静にする'],
                hydration: '普段の1.5倍の水分摂取',
                activity: '激しい運動は避ける',
                medication: '予防的な頭痛薬の服用を検討',
                environment: '静かで暗い環境で休む'
            };
            break;
        case 'high':
            advice = '無理な外出や激しい運動は控えめにしましょう。こまめな水分補給と休息を心がけ、頭痛薬を携帯してください。症状を感じたら早めに対処しましょう。';
            detailed = {
                immediate: ['頭痛薬を携帯', 'こまめな休息', '無理をしない'],
                hydration: '1時間ごとに水分補給',
                activity: '軽い運動に留める',
                medication: '頭痛薬を携帯',
                environment: '温度と湿度を一定に保つ'
            };
            break;
        case 'moderate':
            advice = '疲労を溜めないよう適度な休息を取り、規則正しい水分補給を心がけましょう。ストレスを避け、リラックスして過ごしてください。';
            detailed = {
                immediate: ['適度な休息', '規則正しい生活', 'ストレス回避'],
                hydration: '定期的な水分補給',
                activity: '普段通りの活動',
                medication: '必要に応じて鎮痛剤',
                environment: '快適な室温を維持'
            };
            break;
        case 'low':
            advice = '特に心配する必要はありませんが、敏感な方は軽い運動や深呼吸でリラックスしましょう。普段通りの生活で問題ありません。';
            detailed = {
                immediate: ['普段通りの生活', '軽いストレッチ', '深呼吸'],
                hydration: '通常の水分補給',
                activity: '通常の活動レベル',
                medication: '通常通り',
                environment: '特別な配慮は不要'
            };
            break;
        default:
            advice = '現在の条件は良好です。普段通りの健康的な生活を続け、十分な睡眠と水分補給を意識してください。';
            detailed = {
                immediate: ['健康的な生活習慣', '十分な睡眠', '適度な運動'],
                hydration: '通常の水分補給',
                activity: 'あらゆる活動が可能',
                medication: '通常通り',
                environment: '快適な環境を維持'
            };
    }
    
    return {
        forecast: forecast,
        advice: advice,
        detailed: detailed
    };
}

/**
 * Get pressure category for display
 * @param {number} pressure - Atmospheric pressure in hPa
 * @returns {string} - Pressure category
 */
function getPressureCategory(pressure) {
    if (pressure < 980) return 'very-low';
    if (pressure < 1000) return 'low';
    if (pressure < 1013) return 'slightly-low';
    if (pressure < 1020) return 'normal';
    if (pressure < 1030) return 'high';
    return 'very-high';
}

/**
 * Get pressure description in Japanese
 * @param {number} pressure - Atmospheric pressure in hPa
 * @returns {string} - Japanese description
 */
function getPressureDescription(pressure) {
    const category = getPressureCategory(pressure);
    const descriptions = {
        'very-low': '非常に低い気圧',
        'low': '低い気圧',
        'slightly-low': 'やや低い気圧',
        'normal': '標準的な気圧',
        'high': '高い気圧',
        'very-high': '非常に高い気圧'
    };
    return descriptions[category] || '不明な気圧';
}

/**
 * Calculate headache risk for multiple days (for forecast display)
 * @param {Array} forecastData - Array of forecast data
 * @returns {Array} - Array of risk assessments
 */
function calculateMultiDayRisk(forecastData) {
    return forecastData.map(data => {
        if (!data || !data.avgPressure) {
            return {
                level: '不明',
                icon: '❓',
                class: 'risk-unknown'
            };
        }
        
        const risk = calculateHeadacheRisk(data.avgPressure, data.weather);
        return {
            level: risk.level,
            icon: risk.icon,
            class: risk.class,
            score: risk.score,
            date: data.date
        };
    });
}

/**
 * Get risk trend analysis
 * @param {Array} multiDayRisks - Multiple day risk assessments
 * @returns {Object} - Trend analysis
 */
function getRiskTrend(multiDayRisks) {
    if (multiDayRisks.length < 2) {
        return {
            trend: 'stable',
            message: 'トレンド分析には十分なデータがありません'
        };
    }
    
    const scores = multiDayRisks.map(risk => risk.score || 0);
    const todayScore = scores[0] || 0;
    const tomorrowScore = scores[1] || 0;
    
    const difference = tomorrowScore - todayScore;
    
    let trend, message;
    
    if (difference > 2) {
        trend = 'increasing';
        message = '明日は頭痛リスクが高くなる予想です';
    } else if (difference > 0) {
        trend = 'slightly-increasing';
        message = '明日は頭痛リスクがやや高くなる予想です';
    } else if (difference < -2) {
        trend = 'decreasing';
        message = '明日は頭痛リスクが低くなる予想です';
    } else if (difference < 0) {
        trend = 'slightly-decreasing';
        message = '明日は頭痛リスクがやや低くなる予想です';
    } else {
        trend = 'stable';
        message = '明日も今日と同程度の頭痛リスクです';
    }
    
    return {
        trend: trend,
        message: message,
        todayScore: todayScore,
        tomorrowScore: tomorrowScore,
        difference: difference
    };
}

// Export functions if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateHeadacheRisk,
        calculatePressureRisk,
        calculateWeatherRisk,
        determineRiskLevel,
        generateRecommendations,
        getPressureCategory,
        getPressureDescription,
        calculateMultiDayRisk,
        getRiskTrend
    };
}
