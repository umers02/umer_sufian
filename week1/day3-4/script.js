// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const toggleCircle = document.getElementById('toggle-circle');
const toggleCircleMobile = document.getElementById('toggle-circle-mobile');
const html = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';

// Set initial theme
if (currentTheme === 'light') {
    html.classList.remove('dark');
    toggleCircle.style.transform = 'translateX(20px)';
    if (toggleCircleMobile) {
        toggleCircleMobile.style.transform = 'translateX(20px)';
    }
} else {
    html.classList.add('dark');
}

// Toggle theme function
function toggleTheme() {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        toggleCircle.style.transform = 'translateX(20px)';
        if (toggleCircleMobile) {
            toggleCircleMobile.style.transform = 'translateX(20px)';
        }
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        toggleCircle.style.transform = 'translateX(0)';
        if (toggleCircleMobile) {
            toggleCircleMobile.style.transform = 'translateX(0)';
        }
    }
}

// Add event listeners
themeToggle.addEventListener('click', toggleTheme);
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}