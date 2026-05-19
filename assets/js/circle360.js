/**
 * CÍRCULO INTERACTIVO 360° - CHART.JS
 * Implementación con plugin afterDraw para iconos integrados
 */

class Circle360 {
    constructor() {
        this.currentStep = 0;
        this.isAnimating = false;
        this.chart = null;
        
        // Datos de los pasos
        this.stepsData = [
            {
                title: 'DIAGNÓSTICO',
                description: 'Análisis profundo de tu situación actual, competencia y oportunidades de mercado para crear una base sólida para tu estrategia digital.',
                icon: '\uf002', // FontAwesome search icon
                color: '#cfff0d', // Katema yellow
                features: [
                    { icon: 'fas fa-chart-bar', text: 'Análisis de mercado' },
                    { icon: 'fas fa-users', text: 'Definición de buyer personas' },
                    { icon: 'fas fa-search', text: 'Auditoría digital' }
                ]
            },
            {
                title: 'ESTRATEGIA',
                description: 'Desarrollamos una estrategia personalizada con objetivos claros, KPIs y cronograma detallado basado en los hallazgos del diagnóstico.',
                icon: '\uf439', // FontAwesome chess icon
                color: '#0d0d0e', // Katema black
                features: [
                    { icon: 'fas fa-target', text: 'Definición de objetivos' },
                    { icon: 'fas fa-route', text: 'Plan de acción detallado' },
                    { icon: 'fas fa-chart-line', text: 'KPIs personalizados' }
                ]
            },
            {
                title: 'CONTENIDOS',
                description: 'Creamos contenidos que conectan emocionalmente con tu audiencia y generan conversiones reales a través de diferentes canales.',
                icon: '\uf304', // FontAwesome pencil icon
                color: '#cfff0d', // Katema yellow
                features: [
                    { icon: 'fas fa-palette', text: 'Diseño gráfico profesional' },
                    { icon: 'fas fa-video', text: 'Producción audiovisual' },
                    { icon: 'fas fa-edit', text: 'Copywriting persuasivo' }
                ]
            },
            {
                title: 'SEO',
                description: 'Posicionamos tu marca en los primeros resultados de búsqueda para que te encuentren cuando más te necesitan.',
                icon: '\uf201', // FontAwesome chart-line icon
                color: '#0d0d0e', // Katema black
                features: [
                    { icon: 'fas fa-key', text: 'Investigación de keywords' },
                    { icon: 'fas fa-link', text: 'Link building estratégico' },
                    { icon: 'fas fa-mobile-alt', text: 'Optimización técnica' }
                ]
            },
            {
                title: 'MEDICIÓN',
                description: 'Implementamos las acciones planificadas con seguimiento continuo y optimización constante basada en datos reales.',
                icon: '\uf080', // FontAwesome chart-bar icon
                color: '#cfff0d', // Katema yellow
                features: [
                    { icon: 'fas fa-analytics', text: 'Análisis de métricas' },
                    { icon: 'fas fa-sync-alt', text: 'Optimización continua' },
                    { icon: 'fas fa-trophy', text: 'Reportes de resultados' }
                ]
            },
            {
                title: 'OPTIMIZACIÓN',
                description: 'Mejoramos continuamente el rendimiento de tus campañas digitales basándonos en datos y resultados para maximizar el ROI.',
                icon: '\uf135', // FontAwesome rocket icon
                color: '#0d0d0e', // Katema black
                features: [
                    { icon: 'fas fa-chart-line', text: 'Análisis de rendimiento' },
                    { icon: 'fas fa-cogs', text: 'Ajustes automáticos' },
                    { icon: 'fas fa-trending-up', text: 'Mejora continua' }
                ]
            }
        ];

        this.init();
    }

    init() {
        console.log('🎯 Inicializando Círculo 360°...');
        
        const canvas = document.getElementById('circle-360-canvas');
        if (!canvas) {
            console.error('❌ No se encontró el canvas del círculo 360°');
            return;
        }

        this.canvas = canvas;
        
        // Primero configurar los controles para tener acceso a los elementos del DOM
        this.setupControls();
        
        // Luego configurar el gráfico
        this.setupChart();
        
        // Finalmente configurar los event listeners
        this.setupEventListeners();
        
        console.log('✅ Círculo 360° inicializado correctamente');
    }

    setupChart() {
        const ctx = this.canvas.getContext('2d');
        
        // Configurar datos para el gráfico
        const chartData = {
            labels: this.stepsData.map(step => step.title),
            datasets: [{
                data: this.stepsData.map(() => 1), // Todos los segmentos iguales
                backgroundColor: this.stepsData.map(step => step.color),
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBorderWidth: 4,
                hoverBorderColor: '#ffffff',
                cutout: '60%', // Espacio para el hub central
                radius: '90%'
            }]
        };

        // Configuración del gráfico con plugin afterDraw
        const config = {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeOutQuart'
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                elements: {
                    arc: {
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }
                }
            },
            plugins: [{
                // Plugin para dibujar iconos dentro de los segmentos
                id: 'segmentIcons',
                afterDraw(chart) {
                    const {ctx, chartArea: {width, height}} = chart;
                    const meta = chart.getDatasetMeta(0);
                    
                    if (!meta.data || meta.data.length === 0) return;
                    
                    // Radio para posicionar los iconos
                    const radius = meta.data[0].outerRadius * 0.75;

                    meta.data.forEach((arc, i) => {
                        // Calcular el centro del segmento
                        const angle = (arc.startAngle + arc.endAngle) / 2;
                        const x = chart.width / 2 + Math.cos(angle) * radius;
                        const y = chart.height / 2 + Math.sin(angle) * radius;

                        ctx.save();
                        
                        // Configurar el color del icono basado en el color de fondo del segmento
                        const segmentColor = arc.options.backgroundColor;
                        ctx.fillStyle = segmentColor === '#0d0d0e' ? '#ffffff' : '#000000';
                        
                        // Configurar la fuente para FontAwesome
                        ctx.font = 'bold 20px "Font Awesome 6 Free", "Font Awesome 6 Pro", "FontAwesome"';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';

                        // Dibujar el icono
                        const icon = chart.data.labels[i] === 'DIAGNÓSTICO' ? '\uf002' :
                                   chart.data.labels[i] === 'ESTRATEGIA' ? '\uf439' :
                                   chart.data.labels[i] === 'CONTENIDOS' ? '\uf304' :
                                   chart.data.labels[i] === 'SEO' ? '\uf201' :
                                   chart.data.labels[i] === 'MEDICIÓN' ? '\uf080' :
                                   chart.data.labels[i] === 'OPTIMIZACIÓN' ? '\uf135' : '\uf059';
                        
                        ctx.fillText(icon, x, y);
                        
                        ctx.restore();
                    });
                }
            }]
        };

        // Crear el gráfico
        this.chart = new Chart(ctx, config);
        
        // Configurar estado inicial solo si los elementos están disponibles
        if (this.stepContent) {
            this.updateStepContent(0);
        }
        if (this.stepIndicators && this.stepIndicators.length > 0) {
            this.updateIndicators(0);
        }
        if (this.prevBtn || this.nextBtn) {
            this.updateNavigation(0);
        }
        
        console.log('✅ Gráfico configurado con', this.stepsData.length, 'secciones');
    }

    setupControls() {
        // Elementos del DOM
        this.stepContent = document.getElementById('step-content');
        this.stepIndicators = document.querySelectorAll('.step-indicator');
        this.prevBtn = document.getElementById('prev-step');
        this.nextBtn = document.getElementById('next-step');
        
        console.log('🔍 Elementos encontrados:', {
            stepContent: !!this.stepContent,
            stepIndicators: this.stepIndicators.length,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn
        });
    }

    setupEventListeners() {
        console.log('🔗 Configurando event listeners...');
        
        // Botones de navegación
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                console.log('⬅️ Botón anterior clickeado');
                this.prevStep();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                console.log('➡️ Botón siguiente clickeado');
                this.nextStep();
            });
        }

        // Indicadores de pasos
        if (this.stepIndicators && this.stepIndicators.length > 0) {
            this.stepIndicators.forEach((indicator, index) => {
                console.log(`🔢 Configurando indicador ${index + 1}`);
                indicator.addEventListener('click', () => {
                    console.log(`🎯 Clic en indicador ${index + 1}`);
                    this.goToStep(index);
                });
            });
        } else {
            console.error('❌ No se encontraron indicadores para configurar event listeners');
        }

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevStep();
            } else if (e.key === 'ArrowRight') {
                this.nextStep();
            }
        });

        // Swipe para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.canvas.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
        
        console.log('✅ Event listeners configurados');
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextStep();
            } else {
                this.prevStep();
            }
        }
    }

    nextStep() {
        console.log('➡️ Siguiente paso desde', this.currentStep);
        if (this.currentStep < this.stepsData.length - 1 && !this.isAnimating) {
            this.goToStep(this.currentStep + 1);
        }
    }

    prevStep() {
        console.log('⬅️ Paso anterior desde', this.currentStep);
        if (this.currentStep > 0 && !this.isAnimating) {
            this.goToStep(this.currentStep - 1);
        }
    }

    goToStep(stepIndex) {
        console.log('🎯 Intentando ir al paso:', stepIndex, 'de', this.stepsData.length - 1);
        
        if (stepIndex >= 0 && stepIndex < this.stepsData.length && !this.isAnimating) {
            console.log('✅ Navegando al paso:', stepIndex);
            this.isAnimating = true;
            this.currentStep = stepIndex;

            // Animar rotación del gráfico
            const targetRotation = -(stepIndex / this.stepsData.length) * 360;
            
            if (window.gsap) {
                // Animar el gráfico con GSAP usando transform en lugar de rotation
                gsap.to(this.canvas, {
                    rotation: targetRotation,
                    duration: 1,
                    ease: 'power2.out',
                    onComplete: () => {
                        this.isAnimating = false;
                    }
                });
            } else {
                // Fallback sin GSAP
                this.chart.options.rotation = targetRotation * (Math.PI / 180);
                this.chart.update();
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 1000);
            }

            // Actualizar contenido
            this.updateStepContent(stepIndex);
            this.updateIndicators(stepIndex);
            this.updateNavigation(stepIndex);
        } else {
            console.log('❌ No se pudo navegar al paso:', stepIndex);
        }
    }

    updateStepContent(stepIndex) {
        const stepData = this.stepsData[stepIndex];
        
        if (!this.stepContent) {
            console.error('❌ No se encontró el elemento step-content');
            return;
        }

        console.log('📝 Actualizando contenido para paso:', stepIndex);

        // Animar salida del contenido actual
        if (window.gsap) {
            gsap.to(this.stepContent, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                onComplete: () => {
                    this.updateContentHTML(stepData);
                    gsap.to(this.stepContent, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5
                    });
                }
            });
        } else {
            // Fallback sin GSAP
            this.stepContent.style.opacity = '0';
            this.stepContent.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                this.updateContentHTML(stepData);
                this.stepContent.style.transition = 'all 0.5s ease';
                this.stepContent.style.opacity = '1';
                this.stepContent.style.transform = 'translateY(0)';
            }, 300);
        }
    }

    updateContentHTML(stepData) {
        this.stepContent.innerHTML = `
            <div class="step-icon">
                <i class="fas fa-${this.getIconClass(stepData.icon)}" aria-hidden="true"></i>
            </div>
            <h3 class="step-title">${stepData.title}</h3>
            <p class="step-description">${stepData.description}</p>
            <div class="step-features">
                ${stepData.features.map(feature => `
                    <div class="step-feature">
                        <i class="${feature.icon}" aria-hidden="true"></i>
                        <span>${feature.text}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getIconClass(iconCode) {
        // Convertir códigos de FontAwesome a clases CSS
        const iconMap = {
            '\uf002': 'search',
            '\uf439': 'chess',
            '\uf304': 'pencil',
            '\uf201': 'chart-line',
            '\uf080': 'chart-bar',
            '\uf135': 'rocket'
        };
        return iconMap[iconCode] || 'question';
    }

    updateIndicators(stepIndex) {
        console.log('🎯 Actualizando indicadores para paso:', stepIndex);
        
        if (!this.stepIndicators || this.stepIndicators.length === 0) {
            console.error('❌ No se encontraron los indicadores de pasos');
            return;
        }
        
        this.stepIndicators.forEach((indicator, index) => {
            if (index === stepIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    updateNavigation(stepIndex) {
        console.log('🧭 Actualizando navegación para paso:', stepIndex, 'de', this.stepsData.length - 1);
        
        if (this.prevBtn) {
            this.prevBtn.disabled = stepIndex === 0;
            this.prevBtn.style.opacity = stepIndex === 0 ? '0.5' : '1';
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = stepIndex === this.stepsData.length - 1;
            this.nextBtn.style.opacity = stepIndex === this.stepsData.length - 1 ? '0.5' : '1';
        }
    }

    // Método para actualizar el gráfico cuando cambie el tamaño de la ventana
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 DOM cargado, inicializando Círculo 360°...');
        window.circle360Instance = new Circle360();
    });
} else {
    console.log('🚀 DOM ya listo, inicializando Círculo 360°...');
    window.circle360Instance = new Circle360();
}

// Manejar resize de ventana
window.addEventListener('resize', () => {
    if (window.circle360Instance) {
        window.circle360Instance.resize();
    }
});
