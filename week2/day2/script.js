document.addEventListener('DOMContentLoaded', function() {
    const markAllReadBtn = document.getElementById('mark-all-read');
    const unreadCountElement = document.getElementById('unread-count');
    const notifications = document.querySelectorAll('.notification');

    function updateUnreadCount() {
        const unreadNotifications = document.querySelectorAll('.notification[data-unread="true"]');
        const count = unreadNotifications.length;
        unreadCountElement.textContent = count;
        unreadCountElement.style.display = count > 0 ? 'inline' : 'none';
    }

    function markAsRead(notification) {
        notification.setAttribute('data-unread', 'false');
        notification.classList.remove('unread', 'bg-gray-100', 'hover:bg-gray-200');
        notification.classList.add('hover:bg-gray-50');
        
        const redDot = notification.querySelector('.bg-red-500');
        if (redDot) {
            redDot.remove();
        }
        
        updateUnreadCount();
    }

    markAllReadBtn.addEventListener('click', function() {
        const unreadNotifications = document.querySelectorAll('.notification[data-unread="true"]');
        unreadNotifications.forEach(notification => {
            markAsRead(notification);
        });
    });

    notifications.forEach(notification => {
        notification.addEventListener('click', function() {
            if (this.getAttribute('data-unread') === 'true') {
                markAsRead(this);
            }
        });
    });

    updateUnreadCount();
});