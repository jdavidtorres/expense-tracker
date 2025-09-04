// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function () {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Chart.js helper functions
window.chartHelpers = {
    createChart: function (canvasId, type, data, options) {
        const ctx = document.getElementById(canvasId);
        if (ctx) {
            return new Chart(ctx, {
                type: type,
                data: data,
                options: options
            });
        }
        return null;
    },

    updateChart: function (chart, newData) {
        if (chart) {
            chart.data = newData;
            chart.update();
        }
    },

    destroyChart: function (chart) {
        if (chart) {
            chart.destroy();
        }
    }
};

// Utility functions
window.appHelpers = {
    // Show toast notifications
    showToast: function (message, type = 'info') {
        // Implementation would depend on chosen toast library
        console.log(`${type.toUpperCase()}: ${message}`);
    },

    // Format currency
    formatCurrency: function (amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    // Copy to clipboard
    copyToClipboard: async function (text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    },

    // File upload helper
    uploadFile: function (inputElement, allowedTypes = []) {
        return new Promise((resolve, reject) => {
            const file = inputElement.files[0];
            if (!file) {
                reject('No file selected');
                return;
            }

            if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                reject('File type not allowed');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    data: e.target.result
                });
            };
            reader.onerror = function () {
                reject('Error reading file');
            };
            reader.readAsDataURL(file);
        });
    }
};

// Re-initialize icons when new content is added
window.refreshIcons = function () {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

// Handle Blazor error UI
window.blazorErrorHandler = {
    show: function () {
        document.getElementById('blazor-error-ui').style.display = 'block';
    },
    hide: function () {
        document.getElementById('blazor-error-ui').style.display = 'none';
    }
};

// Add event listeners for error UI
document.addEventListener('DOMContentLoaded', function () {
    const errorUi = document.getElementById('blazor-error-ui');
    if (errorUi) {
        errorUi.addEventListener('click', function (e) {
            if (e.target.classList.contains('reload')) {
                location.reload();
            } else if (e.target.classList.contains('dismiss')) {
                errorUi.style.display = 'none';
            }
        });
    }
});
