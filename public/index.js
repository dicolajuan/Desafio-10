const socket = io();

socket.on('productCatalog', (data) => render(data));

let render = (data) => {
    console.log(data.products);
    if (data.products.length > 0) {
        let table =`
        <table>
            <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Thumbnail</th>
            </tr>`;
        let html = data.products.map(e => `
            <tr>
                <td>${e.title}</td>
                <td>$ ${e.price}</td>
                <td><img src="${e.thumbnail}" width="50" height="33"></td>
            </tr>`
        ).join(' ');
        document.getElementById('table').innerHTML = table + html + `</table>`;
        document.getElementById('productCatalog').innerHTML = '';
    } else {
        let html = `<div class="error" style="padding:2em;text-align:center">No hay productos</div>`;
        document.getElementById('productCatalog').innerHTML = html;
    }
}

function createProd(form) {
    console.log("Nuevo producto agregado!");
    let newProduct = {
        title: document.getElementById('title').value,
        price: parseFloat(document.getElementById('price').value),
        thumbnail: document.getElementById('thumbnail').value
    }
    socket.emit('newProduct', newProduct)
    return false;
}