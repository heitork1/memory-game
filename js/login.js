document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector('.login_input');
    const button = document.querySelector('.login_button');
    const form = document.querySelector('.login-form');
    const passwordInput = document.querySelector('input[name="senha"]');

    const validateInput = () => {
        const nicknameValue = input.value.trim();
        const passwordValue = passwordInput.value.trim();
    
        if (nicknameValue.length >= 2 && passwordValue.length >= 2) {
          button.removeAttribute('disabled');
        } else {
          button.setAttribute('disabled', '');
        }
      };


    const handleSubmit = (event) => {
        event.preventDefault(); // Impede o envio do formulário padrão

        localStorage.setItem('player', input.value);

        // Envia o formulário usando fetch API
        fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: input.value,
                senha: document.querySelector('input[name="senha"]').value,
            }),
        })
        .then((response) => {
            if (response.redirected) {
                // Redireciona para nova página se for sucesso
                window.location.href = response.url;
            } else {
                //manda um alerta se o server responder com "'Usuário existe... mas a senha está incorreta!'
                response.text().then((message) => {
                    alert(message);
                });
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    passwordInput.addEventListener('input', validateInput);
    input.addEventListener('input', validateInput);
    form.addEventListener('submit', handleSubmit);
});


