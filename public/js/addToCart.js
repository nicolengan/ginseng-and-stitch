function addToCart(id, price, prod_name) {
    console.log(id, price, prod_name);
    let quantity = $(`#${id}-quantity`)[0].value;
    if (quantity == '') {
        return
    }
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