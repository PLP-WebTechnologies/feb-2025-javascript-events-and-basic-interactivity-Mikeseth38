document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeSwitcher.checked = currentTheme === 'dark';
    
    themeSwitcher.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        showNotification(`Switched to ${newTheme} mode`);
    });

    // Tab system
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 1. Event Handling
    
    // Click counter
    const clickBtn = document.getElementById('click-btn');
    const clickDisplay = document.getElementById('click-display');
    let clickCount = 0;
    
    clickBtn.addEventListener('click', function() {
        clickCount++;
        clickDisplay.textContent = `${clickCount} ${clickCount === 1 ? 'click' : 'clicks'}`;
        
        // Add visual feedback
        this.classList.add('pulse');
        setTimeout(() => this.classList.remove('pulse'), 1000);
        
        // Change color every 5 clicks
        if (clickCount % 5 === 0) {
            const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
            showNotification(`Wow! ${clickCount} clicks!`, 'success');
        }
    });

    // Hover effects
    const hoverBox = document.getElementById('hover-box');
    const originalHoverText = hoverBox.innerHTML;
    
    hoverBox.addEventListener('mouseenter', function() {
        this.innerHTML = '<i class="fas fa-smile-wink"></i> You found me!';
        this.style.backgroundColor = '#f72585';
    });
    
    hoverBox.addEventListener('mouseleave', function() {
        this.innerHTML = originalHoverText;
        this.style.backgroundColor = '';
    });

    // Keypress detection
    const keypressDisplay = document.getElementById('keypress-display');
    const keyHistory = document.getElementById('key-history');
    let keysPressed = [];
    
    document.addEventListener('keydown', function(e) {
        // Avoid adding special keys to history
        if (e.key.length === 1 || e.key === ' ') {
            keysPressed.push(e.key);
            if (keysPressed.length > 10) keysPressed.shift();
            
            keyHistory.innerHTML = keysPressed.map(key => 
                `<span>${key === ' ' ? 'Space' : key}</span>`
            ).join('');
        }
        
        keypressDisplay.textContent = `You pressed: ${e.key}`;
        keypressDisplay.style.color = getRandomColor();
        
        // Special key effects
        if (e.key === 'Escape') {
            showNotification('Escape key pressed!', 'warning');
        }
    });
    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Secret actions
    const secretBox = document.getElementById('secret-box');
    const secretMessage = document.getElementById('secret-message');
    let pressTimer;
    
    // Double click
    secretBox.addEventListener('dblclick', function() {
        secretMessage.classList.add('show');
        showNotification('Secret discovered! Double-click detected!', 'success');
        
        setTimeout(() => {
            secretMessage.classList.remove('show');
        }, 3000);
    });
    
    // Long press
    secretBox.addEventListener('mousedown', function() {
        pressTimer = setTimeout(() => {
            this.classList.add('long-press');
            secretMessage.classList.add('show');
            showNotification('Long press detected! Secret unlocked!', 'success');
        }, 1000);
    });
    
    secretBox.addEventListener('mouseup', function() {
        clearTimeout(pressTimer);
    });
    
    secretBox.addEventListener('mouseleave', function() {
        clearTimeout(pressTimer);
        this.classList.remove('long-press');
    });

    // 2. Interactive Elements
    
    // Image slideshow
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    function showSlides(n) {
        // Wrap around if at end
        if (n >= slides.length) slideIndex = 0;
        if (n < 0) slideIndex = slides.length - 1;
        
        // Hide all slides
        slides.forEach(slide => slide.style.display = 'none');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        slides[slideIndex].style.display = 'block';
        dots[slideIndex].classList.add('active');
    }
    
    function nextSlide() {
        slideIndex++;
        showSlides(slideIndex);
    }
    
    function prevSlide() {
        slideIndex--;
        showSlides(slideIndex);
    }
    
    // Navigation arrows
    document.querySelector('.next-slide').addEventListener('click', nextSlide);
    document.querySelector('.prev-slide').addEventListener('click', prevSlide);
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            slideIndex = index;
            showSlides(slideIndex);
        });
    });
    
    // Auto-advance slides
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const slideshowContainer = document.querySelector('.slideshow-container');
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slideshowContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Initialize slideshow
    showSlides(slideIndex);

    // 3. Form Validation
    const form = document.getElementById('validation-form');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const strengthLevel = document.getElementById('strength-level');
    const strengthText = document.getElementById('strength-text');
    
    // Real-time validation
    username.addEventListener('input', validateUsername);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);
    
    function validateUsername() {
        const feedback = document.getElementById('username-feedback');
        const value = username.value.trim();
        
        if (value.length === 0) {
            showError(username, feedback, 'Username is required');
            return false;
        } else if (value.length < 3) {
            showError(username, feedback, 'Username must be at least 3 characters');
            return false;
        } else {
            showSuccess(username, feedback);
            return true;
        }
    }
    
    function validateEmail() {
        const feedback = document.getElementById('email-feedback');
        const value = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value.length === 0) {
            showError(email, feedback, 'Email is required');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(email, feedback, 'Please enter a valid email');
            return false;
        } else {
            showSuccess(email, feedback);
            return true;
        }
    }
    
    function validatePassword() {
        const feedback = document.getElementById('password-feedback');
        const value = password.value;
        let strength = 0;
        
        // Check password rules
        const hasMinLength = value.length >= 8;
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        // Update rule indicators
        document.getElementById('length-rule').className = 
            `fas fa-${hasMinLength ? 'check-circle valid' : 'times-circle'}`;
        document.getElementById('number-rule').className = 
            `fas fa-${hasNumber ? 'check-circle valid' : 'times-circle'}`;
        document.getElementById('special-rule').className = 
            `fas fa-${hasSpecialChar ? 'check-circle valid' : 'times-circle'}`;
        
        // Calculate strength
        if (value.length === 0) {
            strengthLevel.style.width = '0%';
            strengthText.textContent = '';
            feedback.textContent = '';
            return false;
        }
        
        if (hasMinLength) strength += 0.4;
        if (hasNumber) strength += 0.3;
        if (hasSpecialChar) strength += 0.3;
        
        // Set strength meter
        const width = Math.min(Math.floor(strength * 100), 100);
        strengthLevel.style.width = `${width}%`;
        
        // Set strength text and color
        let color, text;
        if (strength < 0.4) {
            color = '#ef233c'; // Red
            text = 'Weak';
        } else if (strength < 0.7) {
            color = '#f8961e'; // Orange
            text = 'Moderate';
        } else {
            color = '#4cc9f0'; // Blue
            text = 'Strong';
        }
        
        strengthLevel.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
        
        // Validate
        if (!hasMinLength) {
            showError(password, feedback, 'Password must be at least 8 characters');
            return false;
        } else {
            showSuccess(password, feedback);
            return true;
        }
    }
    
    function showError(input, feedback, message) {
        feedback.textContent = message;
        feedback.style.color = 'var(--error-color)';
        input.style.borderColor = 'var(--error-color)';
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
    
    function showSuccess(input, feedback) {
        feedback.textContent = '✓ Valid';
        feedback.style.color = 'var(--success-color)';
        input.style.borderColor = 'var(--success-color)';
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        if (isUsernameValid && isEmailValid && isPasswordValid) {
            showNotification('Form submitted successfully!', 'success');
            form.reset();
            strengthLevel.style.width = '0%';
            strengthText.textContent = '';
            document.querySelectorAll('.rule-icon').forEach(icon => {
                icon.className = 'fas fa-check-circle rule-icon';
            });
        } else {
            showNotification('Please fix the errors in the form', 'error');
        }
    });

    // Notification system
    function showNotification(message, type = '') {
        const notification = document.getElementById('notification');
        notification.innerHTML = `<i class="fas fa-${
            type === 'error' ? 'times-circle' : 
            type === 'success' ? 'check-circle' : 'info-circle'
        }"></i> ${message}`;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});