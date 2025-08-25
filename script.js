// Tab functionality
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    const tabButtons = document.getElementsByClassName("tab-btn");
    
    // Hide all tab contents
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Remove active class from all buttons
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    
    // Show selected tab and mark button as active
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    
    // Initialize charts when respective tabs are opened
    setTimeout(() => {
        if (tabName === 'estimacion') {
            createCostChart();
        } else if (tabName === 'presupuesto') {
            createTimelineChart();
        } else if (tabName === 'control') {
            createEVAChart();
        }
    }, 100);
}

// Cost breakdown toggle functionality
function toggleDetails(id) {
    const details = document.getElementById(id);
    const costItem = details.parentElement;
    const icon = costItem.querySelector('.toggle-icon');
    
    if (details.classList.contains('open')) {
        details.classList.remove('open');
        costItem.classList.remove('open');
        details.style.display = 'none';
    } else {
        details.classList.add('open');
        costItem.classList.add('open');
        details.style.display = 'block';
    }
}

// Calculator functionality
function calculateMetrics() {
    const pv = parseFloat(document.getElementById('pv').value) || 0;
    const ev = parseFloat(document.getElementById('ev').value) || 0;
    const ac = parseFloat(document.getElementById('ac').value) || 0;
    const bac = parseFloat(document.getElementById('bac').value) || 0;
    
    if (pv === 0 || ev === 0 || ac === 0 || bac === 0) {
        alert('Por favor, ingrese todos los valores requeridos.');
        return;
    }
    
    // Calculate metrics
    const cv = ev - ac;
    const cpi = ev / ac;
    const sv = ev - pv;
    const spi = ev / pv;
    const eac = bac / cpi;
    const etc = eac - ac;
    
    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value);
    };
    
    // Display results
    document.getElementById('cv-result').textContent = formatCurrency(cv);
    document.getElementById('cv-result').className = cv >= 0 ? 'positive' : 'negative';
    
    document.getElementById('cpi-result').textContent = cpi.toFixed(3);
    document.getElementById('cpi-result').className = cpi >= 1 ? 'positive' : 'negative';
    
    document.getElementById('sv-result').textContent = formatCurrency(sv);
    document.getElementById('sv-result').className = sv >= 0 ? 'positive' : 'negative';
    
    document.getElementById('spi-result').textContent = spi.toFixed(3);
    document.getElementById('spi-result').className = spi >= 1 ? 'positive' : 'negative';
    
    document.getElementById('eac-result').textContent = formatCurrency(eac);
    document.getElementById('etc-result').textContent = formatCurrency(etc);
    
    // Show results
    document.getElementById('results').classList.remove('hidden');
    
    // Add color classes for styling
    const resultItems = document.querySelectorAll('.result-item span:last-child');
    resultItems.forEach(item => {
        if (item.classList.contains('positive')) {
            item.style.color = '#27ae60';
        } else if (item.classList.contains('negative')) {
            item.style.color = '#e74c3c';
        }
    });
}

// Chart creation functions
function createCostChart() {
    const ctx = document.getElementById('costChart');
    if (!ctx || ctx.chart) return;
    
    ctx.chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                'Software ERP',
                'Implementación',
                'Infraestructura',
                'Capacitación',
                'Soporte'
            ],
            datasets: [{
                data: [40000000, 80000000, 20000000, 40000000, 20000000],
                backgroundColor: [
                    '#3498db',
                    '#2c3e50',
                    '#e74c3c',
                    '#27ae60',
                    '#f39c12'
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de Costos por Categoría'
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(context.raw);
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}

function createTimelineChart() {
    const ctx = document.getElementById('timelineChart');
    if (!ctx || ctx.chart) return;
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Planificación', 'Adquisiciones', 'Implementación', 'Pruebas', 'Despliegue'],
            datasets: [{
                label: 'Costo por Fase (COP)',
                data: [34650000, 46200000, 80850000, 46200000, 23100000],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(44, 62, 80, 0.8)',
                    'rgba(231, 76, 60, 0.8)',
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(243, 156, 18, 0.8)'
                ],
                borderColor: [
                    '#3498db',
                    '#2c3e50',
                    '#e74c3c',
                    '#27ae60',
                    '#f39c12'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución Temporal del Presupuesto'
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(context.raw);
                            return `Costo: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            }
        }
    });
}

function createEVAChart() {
    const ctx = document.getElementById('evaChart');
    if (!ctx || ctx.chart) return;
    
    const months = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6', 'Mes 7'];
    const pvData = [15400000, 30800000, 46200000, 61600000, 77000000, 92400000, 108570000];
    const evData = [15400000, 31000000, 46500000, 62000000, 78000000, 94000000, 110000000];
    const acData = [15000000, 30500000, 46000000, 61000000, 76500000, 92000000, 108000000];
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'PV (Valor Planificado)',
                    data: pvData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'EV (Valor Ganado)',
                    data: evData,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'AC (Costo Real)',
                    data: acData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Análisis del Valor Ganado (EVA) - Seguimiento Mensual'
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(context.raw);
                            return `${context.dataset.label}: ${value}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return new Intl.NumberFormat('es-CO', {
                                style: 'currency',
                                currency: 'COP',
                                minimumFractionDigits: 0
                            }).format(value);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize first tab
    document.querySelector('.tab-btn').click();
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add loading animation for charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.style.minHeight = '400px';
        container.style.position = 'relative';
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        const activeTab = document.querySelector('.tab-btn.active');
        const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabButtons.indexOf(activeTab);
        
        if (e.shiftKey && currentIndex > 0) {
            e.preventDefault();
            tabButtons[currentIndex - 1].click();
        } else if (!e.shiftKey && currentIndex < tabButtons.length - 1) {
            e.preventDefault();
            tabButtons[currentIndex + 1].click();
        }
    }
});
