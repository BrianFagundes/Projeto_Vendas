document.addEventListener('DOMContentLoaded', function () {
    const carrinhoContainer = document.getElementById('carrinhoContainer');

    // Recupere os produtos do carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));

    if (carrinho && carrinho.length > 0) {
        carrinho.forEach(function (produto) {
            // Crie um elemento para exibir as informações do produto no carrinho
            const produtoDiv = document.createElement('div');
            produtoDiv.className = 'produto-no-carrinho';

            // Preencha o elemento com os detalhes do produto
            produtoDiv.innerHTML = `
                <h2>${produto.Produto}</h2>
                <img src="${produto.Foto}" alt="${produto.Produto}">
                <p>Preço: R$ ${parseFloat(produto.PRECO).toFixed(2)}</p>
                <!-- Adicione outros detalhes do produto, se necessário -->
            `;

            // Adicione o elemento do produto ao carrinhoContainer
            carrinhoContainer.appendChild(produtoDiv);
        });
    } else {
        // Caso o carrinho esteja vazio, exiba uma mensagem informando que o carrinho está vazio
        carrinhoContainer.innerHTML = '<p>O seu carrinho está vazio.</p>';
    }
});
