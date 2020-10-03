const axios = require('axios').default;
const dateFormat = require('dateformat');
const FormData = require('form-data');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const puppeteer = require('puppeteer');
 
axiosCookieJarSupport(axios);

function createRegex(keywords) {var i='';keywords.forEach(e=>{i+='(?=.*\\b'+e.toLowerCase()+'\\b)'});i += '.*$';return RegExp(i);}

class Item {
    constructor(keywords, size, color, randomSize) {
        this.size = createRegex(size);
        this.color = createRegex(color);
        this.keywords = createRegex(keywords);
        this.randomSize = randomSize;
    }
    check(regex, str) {
        return regex.test(str.toLowerCase())
    }
}

const fetch_mobile_api = {
    method: "GET",
    headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'max-age=0',
        'dnt': '1',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
    },
    url: 'http://www.supremenewyork.com/mobile_stock.json'
}

async function findProduct(product){
    var backendProduct = null;
    return new Promise((resolve, reject) => {
        axios(fetch_mobile_api)
        .then(function (response) {
            var products = response.data.products_and_categories;
            var found = false;
            while (found == false){
                Object.keys(products).forEach(function(key,index) {
                    products[key].forEach(e => {
                        if (product.check(product.keywords,e.name)){
                            backendProduct = e;
                            found = true;
                        }
                    })
                });
                found = true;
            }
        })
        .catch(async function (error) {
            console.log(error);
            var backendProduct = await findProduct(product)
            resolve(backendProduct)
        })
        .then(function () {
            resolve(backendProduct)
        });    
    })
}

async function fetchSizes(id, product){
    var fetch_sizes = {
        method: "GET",
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'max-age=0',
            'dnt': '1',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
        },
        url: 'https://www.supremenewyork.com/shop/'+id+'.json'
    }
    return new Promise((resolve, reject) => {
        var sizeId = null;
        axios(fetch_sizes)
        .then(function (response) {
            var styles = response.data.styles;
            var found = false;
            while (found == false){
                styles.forEach(e => {
                    if (product.check(product.color, e.name)){
                        var styleId = e.id;
                        var style = e;
                        var sizeRun = style.sizes.filter(size => parseInt(size.stock_level)>0);
                        style.sizes.forEach((size) => {
                            if(product.check(product.size, size.name)){
                                if(size.stock_level > 0){
                                    sizeId = [size.id,styleId];
                                    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Size Available");
                                    found = true;
                                } else if (product.randomSize && sizeRun.length > 0) {
                                    sizeId = [sizeRun[Math.floor(Math.random()*sizeRun.length)].id,styleId];
                                    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Picking Random Size");
                                    found = true;
                                } else if (product.randomSize) {
                                    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " No Sizes Available - OOS");
                                    found = true;
                                } else {
                                    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Preferred Size OOS");
                                    found = true;
                                }
                                
                            }
                        })
                    }
                })
                found = true;
            }
        })
        .catch(async function (error) {
            console.log(error);
            var sizeId = await findProduct(product)
            resolve(sizeId)
        })
        .then(function () {
            resolve(sizeId)
        });    
    })
}


async function addToCart(id, sizeId,styleId){
    var cookieJar = new tough.CookieJar();
    var formData = new FormData();
    formData.append('h', '1');
    formData.append('st', styleId);
    formData.append('s', sizeId);
    var addToCart = {
        withCredentials: true,
        jar: cookieJar,
        method: "POST",
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'max-age=0',
            'dnt': '1',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
        },
        url: 'https://www.supremenewyork.com/shop/'+id+'/add',
        data: `utf8=%E2%9C%93&h=1&st=${styleId}&s=${sizeId}`
    }
    return new Promise((resolve, reject) => {
        axios(addToCart)
        .then(function (response) {
            //console.log(response.headers['set-cookie'][0])
            if (response.data.success == true){
                console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Item added to cart - Going to checkout");
                axios({
                    withCredentials: true,
                    jar: cookieJar,
                    method: "GET",
                    headers: {
                        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'accept-encoding': 'gzip, deflate, br',
                        'accept-language': 'en-US,en;q=0.9',
                        'cache-control': 'max-age=0',
                        'dnt': '1',
                        'sec-fetch-dest': 'document',
                        'sec-fetch-mode': 'navigate',
                        'sec-fetch-site': 'cross-site',
                        'sec-fetch-user': '?1',
                        'upgrade-insecure-requests': '1',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36'
                    },
                    url: 'https://www.supremenewyork.com/checkout'
                })
                .then(function (response) {
                    if (response.status == 200){
                        console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Checkout page loaded");
                        resolve(cookieJar.getCookiesSync('https://www.supremenewyork.com/', [{secure:false}]))
                    } else { 
                        resolve()
                    }
                })
                .catch(async function (error) {
                    console.log(error);
                    resolve()
                })
                .then(function () {
                    resolve()
                })
            } else if (response.data.success == false) {
                console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Failed to add to cart");
            } else {
                console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Failed to add to cart");
            }
        })
        .catch(async function (error) {
            console.log(error);
            resolve()
        })
    })
}

async function main(){
    const browser = await puppeteer.launch({headless:false, defaultViewport:null});
    const product = new Item(
        ['Marble','Silk','Shirt'],   // Keywords
        ['Medium'],                  // Size
        ['White']                    // Color
        ,false);                     // Random size?
    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Searching for Product");
    var backendProduct = await findProduct(product);
    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Product Id: " + backendProduct.name.trim());
    var [sizeId,styleId] = await fetchSizes(backendProduct.id, product);
    console.log(dateFormat((new Date()), "[HH:MM:ss:L]") + " Size Id:",sizeId,"+ Style Id:",styleId);
    var cookies = await addToCart(backendProduct.id,sizeId,styleId);
    var parsedCookies = [];
    cookies.forEach(cookie => {
        var parsedCookie = cookie.toJSON(); 
        parsedCookies.push({
            'name': parsedCookie.key,
            'value': parsedCookie.value,
            'domain':'www.supremenewyork.com'
        })
    });
    (async () => {
        const page = await browser.newPage();
        await page.setCookie(...parsedCookies);
        await page.goto('https://www.supremenewyork.com/checkout');
        await page.evaluate(() => {
            document.querySelector('input[name="order[billing_name]"]').value = 'Thomas Jefferson';            // First name & last name
            document.querySelector('input[name="order[email]"]').value = 'tjefferson@gmail.com';               // Email
            document.querySelector('input[name="order[tel]"]').value = '434-567-7890';                         // Phone number
            document.querySelector('input[name="order[billing_address]"]').value = '931 Thomas Jefferson Pkwy' // Address 1
            document.querySelector('input[name="order[billing_address_2]"]').value = '';                       // Address 2
            document.querySelector('input[name="order[billing_zip]"]').value = '22902';                        // Zip Codcode
            document.querySelector('input[name="order[billing_city]"]').value = 'Charlottesville';             // City
            document.querySelector('select[name="order[billing_state]"]').value = 'VA';                        // State
            document.querySelector('input[placeholder="number"]').value = '4111111111111111';                  // CC number
            document.querySelector('select[name="credit_card[month]"]').value = '01';                          // CC expiry month
            document.querySelector('select[name="credit_card[year]"]').value = '2025';                         // CC expiry year
            document.querySelector('input[placeholder="CVV"]').value = '123';                                  // CVV
            document.querySelector('input[name="order[terms]"]').click();
        })
      })();
}

main()