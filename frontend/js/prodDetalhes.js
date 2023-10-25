document.addEventListener('DOMContentLoaded', function () {
    const productData = JSON.parse(localStorage.getItem('productData'));

    if (productData) {
        // Preencha os elementos com os dados do produto
        document.getElementById('productImage').src = productData.Foto;
        document.getElementById('productName').textContent = productData.Produto;
        // Divide a descrição da característica em linhas separadas
        const caracteristica = productData.Caracteristica.split('\n').map(line => line.trim()).join('<br>');
        const productDescription = document.getElementById('productDescription');
        productDescription.innerHTML = caracteristica;
        
        const preco = parseFloat(productData.PRECO); // Converte a string para um número de ponto flutuante
        const precoFormatado = preco.toFixed(2); // Formata o número com duas casas decimais
        document.getElementById('productPrice').textContent = `R$ ${precoFormatado}`;

        // Torna os detalhes do produto visíveis
        productDiv.style.display = 'block';
        // ... (preencha outros elementos com os dados do produto, se necessário)
    } else {
        // Se não houver dados do produto em localStorage, exiba uma mensagem de erro ou redirecione o usuário de volta para a página anterior
        alert('Dados do produto não encontrados.');
        // Ou redirecione para a página anterior
        // window.location.href = 'pagina_anterior.html';
    }
});

// Adicione um evento de clique ao botão "Voltar"
const voltarButton = document.getElementById('voltarButton');
voltarButton.addEventListener('click', function () {
    // Volta para a página anterior
    window.history.back();
});
