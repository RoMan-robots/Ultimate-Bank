$(document).ready(function () {
    $('form').on('submit', function (event) {
        event.preventDefault();

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        $.ajax({
            url: '/login',
            method: 'POST',
            data: {
                email: email,
                password: password
            },
            dataType: 'json',
            success: function (response) {
                if (response.type === 'success') {
                    localStorage.setItem('token', response.token);
                    window.location.href = '/dashboard';
                }
            },
            error: function (xhr) {
                const response = xhr.responseJSON || {};
                const displayMessage = response.message || 'Помилка входу. Спробуйте пізніше';
                const type = response.type || 'error';

                showNotification(displayMessage, type);
            }
        });
    });
});
