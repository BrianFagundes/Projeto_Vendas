document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const codrep = document.getElementById('codrep').value;

        // Enviar uma solicitação POST ao backend com o código de representante
        fetch('http://localhost:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codrep })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login bem-sucedido, redirecionar o usuário para a segunda tela
                window.location.href = 'http://127.0.0.1:5500/frontend/produto.html'; // Substitua pelo URL da segunda tela
            } else {
                // Login inválido, exibir uma mensagem de erro para o usuário
                messageDiv.innerText = data.message;
            }
        })
        .catch(error => {
            console.error(error);
            // Lidar com erros de rede ou do servidor
            messageDiv.innerText = 'Erro no servidor';
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const resultDiv = document.getElementById('result');
    const productDiv = document.querySelector('.container'); // Seleciona a div dos detalhes do produto

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const codpro = document.getElementById('codpro').value;
        const numsep = document.getElementById('numsep').value;

        try {
            const response = await fetch('http://localhost:3333/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codpro, numsep }),
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
    });
});


