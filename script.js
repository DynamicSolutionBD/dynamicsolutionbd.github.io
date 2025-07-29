// Smooth scrolling for navbar links
document.addEventListener("DOMContentLoaded", function() {
    // Get all links with hashes
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default anchor click behavior
            e.preventDefault();
            // Scroll to the section smoothly
            const targetID = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetID);
            if(targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 65, // Adjust for navbar height
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
});