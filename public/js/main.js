document.addEventListener('DOMContentLoaded', function () {
    var menuIcon = document.getElementById('menu-icon');
    var popupMenu = document.getElementById('popup-menu');
    var pageContainer = document.querySelector('.content-wrap');

    menuIcon.addEventListener('click', function () {
        popupMenu.classList.toggle('active');
        popupMenu.classList.toggle('hide');
    });

    pageContainer.addEventListener('click', function () {
        popupMenu.classList.remove('active');
        popupMenu.classList.add('hide');
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker Registered', registration);
        })
        .catch(error => {
            console.error('Service Worker Registration Failed', error);
        });
}

function subscribeUserToPush() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            // User granted permission
            navigator.serviceWorker.ready.then(registration => {
                // Subscribe to push
            });
        }
    });
}