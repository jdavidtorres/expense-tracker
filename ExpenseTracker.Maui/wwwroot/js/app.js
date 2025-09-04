// JavaScript functions for Expense Tracker

window.expenseTracker = {
    // Initialize Lucide icons
    initializeIcons: function() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },

    // Show confirmation dialog
    confirm: function(message) {
        return confirm(message);
    },

    // Local storage helpers
    localStorage: {
        setItem: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        getItem: function(key) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        removeItem: function(key) {
            localStorage.removeItem(key);
        }
    },

    // Chart.js helpers
    charts: {
        createExpenseChart: function(canvasId, data, options) {
            const ctx = document.getElementById(canvasId);
            if (ctx && typeof Chart !== 'undefined') {
                return new Chart(ctx, {
                    type: 'doughnut',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            }
                        },
                        ...options
                    }
                });
            }
            return null;
        },

        createMonthlyChart: function(canvasId, data, options) {
            const ctx = document.getElementById(canvasId);
            if (ctx && typeof Chart !== 'undefined') {
                return new Chart(ctx, {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        },
                        ...options
                    }
                });
            }
            return null;
        },

        destroyChart: function(chart) {
            if (chart) {
                chart.destroy();
            }
        }
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Format date
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // File upload helper
    uploadFile: function(inputElement, maxSizeInMB = 10) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];
            if (!file) {
                resolve(null);
                return;
            }

            // Check file size
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                reject(new Error(`File size must be less than ${maxSizeInMB}MB`));
                return;
            }

            // Read file as base64
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result
                });
            };
            reader.onerror = function() {
                reject(new Error('Failed to read file'));
            };
            reader.readAsDataURL(file);
        });
    },

    // Bootstrap utilities
    bootstrap: {
        showToast: function(message, type = 'info') {
            // Create toast element
            const toastId = 'toast-' + Date.now();
            const toastHtml = `
                <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                    </div>
                </div>
            `;

            // Add to toast container or create one
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                document.body.appendChild(container);
            }

            container.insertAdjacentHTML('beforeend', toastHtml);

            // Show toast
            const toastElement = document.getElementById(toastId);
            if (toastElement && typeof bootstrap !== 'undefined') {
                const toast = new bootstrap.Toast(toastElement);
                toast.show();

                // Remove from DOM after hiding
                toastElement.addEventListener('hidden.bs.toast', function() {
                    toastElement.remove();
                });
            }
        },

        showModal: function(modalId) {
            const modalElement = document.getElementById(modalId);
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
                return modal;
            }
            return null;
        },

        hideModal: function(modalId) {
            const modalElement = document.getElementById(modalId);
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    modal.hide();
                }
            }
        }
    },

    // Utility functions
    utils: {
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        generateId: function() {
            return 'id-' + Math.random().toString(36).substr(2, 9);
        },

        scrollToTop: function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        copyToClipboard: function(text) {
            if (navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                textArea.remove();
                return Promise.resolve(success);
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    window.expenseTracker.initializeIcons();

    // Re-initialize icons when Blazor updates the DOM
    if (typeof Blazor !== 'undefined') {
        Blazor.addEventListener('enhancedload', function() {
            setTimeout(() => {
                window.expenseTracker.initializeIcons();
            }, 100);
        });
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Expose for Blazor interop
window.blazorCulture = {
    get: () => window.localStorage['BlazorCulture'],
    set: (value) => window.localStorage['BlazorCulture'] = value
};
