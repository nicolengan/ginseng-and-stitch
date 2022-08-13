function test(price, prod_name, quantity) {
    console.log(price, prod_name, quantity);
    let formdata = new FormData();
    formdata.append('price', price);
    formdata.append('quantity', quantity);
    formdata.append('prod_name', prod_name);
    fetch('/cart/addProductToCart', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formdata)),
        headers: { 'Content-Type': 'application/json' }
    })
}