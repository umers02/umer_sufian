// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggleCircle = document.getElementById('toggleCircle');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        enableLightMode();
    }
    
    // Toggle event listener
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            enableDarkMode();
        } else {
            enableLightMode();
        }
    });
    
    function enableDarkMode() {
        document.documentElement.classList.add('dark');
        darkModeToggle.checked = true;
        toggleCircle.style.transform = 'translateX(24px)';
        toggleCircle.parentElement.style.backgroundColor = '#374151'; // gray-700
        localStorage.setItem('theme', 'dark');
    }
    
    function enableLightMode() {
        document.documentElement.classList.remove('dark');
        darkModeToggle.checked = false;
        toggleCircle.style.transform = 'translateX(0)';
        toggleCircle.parentElement.style.backgroundColor = '#fbbf24'; // yellow-400
        localStorage.setItem('theme', 'light');
    }
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add hover effects for social icons
    const socialIcons = document.querySelectorAll('a[href="#"]');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Download CV button functionality
    const downloadBtn = document.querySelector('button:has(span)');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // Add your CV download logic here
            alert('CV download functionality would be implemented here');
        });
    }
});