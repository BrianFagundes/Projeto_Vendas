document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const codrep = document.getElementById('codrep').value;

        // Enviar uma solicitação POST ao backend com o código de representante
        fetch('http://127.0.0.1:3333/login', {
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

                window.location.href = 'http://127.0.0.1:5500/frontend/produto.html';        
                //window.location.href = 'http://127.0.0.1:8080/ProjetoHTML/frontend/produto.html'; // Ambiente de produção   
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

    // Configurar um cookie ao acessar esta página
    document.cookie = "acessoAnterior=true; path=/";
});

