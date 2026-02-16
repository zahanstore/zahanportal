// script.js – updated with dark mode, language toggle, and mobile enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('i');
        // Check localStorage for theme preference
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Language Toggle (simple direction change)
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        // Load saved language
        const savedLang = localStorage.getItem('lang') || 'en';
        langSelect.value = savedLang;
        applyLanguage(savedLang);
        
        langSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem('lang', lang);
            applyLanguage(lang);
        });
    }

    function applyLanguage(lang) {
        if (lang === 'ar') {
            document.body.style.direction = 'rtl';
            // You can add more translation logic here later
        } else {
            document.body.style.direction = 'ltr';
        }
    }

    // DATA: Fetch Products from Neon via Netlify Function (if product grid exists)
    populateProducts();

    // FORMS: Handle Newsletter & Contact
    initFormHandlers();
});

async function populateProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    try {
        const response = await fetch('/.netlify/functions/get-products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const products = await response.json();
        productGrid.innerHTML = ''; // Clear loading state

        products.forEach(product => {
            productGrid.innerHTML += `
                <div class="product-card">
                    <div class="product-card-image">
                        <img src="${product.image_url}" alt="${product.name}" onerror="this.src='placeholder.jpg'">
                    </div>
                    <div class="product-card-info">
                        <h3 class="product-card-title">${product.name}</h3>
                        <div class="product-card-price">
                            <span class="product-card-current">₹${product.price}</span>
                        </div>
                        <div class="product-card-actions">
                            <button class="product-card-btn product-card-cart" onclick="buyNow('${product.sku}', ${product.price})">Buy Now</button>
                            <button class="product-card-btn product-card-view" onclick="viewProduct('${product.sku}')">View</button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Store Error:", error);
        productGrid.innerHTML = '<p>Check back soon for new arrivals!</p>';
    }
}

function initFormHandlers() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => handleNetlifyForm(e, 'thank-you-message'));
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => handleNetlifyForm(e, 'newsletter-thankyou'));
    }
}

async function handleNetlifyForm(event, successId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        });
        form.classList.add('hidden');
        document.getElementById(successId).classList.remove('hidden');
    } catch (error) {
        alert("Submission failed. Please try again.");
    }
}

// Payment trigger placeholder
function buyNow(sku, price) {
    alert(`Initiating payment for ${sku} - ₹${price}`);
    // This will eventually call /.netlify/functions/create-payment
}
