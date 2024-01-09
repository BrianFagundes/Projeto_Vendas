document.addEventListener('DOMContentLoaded', function () {
    const carrinhoContainer = document.getElementById('carrinhoContainer');
    const botaoLimparCarrinho = document.getElementById('limpar-carrinho');
    const botaoFinalizar = document.getElementById('finalizar');
    const botaoAplicarDesconto = document.getElementById('aplicar-desconto');


    // Recupere os produtos do carrinho do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let historico = JSON.parse(localStorage.getItem('historico')) || [];

    const botaoReverterPrecos = document.getElementById('reverter-precos');
    botaoReverterPrecos.addEventListener('click', function () {
        // Percorra o carrinho e restaure os preços originais
        carrinho.forEach(function (produto) {
            produto.PRECO = produto.PRECO_ORIGINAL;
        });

        // Atualize o carrinho e a exibição
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
    });


    function atualizarCarrinho() {
        // Limpe o carrinhoContainer antes de atualizar a exibição
        carrinhoContainer.innerHTML = '';

        if (carrinho.length > 0) {
            let total = 0;
            let totalDesconto = 0;
            carrinho.forEach(function (produto, index) {
                // Crie um elemento para exibir as informações do produto no carrinho
                const produtoDiv = document.createElement('div');
                produtoDiv.className = 'produto-no-carrinho';

                // Calcule o preço com desconto, mantendo o preço original
                const precoOriginal = parseFloat(produto.PRECO_ORIGINAL);
                const precoAtual = parseFloat(produto.PRECO);
                const desconto = precoOriginal - precoAtual;

                console.log(produto.Produto)

                // Preencha o elemento com os detalhes do produto
                produtoDiv.innerHTML = `
                    <h2>${produto.Produto}</h2>
                    <img src="${produto.Foto}" alt="${produto.Produto}">
                    <p>Preço Original: R$ ${(isNaN(precoOriginal) ? precoAtual.toFixed(2) : precoOriginal.toFixed(2))}</p>
                    <p>Desconto: R$ - ${(isNaN(desconto) ? "0.00" : desconto.toFixed(2))}</p>
                    <p>Preço com Desconto: R$ ${precoAtual.toFixed(2)}</p>
                    <!-- Adicione outros detalhes do produto, se necessário -->
                    <button class="remover-produto" data-produto-index="${index}">Remover</button><br><br>
                    <input type="text" id="descontoProduto-${index}" placeholder="Porcentagem ou Valor de desconto"><br><br>
                    <button class="aplicar-desconto-produto" data-produto-index="${index}">Aplicar Desconto</button><br><br>
                `;

                // Adicione o elemento do produto ao carrinhoContainer
                carrinhoContainer.appendChild(produtoDiv);

                total += precoAtual;
                totalDesconto += desconto;

            });

            // Verifique se totalDesconto é NaN e defina-o como 0, se necessário
            if (isNaN(totalDesconto)) {
                totalDesconto = 0;
            }


            carrinhoContainer.innerHTML += `<p>Total: R$ ${(total + totalDesconto).toFixed(2)}</p>`;
            carrinhoContainer.innerHTML += `<p>Descontos: R$ - ${totalDesconto.toFixed(2)}</p>`;
            carrinhoContainer.innerHTML += `<p>Preço final: R$ ${total.toFixed(2)}</p>`;

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
        if (!produto.PRECO_ORIGINAL) {
            produto.PRECO_ORIGINAL = produto.PRECO;
        }
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

        // Limpe o histórico
        historico = [];
        localStorage.setItem('historico', JSON.stringify(historico));
        // Limpe o carrinho
        carrinho = [];
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarCarrinho();
        window.location.href = 'http://127.0.0.1:5500/frontend/produto.html';
        //window.location.href = 'http://127.0.0.1:8080/ProjetoHTML/frontend/produto.html'; // Ambiente Prod
    });



    // Adicione um evento de clique ao botão "Voltar"
    const AddProdButton = document.getElementById('addmaisprodutos');
    AddProdButton.addEventListener('click', function () {
        // Volta para a página anterior

        window.location.href = 'http://127.0.0.1:5500/frontend/produto.html';
        //window.location.href = 'http://127.0.0.1:8080/ProjetoHTML/frontend/produto.html'; //  Ambiente de Prod

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

    // Seleciona o contêiner do histórico
    const historicoContainer = document.getElementById('historico-container');

    // Seleciona o botão de fechar do histórico
    const fecharHistoricoButton = document.getElementById('fechar-historico');

    // Função para limpar o conteúdo do histórico, mantendo o botão de fechar
    function limparHistorico() {
        // Obtém todos os elementos filhos do contêiner do histórico
        const elementosFilhos = historicoContainer.children;

        // Remove todos os elementos filhos, exceto o botão de fechar
        for (let i = elementosFilhos.length - 1; i >= 0; i--) {
            const elementoFilho = elementosFilhos[i];
            if (elementoFilho !== fecharHistoricoButton) {
                historicoContainer.removeChild(elementoFilho);
            }
        }
    }

    fecharHistoricoButton.addEventListener('click', function () {
        const historicoContainer = document.getElementById('historico-container');
        historicoContainer.classList.remove('open'); // Remove a classe 'open' para fechar a barra lateral
    });

    // Adicione um event listener ao botão "Histórico de Compras"
    const historicoButton = document.getElementById('historico-button');
    historicoButton.addEventListener('click', function () {
        const historicoContainer = document.getElementById('historico-container');
        historicoContainer.classList.add('open'); // Adiciona a classe 'open' para mostrar a barra lateral

        limparHistorico();

        // Exiba o histórico, por exemplo, em um alert
        if (historico && historico.length > 0) {

            // Obtenha o elemento no qual deseja exibir o histórico
            const historicoContainer = document.getElementById('historico-container');

            // Percorra cada produto no histórico e crie elementos para exibi-los
            historico.forEach(function (produtoData) {
                // Crie um elemento div para o produto
                const productDiv = document.createElement('div');
                productDiv.className = 'container';

                // Preencha os elementos com os dados do produto
                productDiv.innerHTML = `
                    <div class="product">
                        <div class="product-details">
                            <h1 class="product-title" id="productName">${produtoData.Produto}</h1><br><br>
                            <div class="product-image">
                                <img src="${produtoData.Foto}" alt="${produtoData.Produto}" id="productImage">
                            </div>
                            <br><br>
                            <p class="product-price" id="productPrice">R$ ${parseFloat(produtoData.PRECO).toFixed(2)}</p><br>
                        </div>
                    </div>
                `;

                // Adicione o elemento do produto ao históricoContainer
                historicoContainer.appendChild(productDiv);
            });
        } else {
            // Caso o histórico esteja vazio, exiba uma mensagem informando que o histórico está vazio
            const historicoContainer = document.getElementById('historico-container');
            historicoContainer.innerHTML = '<p>O histórico de compras está vazio. <br><br> Irá fechar em 3 segundos</p>';


            setTimeout(function () {
                historicoContainer.classList.remove('open'); // Remove a classe 'open' para fechar a barra lateral
            }, 3000); // 3000 milissegundos (3 segundos)


        }
    });



});
