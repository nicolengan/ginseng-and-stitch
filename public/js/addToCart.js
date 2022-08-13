function test(price, prod_name) {
    console.log(price, prod_name);
    let formdata = new FormData();
    let quantity = 1;
    formdata.append('price', price);
    formdata.append('quantity', quantity);
    formdata.append('prod_name', prod_name);
    fetch('/cart/addProductToCart', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formdata)),
        headers: { 'Content-Type': 'application/json' }
    })
}