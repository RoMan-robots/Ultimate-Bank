$(document).ready(function() {
    const token = localStorage.getItem('token');
    
    if (token) {
        fetch('/checkAuth', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                window.location.href = '/dashboard';
            }
        })
        .catch(error => {
            console.error('Authentication check failed:', error);
        });
    }
});