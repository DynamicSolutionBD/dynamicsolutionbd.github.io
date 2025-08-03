// Smooth scrolling for navbar links and active state management
document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    // Function to update active nav link
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPos = window.scrollY + 100; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section's nav link
        if (currentSection) {
            const activeLink = document.querySelector(`a.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Smooth scrolling for navbar links
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default anchor click behavior
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Scroll to the section smoothly
            const targetID = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetID);
            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 75, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
            
            // Collapse navbar if open (on mobile)
            const navCollapse = document.querySelector('.navbar-collapse.show');
            if (navCollapse) {
                new bootstrap.Collapse(navCollapse, {toggle: true});
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    function updateNavbar() {
        if (window.scrollY > 10) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('navbar-custom');
        } else {
            navbar.classList.add('navbar-custom');
            navbar.classList.remove('navbar-scrolled');
        }
    }
    
    // Initial calls
    updateNavbar();
    updateActiveNavLink();
    
    // Event listeners
    window.addEventListener('scroll', function() {
        updateNavbar();
        updateActiveNavLink();
    });
});