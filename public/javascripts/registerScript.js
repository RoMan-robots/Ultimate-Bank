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
    function showNotification(message, type) {
        const notification = document.createElement('div');
        
        notification.classList.add('notification', `notification-${type}`);

        const icon = document.createElement('i');
        if (type === 'error') {
            icon.classList.add('fas', 'fa-exclamation-circle');
        } else if (type === 'success') {
            icon.classList.add('fas', 'fa-check-circle');
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(textSpan);
        
        document.body.appendChild(notification);
    
        notification.offsetHeight;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});