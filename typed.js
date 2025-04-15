// Typed.js initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Typed.js
    const typed = new Typed('.typing', {
        strings: [
            'Web Developer',
            'Computer Science Engineer',
            'Full Stack Developer',
            'Python Developer',
            
        ],
        typeSpeed: 80,
        backSpeed: 60,
        loop: true,
        backDelay: 1500
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('#navMenu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            navbar.style.padding = '15px 5%';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '20px 5%';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to your backend
            // For now, let's just show an alert
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon.`);
            
            // Reset the form
            contactForm.reset();
        });
    }

       // WhatsApp function
       window.sendToWhatsApp = function(element) {
        const phoneNumber = '919633550309'; 
        const message = 'Hi Akshay, I visited your portfolio and would like to connect!';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // Add scroll reveal animations
    const scrollReveal = function() {
        const elements = document.querySelectorAll('.education-card, .project-card, .skill, .profile-pic, .profile-text');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for scroll reveal elements
    const revealElements = document.querySelectorAll('.education-card, .project-card, .skill, .profile-pic, .profile-text');
    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Run scroll reveal on page load and scroll
    window.addEventListener('load', scrollReveal);
    window.addEventListener('scroll', scrollReveal);
});

