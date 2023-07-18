document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector('.login_input');
    const button = document.querySelector('.login_button');
    const form = document.querySelector('.login-form');

    const validateInput = ({ target }) => {
        if (target.value.length > 2) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', '');
        }
    };


    const handleSubmit = (event) => {

        localStorage.setItem('player', input.value);

    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/', true); // Abre uma conexão POST com a rota /login
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // Define o cabeçalho da requisição
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) { // Verifica se a requisição foi concluída e a resposta do servidor é bem-sucedida
            var resposta = xhr.responseText; // Obtém a resposta do servidor e converte para objeto JSON; // Obtém a resposta do servidor
            if (resposta === 'senha incorreta') {
                alert('Senha incorreta.Tente outra senha ou outro usuário!'); // Exibe um alerta se a senha estiver incorreta
            }
        }
    }
    input.addEventListener('input', validateInput);
    form.addEventListener('submit', handleSubmit);
});


