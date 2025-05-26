/**
 * 都道府県データ及び主要市区町村データ
 * Prefecture and major city data for Japan
 * Updated for better weather API compatibility
 */

// Prefecture data with codes
const prefectures = [
    {code: "01", name: "北海道", english: "Hokkaido"},
    {code: "02", name: "青森県", english: "Aomori"},
    {code: "03", name: "岩手県", english: "Iwate"},
    {code: "04", name: "宮城県", english: "Miyagi"},
    {code: "05", name: "秋田県", english: "Akita"},
    {code: "06", name: "山形県", english: "Yamagata"},
    {code: "07", name: "福島県", english: "Fukushima"},
    {code: "08", name: "茨城県", english: "Ibaraki"},
    {code: "09", name: "栃木県", english: "Tochigi"},
    {code: "10", name: "群馬県", english: "Gunma"},
    {code: "11", name: "埼玉県", english: "Saitama"},
    {code: "12", name: "千葉県", english: "Chiba"},
    {code: "13", name: "東京都", english: "Tokyo"},
    {code: "14", name: "神奈川県", english: "Kanagawa"},
    {code: "15", name: "新潟県", english: "Niigata"},
    {code: "16", name: "富山県", english: "Toyama"},
    {code: "17", name: "石川県", english: "Ishikawa"},
    {code: "18", name: "福井県", english: "Fukui"},
    {code: "19", name: "山梨県", english: "Yamanashi"},
    {code: "20", name: "長野県", english: "Nagano"},
    {code: "21", name: "岐阜県", english: "Gifu"},
    {code: "22", name: "静岡県", english: "Shizuoka"},
    {code: "23", name: "愛知県", english: "Aichi"},
    {code: "24", name: "三重県", english: "Mie"},
    {code: "25", name: "滋賀県", english: "Shiga"},
    {code: "26", name: "京都府", english: "Kyoto"},
    {code: "27", name: "大阪府", english: "Osaka"},
    {code: "28", name: "兵庫県", english: "Hyogo"},
    {code: "29", name: "奈良県", english: "Nara"},
    {code: "30", name: "和歌山県", english: "Wakayama"},
    {code: "31", name: "鳥取県", english: "Tottori"},
    {code: "32", name: "島根県", english: "Shimane"},
    {code: "33", name: "岡山県", english: "Okayama"},
    {code: "34", name: "広島県", english: "Hiroshima"},
    {code: "35", name: "山口県", english: "Yamaguchi"},
    {code: "36", name: "徳島県", english: "Tokushima"},
    {code: "37", name: "香川県", english: "Kagawa"},
    {code: "38", name: "愛媛県", english: "Ehime"},
    {code: "39", name: "高知県", english: "Kochi"},
    {code: "40", name: "福岡県", english: "Fukuoka"},
    {code: "41", name: "佐賀県", english: "Saga"},
    {code: "42", name: "長崎県", english: "Nagasaki"},
    {code: "43", name: "熊本県", english: "Kumamoto"},
    {code: "44", name: "大分県", english: "Oita"},
    {code: "45", name: "宮崎県", english: "Miyazaki"},
    {code: "46", name: "鹿児島県", english: "Kagoshima"},
    {code: "47", name: "沖縄県", english: "Okinawa"}
];

// Major cities for each prefecture with English names for better API compatibility
const majorCities = {
    "01": [
        {name: "札幌市", english: "Sapporo", popular: true},
        {name: "函館市", english: "Hakodate"},
        {name: "旭川市", english: "Asahikawa"},
        {name: "釧路市", english: "Kushiro"},
        {name: "帯広市", english: "Obihiro"},
        {name: "北見市", english: "Kitami"}
    ],
    "02": [
        {name: "青森市", english: "Aomori", popular: true},
        {name: "弘前市", english: "Hirosaki"},
        {name: "八戸市", english: "Hachinohe"},
        {name: "十和田市", english: "Towada"}
    ],
    "03": [
        {name: "盛岡市", english: "Morioka", popular: true},
        {name: "一関市", english: "Ichinoseki"},
        {name: "奥州市", english: "Oshu"},
        {name: "花巻市", english: "Hanamaki"}
    ],
    "04": [
        {name: "仙台市", english: "Sendai", popular: true},
        {name: "石巻市", english: "Ishinomaki"},
        {name: "大崎市", english: "Osaki"},
        {name: "登米市", english: "Tome"}
    ],
    "05": [
        {name: "秋田市", english: "Akita", popular: true},
        {name: "横手市", english: "Yokote"},
        {name: "大仙市", english: "Daisen"},
        {name: "能代市", english: "Noshiro"}
    ],
    "06": [
        {name: "山形市", english: "Yamagata", popular: true},
        {name: "酒田市", english: "Sakata"},
        {name: "鶴岡市", english: "Tsuruoka"},
        {name: "米沢市", english: "Yonezawa"}
    ],
    "07": [
        {name: "福島市", english: "Fukushima", popular: true},
        {name: "郡山市", english: "Koriyama"},
        {name: "いわき市", english: "Iwaki"},
        {name: "会津若松市", english: "Aizuwakamatsu"}
    ],
    "08": [
        {name: "水戸市", english: "Mito", popular: true},
        {name: "つくば市", english: "Tsukuba"},
        {name: "日立市", english: "Hitachi"},
        {name: "ひたちなか市", english: "Hitachinaka"}
    ],
    "09": [
        {name: "宇都宮市", english: "Utsunomiya", popular: true},
        {name: "小山市", english: "Oyama"},
        {name: "栃木市", english: "Tochigi"},
        {name: "足利市", english: "Ashikaga"}
    ],
    "10": [
        {name: "前橋市", english: "Maebashi", popular: true},
        {name: "高崎市", english: "Takasaki"},
        {name: "太田市", english: "Ota"},
        {name: "伊勢崎市", english: "Isesaki"}
    ],
    "11": [
        {name: "さいたま市", english: "Saitama", popular: true},
        {name: "川越市", english: "Kawagoe"},
        {name: "所沢市", english: "Tokorozawa"},
        {name: "越谷市", english: "Koshigaya"},
        {name: "川口市", english: "Kawaguchi"}
    ],
    "12": [
        {name: "千葉市", english: "Chiba", popular: true},
        {name: "船橋市", english: "Funabashi"},
        {name: "柏市", english: "Kashiwa"},
        {name: "松戸市", english: "Matsudo"},
        {name: "市川市", english: "Ichikawa"}
    ],
    "13": [
        {name: "新宿区", english: "Shinjuku", popular: true},
        {name: "渋谷区", english: "Shibuya"},
        {name: "港区", english: "Minato"},
        {name: "世田谷区", english: "Setagaya"},
        {name: "八王子市", english: "Hachioji"},
        {name: "町田市", english: "Machida"}
    ],
    "14": [
        {name: "横浜市", english: "Yokohama", popular: true},
        {name: "川崎市", english: "Kawasaki"},
        {name: "相模原市", english: "Sagamihara"},
        {name: "藤沢市", english: "Fujisawa"},
        {name: "横須賀市", english: "Yokosuka"}
    ],
    "15": [
        {name: "新潟市", english: "Niigata", popular: true},
        {name: "長岡市", english: "Nagaoka"},
        {name: "上越市", english: "Joetsu"},
        {name: "三条市", english: "Sanjo"}
    ],
    "16": [
        {name: "富山市", english: "Toyama", popular: true},
        {name: "高岡市", english: "Takaoka"},
        {name: "射水市", english: "Imizu"},
        {name: "魚津市", english: "Uozu"}
    ],
    "17": [
        {name: "金沢市", english: "Kanazawa", popular: true},
        {name: "白山市", english: "Hakusan"},
        {name: "小松市", english: "Komatsu"},
        {name: "加賀市", english: "Kaga"}
    ],
    "18": [
        {name: "福井市", english: "Fukui", popular: true},
        {name: "敦賀市", english: "Tsuruga"},
        {name: "越前市", english: "Echizen"},
        {name: "鯖江市", english: "Sabae"}
    ],
    "19": [
        {name: "甲府市", english: "Kofu", popular: true},
        {name: "富士吉田市", english: "Fujiyoshida"},
        {name: "南アルプス市", english: "Minami-Alps"},
        {name: "甲斐市", english: "Kai"}
    ],
    "20": [
        {name: "長野市", english: "Nagano", popular: true},
        {name: "松本市", english: "Matsumoto"},
        {name: "上田市", english: "Ueda"},
        {name: "飯田市", english: "Iida"}
    ],
    "21": [
        {name: "岐阜市", english: "Gifu", popular: true},
        {name: "大垣市", english: "Ogaki"},
        {name: "高山市", english: "Takayama"},
        {name: "多治見市", english: "Tajimi"}
    ],
    "22": [
        {name: "静岡市", english: "Shizuoka", popular: true},
        {name: "浜松市", english: "Hamamatsu"},
        {name: "沼津市", english: "Numazu"},
        {name: "富士市", english: "Fuji"}
    ],
    "23": [
        {name: "名古屋市", english: "Nagoya", popular: true},
        {name: "豊田市", english: "Toyota"},
        {name: "岡崎市", english: "Okazaki"},
        {name: "一宮市", english: "Ichinomiya"},
        {name: "豊橋市", english: "Toyohashi"}
    ],
    "24": [
        {name: "津市", english: "Tsu", popular: true},
        {name: "四日市市", english: "Yokkaichi"},
        {name: "松阪市", english: "Matsusaka"},
        {name: "桑名市", english: "Kuwana"}
    ],
    "25": [
        {name: "大津市", english: "Otsu", popular: true},
        {name: "彦根市", english: "Hikone"},
        {name: "長浜市", english: "Nagahama"},
        {name: "草津市", english: "Kusatsu"}
    ],
    "26": [
        {name: "京都市", english: "Kyoto", popular: true},
        {name: "宇治市", english: "Uji"},
        {name: "舞鶴市", english: "Maizuru"},
        {name: "福知山市", english: "Fukuchiyama"}
    ],
    "27": [
        {name: "大阪市", english: "Osaka", popular: true},
        {name: "堺市", english: "Sakai"},
        {name: "東大阪市", english: "Higashiosaka"},
        {name: "豊中市", english: "Toyonaka"},
        {name: "吹田市", english: "Suita"}
    ],
    "28": [
        {name: "神戸市", english: "Kobe", popular: true},
        {name: "姫路市", english: "Himeji"},
        {name: "西宮市", english: "Nishinomiya"},
        {name: "尼崎市", english: "Amagasaki"},
        {name: "明石市", english: "Akashi"}
    ],
    "29": [
        {name: "奈良市", english: "Nara", popular: true},
        {name: "橿原市", english: "Kashihara"},
        {name: "生駒市", english: "Ikoma"},
        {name: "大和郡山市", english: "Yamatokoriyama"}
    ],
    "30": [
        {name: "和歌山市", english: "Wakayama", popular: true},
        {name: "田辺市", english: "Tanabe"},
        {name: "新宮市", english: "Shingu"},
        {name: "橋本市", english: "Hashimoto"}
    ],
    "31": [
        {name: "鳥取市", english: "Tottori", popular: true},
        {name: "米子市", english: "Yonago"},
        {name: "倉吉市", english: "Kurayoshi"},
        {name: "境港市", english: "Sakaiminato"}
    ],
    "32": [
        {name: "松江市", english: "Matsue", popular: true},
        {name: "出雲市", english: "Izumo"},
        {name: "浜田市", english: "Hamada"},
        {name: "益田市", english: "Masuda"}
    ],
    "33": [
        {name: "岡山市", english: "Okayama", popular: true},
        {name: "倉敷市", english: "Kurashiki"},
        {name: "津山市", english: "Tsuyama"},
        {name: "総社市", english: "Soja"}
    ],
    "34": [
        {name: "広島市", english: "Hiroshima", popular: true},
        {name: "福山市", english: "Fukuyama"},
        {name: "呉市", english: "Kure"},
        {name: "尾道市", english: "Onomichi"}
    ],
    "35": [
        {name: "山口市", english: "Yamaguchi", popular: true},
        {name: "下関市", english: "Shimonoseki"},
        {name: "宇部市", english: "Ube"},
        {name: "周南市", english: "Shunan"}
    ],
    "36": [
        {name: "徳島市", english: "Tokushima", popular: true},
        {name: "鳴門市", english: "Naruto"},
        {name: "阿南市", english: "Anan"},
        {name: "吉野川市", english: "Yoshinogawa"}
    ],
    "37": [
        {name: "高松市", english: "Takamatsu", popular: true},
        {name: "丸亀市", english: "Marugame"},
        {name: "観音寺市", english: "Kanonji"},
        {name: "さぬき市", english: "Sanuki"}
    ],
    "38": [
        {name: "松山市", english: "Matsuyama", popular: true},
        {name: "今治市", english: "Imabari"},
        {name: "新居浜市", english: "Niihama"},
        {name: "西条市", english: "Saijo"}
    ],
    "39": [
        {name: "高知市", english: "Kochi", popular: true},
        {name: "南国市", english: "Nankoku"},
        {name: "四万十市", english: "Shimanto"},
        {name: "香南市", english: "Konan"}
    ],
    "40": [
        {name: "福岡市", english: "Fukuoka", popular: true},
        {name: "北九州市", english: "Kitakyushu"},
        {name: "久留米市", english: "Kurume"},
        {name: "飯塚市", english: "Iizuka"},
        {name: "大牟田市", english: "Omuta"}
    ],
    "41": [
        {name: "佐賀市", english: "Saga", popular: true},
        {name: "唐津市", english: "Karatsu"},
        {name: "鳥栖市", english: "Tosu"},
        {name: "武雄市", english: "Takeo"}
    ],
    "42": [
        {name: "長崎市", english: "Nagasaki", popular: true},
        {name: "佐世保市", english: "Sasebo"},
        {name: "諫早市", english: "Isahaya"},
        {name: "大村市", english: "Omura"}
    ],
    "43": [
        {name: "熊本市", english: "Kumamoto", popular: true},
        {name: "八代市", english: "Yatsushiro"},
        {name: "天草市", english: "Amakusa"},
        {name: "玉名市", english: "Tamana"}
    ],
    "44": [
        {name: "大分市", english: "Oita", popular: true},
        {name: "別府市", english: "Beppu"},
        {name: "中津市", english: "Nakatsu"},
        {name: "日田市", english: "Hita"}
    ],
    "45": [
        {name: "宮崎市", english: "Miyazaki", popular: true},
        {name: "都城市", english: "Miyakonojo"},
        {name: "延岡市", english: "Nobeoka"},
        {name: "日向市", english: "Hyuga"}
    ],
    "46": [
        {name: "鹿児島市", english: "Kagoshima", popular: true},
        {name: "霧島市", english: "Kirishima"},
        {name: "鹿屋市", english: "Kanoya"},
        {name: "薩摩川内市", english: "Satsumasendai"}
    ],
    "47": [
        {name: "那覇市", english: "Naha", popular: true},
        {name: "沖縄市", english: "Okinawa"},
        {name: "宮古島市", english: "Miyakojima"},
        {name: "石垣市", english: "Ishigaki"}
    ]
};

/**
 * Get prefecture by code
 * @param {string} code - Prefecture code
 * @returns {Object|null} - Prefecture object or null
 */
function getPrefectureByCode(code) {
    return prefectures.find(pref => pref.code === code) || null;
}

/**
 * Get prefecture by name
 * @param {string} name - Prefecture name
 * @returns {Object|null} - Prefecture object or null
 */
function getPrefectureByName(name) {
    return prefectures.find(pref => 
        pref.name === name || 
        pref.english.toLowerCase() === name.toLowerCase()
    ) || null;
}

/**
 * Get cities for prefecture
 * @param {string} prefCode - Prefecture code
 * @returns {Array} - Array of city objects
 */
function getCitiesForPrefecture(prefCode) {
    return majorCities[prefCode] || [];
}

/**
 * Get popular cities for prefecture
 * @param {string} prefCode - Prefecture code
 * @returns {Array} - Array of popular city objects
 */
function getPopularCitiesForPrefecture(prefCode) {
    const cities = majorCities[prefCode] || [];
    return cities.filter(city => city.popular);
}

/**
 * Search cities by name across all prefectures
 * @param {string} searchTerm - Search term
 * @returns {Array} - Array of matching cities with prefecture info
 */
function searchCities(searchTerm) {
    const results = [];
    const term = searchTerm.toLowerCase();
    
    for (const [prefCode, cities] of Object.entries(majorCities)) {
        const prefecture = getPrefectureByCode(prefCode);
        
        cities.forEach(city => {
            if (city.name.includes(searchTerm) || 
                city.english.toLowerCase().includes(term)) {
                results.push({
                    ...city,
                    prefecture: prefecture
                });
            }
        });
    }
    
    return results;
}

/**
 * Get all prefectures as options for select element
 * @returns {Array} - Array of option objects
 */
function getPrefectureOptions() {
    return prefectures.map(pref => ({
        value: pref.code,
        text: pref.name,
        english: pref.english
    }));
}

/**
 * Get weather search terms for a location
 * @param {string} location - Location name
 * @returns {Array} - Array of search terms to try
 */
function getWeatherSearchTerms(location) {
    const terms = [];
    
    // Original term
    terms.push(location);
    
    // If it's a prefecture, add main cities
    const prefecture = getPrefectureByName(location);
    if (prefecture) {
        const cities = getCitiesForPrefecture(prefecture.code);
        // Add popular cities first
        const popularCities = cities.filter(city => city.popular);
        popularCities.forEach(city => {
            terms.push(city.name);
            terms.push(city.english + ',JP');
        });
        
        // Add prefecture in English
        terms.push(prefecture.english + ',JP');
    }
    
    // Check if it's a city and add English name
    const cityResults = searchCities(location);
    if (cityResults.length > 0) {
        cityResults.forEach(result => {
            terms.push(result.english + ',JP');
            terms.push(result.name);
        });
    }
    
    // Clean up terms (remove duplicates and add Japan suffix)
    const cleanTerms = [...new Set(terms)];
    
    // Add JP suffix variants
    const withSuffix = [];
    cleanTerms.forEach(term => {
        withSuffix.push(term);
        if (!term.includes(',JP')) {
            withSuffix.push(term + ',JP');
        }
    });
    
    return [...new Set(withSuffix)];
}

// Export functions if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        prefectures,
        majorCities,
        getPrefectureByCode,
        getPrefectureByName,
        getCitiesForPrefecture,
        getPopularCitiesForPrefecture,
        searchCities,
        getPrefectureOptions,
        getWeatherSearchTerms
    };
}
