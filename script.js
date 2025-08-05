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

    // Contact Form Handling with Custom Email API
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnLoading = submitBtn ? submitBtn.querySelector('.btn-loading') : null;

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            if (btnText && btnLoading) {
                btnText.classList.add('d-none');
                btnLoading.classList.remove('d-none');
            }
            submitBtn.disabled = true;
            if (formMessage) {
                formMessage.classList.add('d-none');
            }

            try {
                // Get form data
                const name = contactForm.querySelector('input[name="name"]').value.trim();
                const email = contactForm.querySelector('input[name="email"]').value.trim();
                const subject = contactForm.querySelector('input[name="subject"]').value.trim();
                const userMessage = contactForm.querySelector('textarea[name="message"]').value.trim();

                // Validate form data
                if (!name || !email || !subject || !userMessage) {
                    throw new Error('All fields are required');
                }

                // Format the email content
                const formattedMessage = `
Contact Form Submission Details:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${userMessage}

---
This email was sent from the Dynamic Solution website contact form.
Submitted on: ${new Date().toLocaleString()}
                `.trim();

                // Prepare the API request
                const emailData = {
                    to: "dynamicsolutionrp@gmail.com",
                    subject: `[CONTACT FORM] ${subject} - By ${email}`,
                    message: formattedMessage,
                    name: name
                };

                // Send email using your custom API
                const response = await fetch('https://email-service-e5iq.onrender.com/api/v1/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(emailData)
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Success
                    if (formMessage) {
                        formMessage.className = 'alert alert-success mb-3';
                        formMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you! Your message has been sent successfully. We will get back to you soon.';
                        formMessage.classList.remove('d-none');
                    }
                    contactForm.reset();
                } else {
                    // API returned error
                    let errorMessage = 'Sorry, there was an error sending your message.';
                    
                    if (result.message) {
                        errorMessage += ` ${result.message}`;
                    }
                    
                    if (result.errors && result.errors.length > 0) {
                        const errorDetails = result.errors.map(err => err.message).join(', ');
                        errorMessage += ` Details: ${errorDetails}`;
                    }
                    
                    throw new Error(errorMessage);
                }
            } catch (error) {
                // Error handling
                console.error('Email sending error:', error);
                
                if (formMessage) {
                    formMessage.className = 'alert alert-danger mb-3';
                    
                    let errorText = 'Sorry, there was an error sending your message. ';
                    
                    if (error.message.includes('All fields are required')) {
                        errorText = 'Please fill in all required fields.';
                    } else if (error.message.includes('fetch')) {
                        errorText += 'Please check your internet connection and try again.';
                    } else {
                        errorText += 'Please try again or contact us directly at dynamicsolutionrp@gmail.com';
                    }
                    
                    formMessage.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i>${errorText}`;
                    formMessage.classList.remove('d-none');
                }
            } finally {
                // Reset button state
                if (btnText && btnLoading) {
                    btnText.classList.remove('d-none');
                    btnLoading.classList.add('d-none');
                }
                submitBtn.disabled = false;
            }
        });
    }
});