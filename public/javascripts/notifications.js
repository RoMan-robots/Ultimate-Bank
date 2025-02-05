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