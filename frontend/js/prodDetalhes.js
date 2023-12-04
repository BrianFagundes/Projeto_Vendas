document.addEventListener('DOMContentLoaded', function () {
    
    const productData = JSON.parse(localStorage.getItem('productData'));
    console.log(productData)
    let codpro = productData.Produto.substring(0, 8);
    console.log(codpro);

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
            window.location.href = 'http://127.0.0.1:5500/frontend/carrinho.html';
            //window.location.href = 'http://localhost:8080/ProjetoHTML/frontend/carrinho.html'; // ambiente de prod
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
        alert('Dados do produto não encontrados.');
    }
   
});

// Adicione um evento de clique ao botão "Voltar"
const voltarButton = document.getElementById('voltarButton');
voltarButton.addEventListener('click', function () {
    // Volta para a página anterior
    window.history.back();

});

document.addEventListener('DOMContentLoaded', () => {
    const estoqueList = document.getElementById('lista-estoque');
    const productData = JSON.parse(localStorage.getItem('productData'));
    let codpro = productData.Produto.substring(0, 8);

    fetch('http://localhost:3333/info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codpro }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const estoqueData = data.data;

            // Limpe a lista de estoque antes de preenchê-la
            estoqueList.innerHTML = '';

            // Crie a tabela e o cabeçalho da tabela
            const table = document.createElement('table');
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');

            // Adicione as colunas do cabeçalho
            const headerColumns = ['Tamanho', 'Loja', 'Série', 'Local'];
            headerColumns.forEach(columnName => {
                const headerCell = document.createElement('th');
                headerCell.textContent = columnName;
                headerRow.appendChild(headerCell);
            });

            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            // Crie o corpo da tabela
            const tableBody = document.createElement('tbody');

            estoqueData.forEach(item => {
                const row = document.createElement('tr');
                const columns = ['tamanho', 'loja', 'serie', 'local'];

                columns.forEach(columnName => {
                    const cell = document.createElement('td');
                    cell.textContent = item[columnName];
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);
            estoqueList.appendChild(table);
        } else {
            console.error('Erro na solicitação da API', data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao buscar dados do estoque', error);
    });

    function sugeridos (codpro){
        fetch('http://localhost:3333/prodSugeridos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({codpro}),
        })
        .then(response => response.json())
        .then(data => {
            // Manipule os dados da resposta, se 
            const suggestedProducts = data.data;
            displaySuggestedProducts(suggestedProducts);
            console.log(data);
        })
        .catch(error => {
            console.error('Erro ao buscar dados de produtos sugeridos', error);
        });

    }
    sugeridos(codpro);
});

const toggleListButton = document.getElementById('irParaMenuButton');
const estoqueList = document.getElementById('lista-estoque');

let isListVisible = false;

toggleListButton.addEventListener('click', () => {
    if (isListVisible) {
        // Se a lista estiver visível, esconda-a
        estoqueList.style.display = 'none';
        isListVisible = false;
        toggleListButton.textContent = 'Abrir estoque';
    } else {
        // Se a lista estiver oculta, mostre-a
        estoqueList.style.display = 'block';
        isListVisible = true;
        toggleListButton.textContent = 'Fechar estoque';
    }
});

// SideBar  
const menuButton = document.querySelector('.menu-btn');
const closeButton = document.querySelector('.close-btn');
const sidebar = document.getElementById('sidebar');
const content = document.querySelector('.content');

let isSidebarOpen = false;

function openSidebar() {
    sidebar.style.left = '0';
    content.style.marginLeft = '350px';
    isSidebarOpen = true;
}

function closeSidebar() {
    sidebar.style.left = '-350px';
    content.style.marginLeft = '0';
    isSidebarOpen = false;
}

menuButton.addEventListener('click', function() {
    if (!isSidebarOpen) {
        openSidebar();
    } else {
        closeSidebar();
    }
});

closeButton.addEventListener('click', closeSidebar);

function displaySuggestedProducts(suggestedProducts) {
    const sidebarContent = document.getElementById('sidebarContent');
    sidebarContent.innerHTML = ''; // Limpa o conteúdo anterior do sidebar

    suggestedProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('suggested-product');

        // Cria elementos HTML para exibir a imagem e informações do produto
        const productImage = document.createElement('img');
        productImage.src = product.Foto;
        productImage.alt = product.Produto;
        productImage.classList.add('suggested-product-image');
        productDiv.appendChild(productImage);

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('suggested-product-info');

        const productName = document.createElement('p');
        const productNameText = product.Produto.substring(11); // Obtém o nome do produto a partir do 8º caractere
        productName.textContent = `${productNameText}`;
        productName.classList.add('suggested-product-name'); // Adiciona uma classe para estilização
        infoContainer.appendChild(productName);


        const productCode = document.createElement('p');
        const productCodeText = product.Produto.substring(0, 8); // Obtém os primeiros 8 caracteres do código do produto
        productCode.textContent = `${productCodeText}`;
        productCode.classList.add('suggested-product-code'); // Adiciona uma classe para estilização
        infoContainer.appendChild(productCode);

        const productPrice = document.createElement('p');
        const formattedPrice = parseFloat(product.PRECO).toFixed(2);
        productPrice.textContent = `R$ ${formattedPrice}`;
        productPrice.classList.add('suggested-product-price'); // Adiciona uma classe para estilização
        infoContainer.appendChild(productPrice);
        
        
        // Adiciona um evento de clique ao produto sugerido
        productDiv.addEventListener('click', () => {
            const codpro = productCodeText; // Altere esta linha se necessário para obter o código do produto

            // Realiza uma solicitação POST para obter os detalhes do produto
            fetch('http://localhost:3333/produto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codpro }),
            })
            .then(response => response.json())
            .then(productDetails => {
                // Redireciona para a página 'prodDetalhes' com os detalhes do produto
                localStorage.setItem('productData', JSON.stringify(productDetails.data));
                const productData = JSON.parse(localStorage.getItem('productData'));
                console.log(productData)
                setTimeout(() => {
                    window.location.href = 'http://127.0.0.1:5500/frontend/prodDetalhes.html';
                    // window.location.href = 'http://localhost:8080/ProjetoHTML/frontend/prodDetalhes.html'; // ambiente de prod
                }, 200); 
            })
            .catch(error => {
                console.error('Erro ao buscar detalhes do produto', error);
            });
        });

        productDiv.appendChild(infoContainer);

        // Adiciona o produto ao sidebar
        sidebarContent.appendChild(productDiv);
    });
}
