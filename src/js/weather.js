/**
 * Weather data fetching module
 * Handles API communication with Google Apps Script Web App
 */

/**
 * Fetch weather data from GAS Web App
 * @param {string} location - Location name (city or prefecture)
 * @returns {Promise<Object>} - Weather data including current conditions and forecast
 */
async function getWeatherData(location) {
    if (!location) {
      throw new Error('Location is required');
    }
    
    debugLog(`Fetching weather data for ${location}`);
    
    try {
      // GAS Web App URL - この値を実際のGAS Web AppのURLに変更してください
      const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyPIjg-fPB_BYQ3sSn6-HHgvQoMcZJXoFdEj8zZg01DRyOujtKYZOGKo5nzc6I5dt7w/exec';
      
      // Construct API URL
      const url = `${GAS_WEB_APP_URL}?city=${encodeURIComponent(location)}`;
      debugLog(`API URL: ${url}`);
      
      // Fetch data with proper headers for GAS
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow'
      });
      
      // Check for errors
      if (!response.ok) {
        debugLog(`API error: ${response.status} - ${response.statusText}`);
        throw new Error('サーバーとの通信に問題があります');
      }
      
      // Parse JSON response
      const data = await response.json();
      debugLog('API response received');
      debugLog(`Response: ${JSON.stringify(data)}`);
      
      // Check for API error
      if (!data.success) {
        throw new Error(data.error || '不明なエラーが発生しました');
      }
      
      // Transform data to match expected format
      const transformedData = {
        currentWeather: {
          weatherMain: data.currentWeather.weatherMain,
          temperature: data.currentWeather.temperature,
          humidity: data.currentWeather.humidity,
          pressure: data.currentWeather.pressure,
          location: data.currentWeather.location
        },
        forecast: {
          today: data.forecast.today,
          tomorrow: data.forecast.tomorrow
        }
      };
      
      debugLog('Data transformation completed');
      return transformedData;
      
    } catch (error) {
      debugLog(`Error in getWeatherData: ${error.message || error}`);
      
      // より具体的なエラーメッセージを提供
      let errorMessage = error.message;
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'ネットワーク接続に問題があります。インターネット接続を確認してください。';
      } else if (error.message.includes('地域名')) {
        errorMessage = '入力された地域名が見つかりません。都道府県名または主要都市名を正確に入力してください。';
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Test function to verify GAS Web App connection
   * @param {string} testLocation - Test location name
   */
  async function testGASConnection(testLocation = '東京都') {
    debugLog(`Testing GAS connection with: ${testLocation}`);
    
    try {
      const data = await getWeatherData(testLocation);
      debugLog('GAS connection test successful');
      console.log('Test result:', data);
      return true;
    } catch (error) {
      debugLog(`GAS connection test failed: ${error.message}`);
      console.error('Test failed:', error);
      return false;
    }
  }
  
  /**
   * Get current location using browser geolocation API (optional enhancement)
   * @returns {Promise<string>} - Location name
   */
  function getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('位置情報取得がサポートされていません'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Reverse geocoding to get location name
            // Note: This would require additional API or service
            debugLog(`Current position: ${lat}, ${lon}`);
            
            // For now, default to Tokyo if geolocation is used
            resolve('東京都');
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          debugLog(`Geolocation error: ${error.message}`);
          reject(new Error('位置情報の取得に失敗しました'));
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    });
  }
