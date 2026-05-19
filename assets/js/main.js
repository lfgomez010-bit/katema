/**
 * KATEMA MARKETING DIGITAL - MAIN JAVASCRIPT
 * Funcionalidad principal para la página HTML5 semántica
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        scrollOffset: 50,
        animationDelay: 100,
        smoothScrollDuration: 800
    };

    // Elementos del DOM
    const elements = {
        header: null,
        navLinks: null,
        mobileToggle: null,
        form: null,
        submitButton: null
    };

    /**
     * Inicialización de la aplicación
     */
    function init() {
        // Obtener elementos del DOM
        getElements();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Configurar animaciones de scroll
        setupScrollAnimations();
        
        // Configurar header dinámico
        setupDynamicHeader();
        
        // Configurar formulario
        setupForm();
        
        // Actualizar año del copyright
        updateCopyrightYear();

        console.log('✅ KATEMA - Aplicación inicializada correctamente');
    }

    /**
     * Obtener referencias a elementos del DOM
     */
    function getElements() {
        elements.header = document.querySelector('.site-header');
        elements.navLinks = document.querySelectorAll('.nav-link, .footer-link[href^="#"]');
        elements.mobileToggle = document.querySelector('.mobile-menu-toggle');
        elements.form = document.querySelector('.contact-form');
        elements.submitButton = document.querySelector('.submit-button');
    }

    /**
     * Configurar event listeners
     */
    function setupEventListeners() {
        // Smooth scroll para enlaces internos
        elements.navLinks.forEach(link => {
            link.addEventListener('click', handleSmoothScroll);
            // Cerrar menú móvil al hacer clic en enlace
            link.addEventListener('click', closeMobileMenu);
        });

        // Botones CTA
        document.querySelectorAll('.cta-button[href^="#"]').forEach(button => {
            button.addEventListener('click', handleSmoothScroll);
        });

        // Scroll del header
        window.addEventListener('scroll', throttle(handleScroll, 16));

        // Resize de ventana
        window.addEventListener('resize', throttle(handleResize, 250));

        // Menú móvil (preparado para implementación futura)
        if (elements.mobileToggle) {
            elements.mobileToggle.addEventListener('click', handleMobileToggle);
        }

        // Botón de cerrar menú móvil
        const closeButton = document.querySelector('.mobile-menu-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeMobileMenu);
        }

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', handleOutsideClick);

        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', handleKeyDown);
    }

    /**
     * Manejar scroll suave
     */
    function handleSmoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = elements.header ? elements.header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            smoothScrollTo(targetPosition);
        }
    }

    /**
     * Scroll suave a posición específica
     */
    function smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = CONFIG.smoothScrollDuration;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    /**
     * Manejar scroll de la página
     */
    function handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Actualizar header
        if (elements.header) {
            if (scrollTop > CONFIG.scrollOffset) {
                elements.header.classList.add('scrolled');
            } else {
                elements.header.classList.remove('scrolled');
            }
        }

        // Activar animaciones visibles
        triggerVisibleAnimations();
    }

    /**
     * Manejar resize de ventana
     */
    function handleResize() {
        // Recalcular posiciones si es necesario
        triggerVisibleAnimations();
    }

    /**
     * Manejar toggle del menú móvil
     */
    function handleMobileToggle() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        const navigation = document.querySelector('.main-navigation');
        
        // Cambiar estado del botón
        this.setAttribute('aria-expanded', !expanded);
        
        // Mostrar/ocultar menú
        if (navigation) {
            if (!expanded) {
                // Abrir menú
                navigation.classList.add('mobile-menu-active');
                document.body.classList.add('mobile-menu-open');
                console.log('📱 Menú móvil abierto');
            } else {
                // Cerrar menú
                navigation.classList.remove('mobile-menu-active');
                document.body.classList.remove('mobile-menu-open');
                console.log('📱 Menú móvil cerrado');
            }
        }
        
        // Animar líneas del hamburguesa
        const lines = this.querySelectorAll('.hamburger-line');
        lines.forEach((line, index) => {
            if (!expanded) {
                // Transformar a X
                if (index === 0) {
                    line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                } else if (index === 1) {
                    line.style.opacity = '0';
                } else if (index === 2) {
                    line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                }
            } else {
                // Volver a hamburguesa
                line.style.transform = 'none';
                line.style.opacity = '1';
            }
        });
    }

    /**
     * Cerrar menú móvil
     */
    function closeMobileMenu() {
        const navigation = document.querySelector('.main-navigation');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navigation && navigation.classList.contains('mobile-menu-active')) {
            navigation.classList.remove('mobile-menu-active');
            document.body.classList.remove('mobile-menu-open');
            
            // Resetear botón hamburguesa
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                const lines = toggle.querySelectorAll('.hamburger-line');
                lines.forEach(line => {
                    line.style.transform = 'none';
                    line.style.opacity = '1';
                });
            }
        }
    }

    /**
     * Manejar clic fuera del menú móvil
     */
    function handleOutsideClick(e) {
        const navigation = document.querySelector('.main-navigation');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (navigation && navigation.classList.contains('mobile-menu-active')) {
            // Si el clic no es en el menú ni en el botón toggle, cerrar menú
            if (!navigation.contains(e.target) && !toggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    }

    /**
     * Manejar teclas del teclado
     */
    function handleKeyDown(e) {
        // Cerrar menú móvil con Escape
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    }

    /**
     * Configurar animaciones de scroll
     */
    function setupScrollAnimations() {
        // Observador de intersección para animaciones
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Aplicar animación escalonada para grupos de cards
                        if (entry.target.parentElement && 
                            (entry.target.parentElement.classList.contains('services-grid') ||
                             entry.target.parentElement.classList.contains('benefits-grid') ||
                             entry.target.parentElement.classList.contains('work-process-grid') ||
                             entry.target.parentElement.classList.contains('cta-options-grid'))) {
                            
                            applyStaggeredAnimation(entry.target.parentElement);
                        } else {
                            // Aplicar animación individual más dramática
                            const animationType = getRandomCardAnimation();
                            entry.target.classList.add(animationType);
                            
                            // Agregar clase animated después de la animación
                            setTimeout(() => {
                                entry.target.classList.add('animated');
                            }, 1400); // Tiempo máximo de animación + buffer
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observar elementos que necesitan animación
            const animatedElements = document.querySelectorAll([
                '.service-card',
                '.benefit-card',
                '.process-card',
                '.process-step',
                '.detailed-service',
                '.cta-option'
            ].join(', '));

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Aplicar animación escalonada a grupos de cards
     */
    function applyStaggeredAnimation(container) {
        const cards = container.querySelectorAll('.service-card, .benefit-card, .process-card, .cta-option');
        const animations = [
            'animate-card-fade-up',
            'animate-card-fade-up-delayed',
            'animate-card-fade-up-smooth',
            'animate-card-fade-up-ease'
        ];

        cards.forEach((card, index) => {
            const animationType = animations[index % animations.length];
            setTimeout(() => {
                card.classList.add(animationType);
                
                // Agregar clase animated después de la animación
                setTimeout(() => {
                    card.classList.add('animated');
                }, 1400); // Tiempo máximo de animación + buffer
            }, index * 120); // Delay escalonado de 120ms entre cada card
        });
    }

    /**
     * Obtener animación aleatoria para las cards
     */
    function getRandomCardAnimation() {
        const animations = [
            'animate-card-fade-up',
            'animate-card-fade-up-delayed',
            'animate-card-fade-up-smooth',
            'animate-card-fade-up-ease'
        ];
        
        return animations[Math.floor(Math.random() * animations.length)];
    }

    /**
     * Activar animaciones para elementos visibles
     */
    function triggerVisibleAnimations() {
        const elements = document.querySelectorAll('[data-animate]:not(.animated)');
        
        elements.forEach(element => {
            if (isElementVisible(element)) {
                const animationType = element.dataset.animate;
                element.classList.add('animated', `animate-${animationType}`);
            }
        });
    }

    /**
     * Verificar si un elemento es visible
     */
    function isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        return (
            rect.top >= 0 &&
            rect.top <= windowHeight * 0.8
        );
    }

    /**
     * Configurar header dinámico
     */
    function setupDynamicHeader() {
        // Aplicar scroll inicial
        handleScroll();
    }

    /**
     * Configurar formulario de contacto
     */
    function setupForm() {
        if (!elements.form) return;

        elements.form.addEventListener('submit', handleFormSubmit);
        
        // Validación en tiempo real
        const inputs = elements.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }

    /**
     * Manejar envío del formulario
     */
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validar formulario
        if (!validateForm()) {
            return;
        }

        // Deshabilitar botón
        setSubmitButtonState(true);
        
        try {
            const formData = new FormData(elements.form);
            const data = Object.fromEntries(formData.entries());
            
            // Simular envío (aquí se integraría con backend real)
            await simulateFormSubmission(data);
            
            // Mostrar éxito
            showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            // Limpiar formulario
            elements.form.reset();
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showMessage('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
        } finally {
            setSubmitButtonState(false);
        }
    }

    /**
     * Validar formulario completo
     */
    function validateForm() {
        const requiredFields = elements.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    /**
     * Validar campo individual
     */
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Limpiar errores previos
        clearFieldError({ target: field });

        // Validar campo requerido
        if (field.hasAttribute('required') && !value) {
            errorMessage = `El campo ${getFieldLabel(field)} es requerido.`;
            isValid = false;
        }
        
        // Validaciones específicas
        if (value && fieldName === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Por favor, ingresa un email válido.';
                isValid = false;
            }
        }
        
        if (value && fieldName === 'telefono') {
            const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
            if (!phoneRegex.test(value)) {
                errorMessage = 'Por favor, ingresa un teléfono válido.';
                isValid = false;
            }
        }

        // Mostrar error si existe
        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    /**
     * Mostrar error en campo
     */
    function showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * Limpiar error de campo
     */
    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Obtener etiqueta del campo
     */
    function getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    /**
     * Configurar estado del botón de envío
     */
    function setSubmitButtonState(isLoading) {
        if (!elements.submitButton) return;
        
        const icon = elements.submitButton.querySelector('i');
        const text = elements.submitButton.querySelector('span');
        
        if (isLoading) {
            elements.submitButton.disabled = true;
            elements.submitButton.classList.add('loading');
            if (icon) icon.className = 'fas fa-spinner fa-spin';
            if (text) text.textContent = 'Enviando...';
        } else {
            elements.submitButton.disabled = false;
            elements.submitButton.classList.remove('loading');
            if (icon) icon.className = 'fas fa-paper-plane';
            if (text) text.textContent = 'Enviar Mensaje';
        }
    }

    /**
     * Simular envío de formulario
     */
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito/error aleatorio para demo
                if (Math.random() > 0.1) {
                    console.log('📧 Formulario enviado:', data);
                    resolve(data);
                } else {
                    reject(new Error('Error simulado'));
                }
            }, 2000);
        });
    }

    /**
     * Mostrar mensaje al usuario
     */
    function showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button type="button" class="message-close" aria-label="Cerrar mensaje">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Agregar estilos inline para el mensaje
        Object.assign(messageElement.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            background: type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '400px',
            fontSize: '0.9rem',
            animation: 'slideInRight 0.3s ease-out'
        });

        // Agregar al DOM
        document.body.appendChild(messageElement);

        // Configurar botón de cerrar
        const closeButton = messageElement.querySelector('.message-close');
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            opacity: 0.7;
        `;
        
        closeButton.addEventListener('click', () => {
            messageElement.remove();
        });

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Throttle function para optimizar performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function para optimizar performance
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Actualizar año del copyright automáticamente
     */
    function updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = currentYear;
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== FUNCIONALIDAD DEL CÍRCULO INTERACTIVO 360° =====
    
    // El círculo 360° ahora se maneja en circle360.js
    // Esta función se eliminó para evitar conflictos

    // Agregar estilos CSS dinámicos para los mensajes
    const messageStyles = document.createElement('style');
    messageStyles.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .form-input.error,
        .form-textarea.error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .field-error::before {
            content: "⚠";
            font-size: 0.75rem;
        }
        
        .submit-button.loading {
            opacity: 0.7;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(messageStyles);

})();
