// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Typing Effect for Hero Title
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["Invest in the Future of Innovation", "Fund Tomorrow's Unicorns", "Power the Next Big Breakthrough"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing effect only if the element exists
    if (typedTextSpan && cursorSpan) {
        setTimeout(type, newTextDelay + 250);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animatedElements = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Header background on scroll
    const header = document.querySelector('.landing-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // Stats counter animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        const targets = [500, 50, 10]; // Target numbers for stats
        const suffixes = ['+', 'M+', 'K+'];
        
        statsNumbers.forEach((stat, index) => {
            const target = targets[index];
            const suffix = suffixes[index];
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (index === 1) { // For 50M+
                    stat.textContent = Math.floor(current) + suffix;
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
    }

    // Mobile menu toggle (if needed in future)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }

    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Form validation for registration links
    const registrationLinks = document.querySelectorAll('a[href="register.html"]');
    
    registrationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add any tracking or analytics here
            console.log('Registration link clicked from landing page');
        });
    });

    // Add loading animation for external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            this.innerHTML += ' <i class="fas fa-spinner fa-spin"></i>';
        });
    });

    console.log('ThriveX Landing Page JavaScript loaded');
});