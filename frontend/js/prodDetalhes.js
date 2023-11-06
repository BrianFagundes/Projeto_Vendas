document.addEventListener('DOMContentLoaded', function () {
    const productData = JSON.parse(localStorage.getItem('productData'));

    //Adicionar Carrinho
    const adicionarCarrinhoButton = document.getElementById('adicionarCarrinhoButton');
    adicionarCarrinhoButton.addEventListener('click', function () {
        // Obter os dados do produto
        const productData = JSON.parse(localStorage.getItem('productData'));
    
        if (productData) {
            // Adicionar o produto ao carrinho localmente (pode ser um array de objetos)
            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            let historico = JSON.parse(localStorage.getItem('historico')) || [];
    
            // Verifique se o produto já está no carrinho com base no Título
            const produtoNoCarrinho = carrinho.find(item => item.Produto === productData.Produto);
    
            if (produtoNoCarrinho) {
                // Caso o produto já esteja no carrinho, atualize a quantidade, se aplicável.
                produtoNoCarrinho.QUANTIDADE += 1;
            } else {
                // Se o produto não estiver no carrinho, adicione-o e armazene o preço original.
                productData.PRECO_ORIGINAL = productData.PRECO;
                productData.QUANTIDADE = 1; // Defina a quantidade inicial como 1.
                carrinho.push(productData);
            }
    
            // Adicione o produto ao histórico
            historico.push(productData);
    
            // Atualize o carrinho e o histórico no localStorage
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            localStorage.setItem('historico', JSON.stringify(historico));
    
            // Exibir uma mensagem de confirmação
            alert('Produto adicionado ao carrinho com sucesso!');
        } else {
            // Se não houver dados do produto em localStorage, exiba uma mensagem de erro
            alert('Dados do produto não encontrados.');
        }
    });
    
    

    // Ir para Carrinho

    const irParaCarrinhoButton = document.getElementById('irParaCarrinhoButton');
        irParaCarrinhoButton.addEventListener('click', function () {
            // Redirecionar o usuário para a página do carrinho
            window.location.href = 'http://192.168.4.5:8080/ProjetoHTML/frontend/carrinho.html'; // Substitua pelo URL da página do carrinho
    });



    if (productData) {
        // Preencha os elementos com os dados do produto
        document.getElementById('productImage').src = productData.Foto;
        document.getElementById('productName').textContent = productData.Produto;
        // Divide a descrição da característica em linhas separadas
        const caracteristica = productData.Caracteristica.split('\n').map(line => line.trim()).join('<br>');
        const productDescription = document.getElementById('productDescription');
        productDescription.innerHTML = caracteristica;
        
        document.getElementById('productEstoque').textContent = `Quantidade em estoque: ${productData.quantidade}`;

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
