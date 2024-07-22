async function getProducts() {
    console.log('--DB RUN---------------------------------------');
    let url = await fetch('https://dummyjson.com/products')
    let res = await url.json()
    return res.products;
}


module.exports = getProducts
