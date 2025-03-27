$(document).ready(function() {
    $('#register').click(function(e) {
        const form = $('form');
        form.submit();
    });

    $('form').on('submit', function (event) {
        event.preventDefault();

        if (!validateData()) {
            return; 
        }

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();

        $.ajax({
            url: '/register',
            method: 'POST',
            data: {
                name: name,
                email: email,
                password: password
            },
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.type === 'success') {
                    localStorage.setItem('token', response.token);
                    showNotification('Реєстрація успішна. Увійдіть у ваш акаунт для продовження', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2500);
                }
            },
            error: function (xhr) {
                const response = xhr.responseJSON || {};
                const displayMessage = response.message || 'Помилка реєстрації. Спробуйте пізніше';
                const type = response.type || 'error';

                showNotification(displayMessage, type);
            }
        });
    });

    function validateData() {
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if(name.length <= 2 || name.length >= 15 || /[^A-Za-zА-Яа-яЄєІіЇї]/.test(name)) {
            showNotification('Ім\'я повинно бути 2-15 літер, і мати лише літери', 'error');
            return false; 
        }

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            showNotification('Некоректний email', 'error');
            return false; 
        }

        if (password.length < 4) {
            showNotification('Пароль повинен бути мінімум 4 символи', 'error');
            return false; 
        }

        if (password !== confirmPassword) {
            showNotification('Паролі не збігаються', 'error');
            return false; 
        }

        return true;
    }
});