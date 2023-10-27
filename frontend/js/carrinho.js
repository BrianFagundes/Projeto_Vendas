document.addEventListener('DOMContentLoaded', function () {
    const carrinhoContainer = document.getElementById('carrinhoContainer');
    const botaoLimparCarrinho = document.getElementById('limpar-carrinho');
    const botaoFinalizar = document.getElementById('finalizar');
    const botaoAplicarDesconto = document.getElementById('aplicar-desconto');


    // Recupere os produtos do carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    let valorInicialCarrinho = calcularTotalCarrinho();

    //Função de reverter preço

    function reverterPrecoOriginal() {
        carrinho.forEach(function (produto) {
            if (produto.PRECO_ORIGINAL) {
                produto.PRECO = produto.PRECO_ORIGINAL;
            }
        });
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    }
    

    function atualizarCarrinho() {
        // Limpe o carrinhoContainer antes de atualizar a exibição
        carrinhoContainer.innerHTML = '';

        if (carrinho.length > 0) {
            let total = 0;
            carrinho.forEach(function (produto, index) {
                // Crie um elemento para exibir as informações do produto no carrinho
                const produtoDiv = document.createElement('div');
                produtoDiv.className = 'produto-no-carrinho';

                // Preencha o elemento com os detalhes do produto
                produtoDiv.innerHTML = `
                    <h2>${produto.Produto}</h2>
                    <img src="${produto.Foto}" alt="${produto.Produto}">
                    <p>Preço: R$ ${parseFloat(produto.PRECO).toFixed(2)}</p>
                    <!-- Adicione outros detalhes do produto, se necessário -->
                    <button class="remover-produto" data-produto-index="${index}">Remover</button><br><br>
                    <input type="text" id="descontoProduto-${index}" placeholder="Porcentagem ou Valor de desconto"><br><br>
                    <button class="aplicar-desconto-produto" data-produto-index="${index}">Aplicar Desconto</button><br><br>

                `;

                // Adicione o elemento do produto ao carrinhoContainer
                carrinhoContainer.appendChild(produtoDiv);

                total += parseFloat(produto.PRECO);
            });

            // Exiba o total
            carrinhoContainer.innerHTML += `<p>Total: R$ ${valorInicialCarrinho.toFixed(2)}</p>`;
            carrinhoContainer.innerHTML += `<p>Total com desconto: R$ ${total.toFixed(2)}</p>`;
            
        } else {
            // Caso o carrinho esteja vazio, exiba uma mensagem informando que o carrinho está vazio
            carrinhoContainer.innerHTML = '<p>O seu carrinho está vazio.</p>';
        }
    }

    atualizarCarrinho();

    botaoLimparCarrinho.addEventListener('click', function () {
        // Limpe o carrinho
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    });
        // Adicione o preço original ao objeto do produto
        carrinho.forEach(function (produto) {
            produto.PRECO_ORIGINAL = produto.PRECO;
        });
    

    botaoAplicarDesconto.addEventListener('click', function () {
        const desconto = document.getElementById('desconto').value;
        const valorDesconto = parseFloat(desconto);
        const carrinhoTotal = calcularTotalCarrinho();
    
        if (desconto.endsWith('%')) {
            // Desconto em porcentagem
            const percent = parseFloat(desconto) / 100;
    
            if (!isNaN(percent) && percent >= 0 && percent <= 1) {
                const descontoAplicado = carrinhoTotal * percent;
                aplicarDescontoTotal(descontoAplicado);
            } else {
                alert('Insira um desconto válido em porcentagem (0% a 100%).');
            }
        } else if (!isNaN(valorDesconto) && valorDesconto >= 0) {
            // Desconto em valor fixo
            if (valorDesconto <= carrinhoTotal) {
                aplicarDescontoTotal(valorDesconto);
            } else {
                alert('O desconto não pode ser maior que o total do carrinho.');
            }
        } else {
            alert('Insira um desconto válido em porcentagem (0% a 100%) ou um valor fixo maior ou igual a 0.');
        }
    });


    // Event listener para aplicar desconto por produto
    carrinhoContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('aplicar-desconto-produto')) {
            const index = parseInt(event.target.getAttribute('data-produto-index'));
            const inputDesconto = document.getElementById(`descontoProduto-${index}`);
            
            if (!isNaN(index) && index >= 0 && index < carrinho.length) {
                const descontoInput = inputDesconto.value;
                
                if (descontoInput.endsWith('%')) {
                    // Remova o símbolo "%" e converta a porcentagem em um número
                    const percent = parseFloat(descontoInput.replace('%', '')) / 100;
    
                    if (!isNaN(percent) && percent >= 0 && percent <= 1) {
                        // Aplicar o desconto em porcentagem ao produto
                        const precoProduto = parseFloat(carrinho[index].PRECO);
                        const descontoEmDinheiro = precoProduto * percent;
                        const novoPreco = precoProduto - descontoEmDinheiro;
    
                        if (novoPreco >= 0) {
                            carrinho[index].PRECO = novoPreco;
                            localStorage.setItem('carrinho', JSON.stringify(carrinho));
                            atualizarCarrinho();
                        } else {
                            alert('O desconto não pode ser maior que o preço do produto.');
                        }
                    } else {
                        alert('Insira uma porcentagem de desconto válida (0% a 100%).');
                    }
                } else {
                    // Caso contrário, trata como um valor de desconto fixo
                    const desconto = parseFloat(descontoInput);
    
                    if (!isNaN(desconto)) {
                        // Aplicar o desconto em valor fixo ao produto
                        const precoProduto = parseFloat(carrinho[index].PRECO);
                        const novoPreco = precoProduto - desconto;
    
                        if (novoPreco >= 0) {
                            carrinho[index].PRECO = novoPreco;
                            localStorage.setItem('carrinho', JSON.stringify(carrinho));
                            atualizarCarrinho();
                        } else {
                            alert('O desconto não pode ser maior que o preço do produto.');
                        }
                    } else {
                        alert('Insira um desconto válido em porcentagem ou valor fixo.');
                    }
                }
            }
        }
    });

    
    function calcularTotalCarrinho() {
        let total = 0;
        carrinho.forEach(function (produto) {
            const precoProduto = parseFloat(produto.PRECO);
            if (!isNaN(precoProduto)) {
                total += precoProduto;
            } else {
                alert('O preço do produto não é um número válido.');
            }
        });
        return total;
    }
    
    function aplicarDescontoTotal(desconto) {
        const carrinhoTotal = calcularTotalCarrinho();
        const novoTotal = Math.max(carrinhoTotal - desconto, 0);
    
        carrinho.forEach(function (produto) {
            produto.PRECO = parseFloat(produto.PRECO);
            if (!isNaN(produto.PRECO)) {
                // Atualiza o preço de cada produto proporcionalmente
                produto.PRECO = produto.PRECO * (novoTotal / carrinhoTotal);
            } else {
                alert('O preço do produto não é um número válido.');
            }
        });
    
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    }

    // Botão finalizar 
    botaoFinalizar.addEventListener('click', function () {
        // Limpe o carrinho
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();

        window.location.href = 'http://192.168.4.5:8080/ProjetoHTML/frontend/produto.html';
    });
    
    

    // Adicione um evento de clique ao botão "Voltar"
    const AddProdButton = document.getElementById('addmaisprodutos');
    AddProdButton.addEventListener('click', function () {
        // Volta para a página anterior
        window.location.href = 'http://192.168.4.5:8080/ProjetoHTML/frontend/produto.html';

});

// Evento de clique para reverter preço
const botaoReverterPrecos = document.getElementById('reverter-precos');
botaoReverterPrecos.addEventListener('click', function () {
    reverterPrecoOriginal();
});



    // Event listener para remover um produto do carrinho
    carrinhoContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remover-produto')) {
            const index = parseInt(event.target.getAttribute('data-produto-index'));
            
            if (!isNaN(index) && index >= 0 && index < carrinho.length) {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                atualizarCarrinho();
            }
        }
    });
});
