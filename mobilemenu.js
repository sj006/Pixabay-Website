// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    menuButton.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      document.body.classList.toggle('menu-open'); // Toggle class to prevent background scrolling
    });
  });
  

  