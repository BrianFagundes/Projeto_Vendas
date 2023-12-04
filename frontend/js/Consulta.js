document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('productForm');
    const resultDiv = document.getElementById('result');
    const codproInput = document.getElementById('codpro');
    const numsepInput = document.getElementById('numsep');
    const consultButton = document.getElementById('consultButton');
    const IrCarrinho = this.getElementById('irParaCarrinhoButton');

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const codpro = codproInput.value;
        const numsep = numsepInput.value;

        if (numsep !== "") {
            try {
                const converternumsep = await fetchCodproFromAPI(numsep)
                const productData = await fetchProductByCodpro(converternumsep)
                updateProductDetails(productData)
            } catch (error) {
                handleFetchError(error);
            }
        } else if (codpro !== "") {
            try {
                const productData = await fetchProductByCodpro(codpro);
                updateProductDetails(productData);
            } catch (error) {
                handleFetchError(error);
            }
        } else {
            resultDiv.innerHTML = 'Digite um código para consultar.';
        }

        // Limpar campos após a consulta
        codproInput.value = '';
        numsepInput.value = '';
    });

    async function fetchCodproFromAPI(numsep) {
        const response = await fetch('http://localhost:3333/codbar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ numsep }),
        });

        if (!response.ok) {
            throw new Error('Erro ao converter o código.');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data.codpro;
    }

    async function fetchProductByCodpro(codpro) {
        const response = await fetch('http://localhost:3333/produto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ codpro }),
        });

        if (!response.ok) {
            throw new Error('Erro ao consultar o produto.');
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    }

    function updateProductDetails(productData) {
        // Preencher elementos com os dados do produto
        document.getElementById('productImage').src = productData.Foto;
        document.getElementById('productName').textContent = productData.Produto;
        // ... (outros elementos)

        // Exibir os detalhes do produto
        const productDiv = document.querySelector('.container');
        productDiv.style.display = 'block';

        // Salvar dados do produto no localStorage
        localStorage.setItem('productData', JSON.stringify(productData));

        // Redirecionar para a página de detalhes do produto
        window.location.href = 'http://127.0.0.1:5500/frontend/ProdDetalhes.html';
    }

    function handleFetchError(error) {
        console.error(error);
        resultDiv.innerHTML = 'Erro ao consultar o produto.';
        const productDiv = document.querySelector('.container');
        productDiv.style.display = 'none'; // Oculta os detalhes do produto em caso de erro
    }

    function Irparacarrinho(){
        window.location.href = 'http://127.0.0.1:5500/frontend/carrinho.html';
    }

    IrCarrinho.addEventListener('click', Irparacarrinho);
});
