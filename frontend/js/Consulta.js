document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const resultDiv = document.getElementById('result');
    const productDiv = document.querySelector('.container'); // Seleciona a div dos detalhes do produto

     // Ir para Carrinho

     const irParaCarrinhoButton = document.getElementById('irParaCarrinhoButton');
     irParaCarrinhoButton.addEventListener('click', function () {
         // Redirecionar o usuário para a página do carrinho
         window.location.href = 'http://127.0.0.1:5500/frontend/carrinho.html';
         //window.location.href = 'http://localhost:8080/ProjetoHTML/frontend/carrinho.html'; // Substitua pelo URL da página do carrinho
 });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        let codpro = document.getElementById('codpro').value;
        const numsep = document.getElementById('numsep').value;

        

        if(codpro == ""){
        try {
            const response = await fetch('http://localhost:3333/codbar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ numsep }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Aqui você acessa os dados da consulta
                    const dadosConsulta2 = data.data.codpro;
                    console.log(dadosConsulta2)
                    codpro = dadosConsulta2;
                    localStorage.setItem('codpro', codpro);
                    
                    try {
                        const response = await fetch('http://localhost:3333/produto', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ codpro }),
                        });
            
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success) {
                                // Aqui você acessa os dados da consulta
                                const dadosConsulta = data.data;
            
                                // Preenche os elementos com os dados do produto
                                document.getElementById('productImage').src = dadosConsulta.Foto;
                                document.getElementById('productName').textContent = dadosConsulta.Produto;
            
                                // Divide a descrição da característica em linhas separadas
                                const caracteristica = dadosConsulta.Caracteristica.split('\n').map(line => line.trim()).join('<br>');
                                const productDescription = document.getElementById('productDescription');
                                productDescription.innerHTML = caracteristica;
                                
                                const preco = parseFloat(dadosConsulta.PRECO); // Converte a string para um número de ponto flutuante
                                const precoFormatado = preco.toFixed(2); // Formata o número com duas casas decimais
                                document.getElementById('productPrice').textContent = `R$ ${precoFormatado}`;
            
                                // Torna os detalhes do produto visíveis
                                productDiv.style.display = 'block';
            
                                localStorage.setItem('productData', JSON.stringify(data.data));
                                window.location.href = 'http://127.0.0.1:5500/frontend/ProdDetalhes.html';
                                //window.location.href = 'http://localhost:8080/ProjetoHTML/frontend/ProdDetalhes.html'; //Ambiente de prod
            
                                resultDiv.innerHTML = ''; // Limpa a mensagem de resultado anterior
                            } else {
                                resultDiv.innerHTML = data.message; // Exibe a mensagem de erro
                                productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
                            }
                        } else {
                            resultDiv.innerHTML = 'Erro ao consultar o produto.';
                            productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
                        }
                    } catch (error) {
                        console.error(error);
                        resultDiv.innerHTML = 'Erro ao consultar o produto.';
                        productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
                    }


                } else {
                    resultDiv.innerHTML = data.message; // Exibe a mensagem de erro
                    productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
                }
            } else {
                resultDiv.innerHTML = 'Erro ao converter o codigo.';
                productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = 'Erro ao converter o codigo.';
            productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
        }
    } else{
        try {
            const response = await fetch('http://localhost:3333/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codpro }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Aqui você acessa os dados da consulta
                    const dadosConsulta = data.data;
                    localStorage.setItem('codpro', codpro);


                    // Preenche os elementos com os dados do produto
                    document.getElementById('productImage').src = dadosConsulta.Foto;
                    document.getElementById('productName').textContent = dadosConsulta.Produto;

                    // Divide a descrição da característica em linhas separadas
                    const caracteristica = dadosConsulta.Caracteristica.split('\n').map(line => line.trim()).join('<br>');
                    const productDescription = document.getElementById('productDescription');
                    productDescription.innerHTML = caracteristica;
                    
                    const preco = parseFloat(dadosConsulta.PRECO); // Converte a string para um número de ponto flutuante
                    const precoFormatado = preco.toFixed(2); // Formata o número com duas casas decimais
                    document.getElementById('productPrice').textContent = `R$ ${precoFormatado}`;

                    // Torna os detalhes do produto visíveis
                    productDiv.style.display = 'block';

                    localStorage.setItem('productData', JSON.stringify(data.data));
                    window.location.href = 'http://127.0.0.1:5500/frontend/ProdDetalhes.html';
                    //window.location.href = 'http://localhost:8080/ProjetoHTML/frontend/ProdDetalhes.html'; // Ambiente de prod

                    resultDiv.innerHTML = ''; // Limpa a mensagem de resultado anterior
                } else {
                    resultDiv.innerHTML = data.message; // Exibe a mensagem de erro
                    productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
                }
            } else {
                resultDiv.innerHTML = 'Erro ao consultar o produto.';
                productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = 'Erro ao consultar o produto.';
            productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
        }

    }
    });


});


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const resultDiv = document.getElementById('result');
    const codproInput = document.getElementById('codpro'); // Seleciona a caixa de texto por ID
    const numsepInput = document.getElementById('numsep'); // Seleciona a caixa de texto por ID
    const consultButton = document.getElementById('consultButton'); // Seleciona o botão por ID

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const codpro = codproInput.value;
        const numsep = numsepInput.value;

        // ... (seu código de consulta aqui)

        // Após a consulta, você pode limpar as caixas de texto assim:
        codproInput.value = '';
        numsepInput.value = '';
    });
});

