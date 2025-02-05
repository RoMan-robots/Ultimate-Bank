$(document).ready(function() {

    $('#register').click(function(e) {
        e.preventDefault();
        validateData();
    });

    function validateData() {
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if(name.length <= 2 || name.length >= 15 || /[^A-Za-zА-Яа-яЄєІіЇї]/.test(name)) {
            showNotification('Ім\'я повинно бути 2-15 літер, і мати лише літери', 'error');
            return;
        }

        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            showNotification('Некоректний email', 'error');
            return;
        }

        if (password.length < 4) {
            showNotification('Пароль повинен бути мінімум 4 символи', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Паролі не збігаються', 'error');
            return;
        }

        $('#register-form').submit();
    }
});