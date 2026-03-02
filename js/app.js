/**
 * Main Application Controller
 */
const App = {
    state: {
        selectedCity: null,
        selectedVehicle: null,
        distance: null,
        duration: null,
        options: {
            nightRide: false,
            peakHours: false,
            acRequired: false,
            luggage: false
        }
    },

    /**
     * Initialize the app
     */
    init() {
        this.renderCities();
        this.renderVehicles();
        this.bindEvents();
        this.autoDetectTimeOptions();
    },

    /**
     * Render city selection cards
     */
    renderCities() {
        const grid = document.getElementById('cityGrid');
        grid.innerHTML = '';

        for (const [key, city] of Object.entries(CITIES)) {
            const card = document.createElement('div');
            card.className = 'city-card';
            card.dataset.city = key;
            card.innerHTML = `
                <span class="city-emoji">${city.emoji}</span>
                <span class="city-name">${city.name}</span>
                <span class="city-name-ar">${city.nameAr}</span>
            `;
            card.addEventListener('click', () => this.selectCity(key));
            grid.appendChild(card);
        }
    },

    /**
     * Render vehicle type cards
     */
    renderVehicles() {
        const grid = document.getElementById('vehicleGrid');
        grid.innerHTML = '';

        for (const [key, vehicle] of Object.entries(VEHICLES)) {
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.dataset.vehicle = key;
            card.innerHTML = `
                <span class="vehicle-icon">${vehicle.icon}</span>
                <span class="vehicle-name">${vehicle.name}</span>
                <span class="vehicle-capacity">${vehicle.capacity}</span>
                <span class="vehicle-base">${vehicle.baseFare} MAD base</span>
            `;
            card.addEventListener('click', () => this.selectVehicle(key));
            grid.appendChild(card);
        }
    },

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Swap button
        document.getElementById('swapBtn').addEventListener('click', () => {
            MapModule.swapPoints();
        });

        // Locate button
        document.getElementById('locateBtn').addEventListener('click', () => {
            MapModule.locateUser();
        });

        // Option toggles
        ['nightRide', 'peakHours', 'acRequired', 'luggage'].forEach(opt => {
            document.getElementById(opt).addEventListener('change', (e) => {
                this.state.options[opt] = e.target.checked;
                this.recalculate();
            });
        });

        // Route calculated event
        document.addEventListener('route-calculated', (e) => {
            this.state.distance = e.detail.distance;
            this.state.duration = e.detail.duration;
            this.updateRouteInfo();
            this.recalculate();
        });

        // Location input suggestions
        this.setupSuggestions('pickup', 'pickupSuggestions');
        this.setupSuggestions('dropoff', 'dropoffSuggestions');
    },

    /**
     * Setup autocomplete suggestions for location inputs
     */
    setupSuggestions(inputId, suggestionsId) {
        const input = document.getElementById(inputId);
        const suggestionsEl = document.getElementById(suggestionsId);

        input.addEventListener('input', () => {
            if (!this.state.selectedCity) return;

            const query = input.value.trim();
            if (query.length < 2) {
                suggestionsEl.classList.remove('active');
                return;
            }

            const results = MapModule.searchLandmarks(this.state.selectedCity, query);
            if (results.length === 0) {
                suggestionsEl.classList.remove('active');
                return;
            }

            suggestionsEl.innerHTML = '';
            results.forEach(lm => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = lm.name;
                item.addEventListener('click', () => {
                    input.value = lm.name;
                    suggestionsEl.classList.remove('active');

                    if (inputId === 'pickup') {
                        MapModule.setPickupFromLandmark(this.state.selectedCity, lm.name);
                    } else {
                        MapModule.setDropoffFromLandmark(this.state.selectedCity, lm.name);
                    }
                });
                suggestionsEl.appendChild(item);
            });

            suggestionsEl.classList.add('active');
        });

        // Close suggestions on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.input-group')) {
                suggestionsEl.classList.remove('active');
            }
        });
    },

    /**
     * Select a city
     */
    selectCity(cityKey) {
        this.state.selectedCity = cityKey;
        this.state.distance = null;
        this.state.duration = null;

        // Update UI
        document.querySelectorAll('.city-card').forEach(card => {
            card.classList.toggle('active', card.dataset.city === cityKey);
        });

        // Clear inputs
        document.getElementById('pickup').value = '';
        document.getElementById('dropoff').value = '';
        document.getElementById('distanceValue').textContent = '--';
        document.getElementById('durationValue').textContent = '--';

        // Initialize map for selected city
        MapModule.init(cityKey);

        // Recalculate (will show empty state)
        this.recalculate();

        // Scroll to route section
        document.querySelector('.route-selection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Select a vehicle type
     */
    selectVehicle(vehicleKey) {
        this.state.selectedVehicle = vehicleKey;

        document.querySelectorAll('.vehicle-card').forEach(card => {
            card.classList.toggle('active', card.dataset.vehicle === vehicleKey);
        });

        this.recalculate();
    },

    /**
     * Update route info display
     */
    updateRouteInfo() {
        const distEl = document.getElementById('distanceValue');
        const durEl = document.getElementById('durationValue');

        if (this.state.distance) {
            distEl.textContent = `${this.state.distance} km`;
        } else {
            distEl.textContent = '--';
        }

        if (this.state.duration) {
            durEl.textContent = `${this.state.duration} min`;
        } else {
            durEl.textContent = '--';
        }
    },

    /**
     * Recalculate all prices
     */
    recalculate() {
        const breakdown = document.getElementById('priceBreakdown');
        const providerSection = document.getElementById('providerSection');

        // Need all inputs
        if (!this.state.selectedCity || !this.state.selectedVehicle || !this.state.distance) {
            breakdown.innerHTML = `
                <div class="price-empty">
                    <p>Select a city, set your route, and choose a vehicle to see price estimates</p>
                </div>
            `;
            providerSection.style.display = 'none';
            return;
        }

        // Calculate price
        const result = PricingEngine.calculate({
            city: this.state.selectedCity,
            vehicle: this.state.selectedVehicle,
            distanceKm: this.state.distance,
            durationMin: this.state.duration,
            options: this.state.options
        });

        if (!result) return;

        // Build breakdown HTML
        let html = '';

        html += this.priceLineHTML('Base fare', `${result.baseFare} MAD`);
        html += this.priceLineHTML(`Distance (${this.state.distance} km)`, `${result.distanceCost} MAD`);
        html += this.priceLineHTML(`Time (~${this.state.duration} min)`, `${result.timeCost} MAD`);

        if (result.cityMultiplier !== 1.0) {
            const label = result.cityMultiplier > 1 ? 'City premium' : 'City discount';
            html += this.priceLineHTML(label, `x${result.cityMultiplier}`);
        }

        html += `<div class="price-line subtotal">
            <span class="price-line-label">Subtotal</span>
            <span class="price-line-value">${result.subtotal} MAD</span>
        </div>`;

        if (result.nightSurcharge > 0) {
            html += this.priceLineHTML('Night surcharge (+30%)', `+${result.nightSurcharge} MAD`);
        }
        if (result.peakSurcharge > 0) {
            html += this.priceLineHTML('Peak hours (+20%)', `+${result.peakSurcharge} MAD`);
        }
        if (result.acCharge > 0) {
            html += this.priceLineHTML('Air conditioning', `+${result.acCharge} MAD`);
        }
        if (result.luggageCharge > 0) {
            html += this.priceLineHTML('Luggage', `+${result.luggageCharge} MAD`);
        }

        html += `
            <div class="price-total">
                <span class="price-total-label">Estimated Total</span>
                <span class="price-total-value">
                    ${result.total}
                    <span class="price-total-currency">MAD</span>
                </span>
            </div>
        `;

        html += `
            <div class="price-range">
                Typical range: <strong>${result.lowEstimate} - ${result.highEstimate} MAD</strong>
            </div>
        `;

        // Add tip
        const tip = PricingEngine.getTip(result.total, this.state.selectedVehicle);
        html += `
            <div class="price-tip">
                <span>💡</span>
                <span>${tip}</span>
            </div>
        `;

        breakdown.innerHTML = html;

        // Provider comparison
        this.renderProviders();

        // Scroll to results
        document.getElementById('priceResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Render provider comparison
     */
    renderProviders() {
        const section = document.getElementById('providerSection');
        const grid = document.getElementById('providerGrid');

        if (!this.state.selectedCity || !this.state.distance) {
            section.style.display = 'none';
            return;
        }

        const providers = PricingEngine.getProviderPrices(
            this.state.selectedCity,
            this.state.distance,
            this.state.duration,
            this.state.options
        );

        if (providers.length === 0) {
            section.style.display = 'none';
            return;
        }

        section.style.display = 'block';
        grid.innerHTML = '';

        providers.forEach(p => {
            const card = document.createElement('div');
            card.className = `provider-card${p.cheapest ? ' cheapest' : ''}`;

            const initials = p.name.substring(0, 2).toUpperCase();

            card.innerHTML = `
                <div class="provider-left">
                    <div class="provider-logo" style="background: ${p.color};">
                        ${initials}
                    </div>
                    <div class="provider-info">
                        <span class="provider-name">${p.name}</span>
                        <span class="provider-eta">ETA: ~${p.eta} min</span>
                    </div>
                </div>
                <div class="provider-right">
                    <span class="provider-price">${p.price} MAD</span>
                    ${p.cheapest ? '<span class="provider-badge">Best Price</span>' : ''}
                </div>
            `;

            grid.appendChild(card);
        });
    },

    /**
     * Helper to create a price line
     */
    priceLineHTML(label, value) {
        return `
            <div class="price-line">
                <span class="price-line-label">${label}</span>
                <span class="price-line-value">${value}</span>
            </div>
        `;
    },

    /**
     * Auto-detect time-based options
     */
    autoDetectTimeOptions() {
        const hour = new Date().getHours();

        // Night: 10 PM - 6 AM
        if (hour >= 22 || hour < 6) {
            document.getElementById('nightRide').checked = true;
            this.state.options.nightRide = true;
        }

        // Peak: 7-9 AM or 5-7 PM
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
            document.getElementById('peakHours').checked = true;
            this.state.options.peakHours = true;
        }
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
