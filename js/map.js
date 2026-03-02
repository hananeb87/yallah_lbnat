/**
 * Map Module - Leaflet-based interactive map
 */
const MapModule = {
    map: null,
    pickupMarker: null,
    dropoffMarker: null,
    routeLine: null,
    clickMode: 'pickup', // 'pickup' or 'dropoff'
    landmarkMarkers: [],

    /**
     * Initialize the map centered on a city
     */
    init(cityKey) {
        const city = CITIES[cityKey];
        if (!city) return;

        // Destroy existing map if any
        if (this.map) {
            this.map.remove();
            this.map = null;
        }

        this.map = L.map('map', {
            zoomControl: true,
            attributionControl: true
        }).setView(city.center, city.zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(this.map);

        // Add landmarks as small markers
        this.addLandmarks(cityKey);

        // Click handler
        this.map.on('click', (e) => this.onMapClick(e));

        // Reset markers
        this.pickupMarker = null;
        this.dropoffMarker = null;
        this.routeLine = null;
        this.clickMode = 'pickup';
        this.updateHint();
    },

    /**
     * Add landmark markers to the map
     */
    addLandmarks(cityKey) {
        // Clear existing
        this.landmarkMarkers.forEach(m => m.remove());
        this.landmarkMarkers = [];

        const city = CITIES[cityKey];
        if (!city) return;

        city.landmarks.forEach(lm => {
            const marker = L.circleMarker(lm.coords, {
                radius: 5,
                fillColor: '#457b9d',
                color: '#1d3557',
                weight: 1,
                fillOpacity: 0.6
            }).addTo(this.map);

            marker.bindTooltip(lm.name, {
                direction: 'top',
                offset: [0, -8],
                className: 'landmark-tooltip'
            });

            // Clicking a landmark sets it as current point
            marker.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                this.setPoint(lm.coords, lm.name);
            });

            this.landmarkMarkers.push(marker);
        });
    },

    /**
     * Handle map click
     */
    onMapClick(e) {
        this.setPoint([e.latlng.lat, e.latlng.lng], null);
    },

    /**
     * Set a pickup or dropoff point
     */
    setPoint(coords, name) {
        const pickupIcon = L.divIcon({
            html: '<div style="background:#2a9d8f;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            className: ''
        });

        const dropoffIcon = L.divIcon({
            html: '<div style="background:#e63946;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            className: ''
        });

        if (this.clickMode === 'pickup') {
            if (this.pickupMarker) this.pickupMarker.remove();
            this.pickupMarker = L.marker(coords, { icon: pickupIcon, draggable: true })
                .addTo(this.map)
                .bindPopup(name ? `<b>Pickup:</b> ${name}` : '<b>Pickup Point</b>');

            this.pickupMarker.on('dragend', () => this.onMarkerDrag());

            // Update input
            const pickupInput = document.getElementById('pickup');
            pickupInput.value = name || `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;

            // Dispatch event
            document.dispatchEvent(new CustomEvent('pickup-set', { detail: { coords, name } }));

            this.clickMode = 'dropoff';
        } else {
            if (this.dropoffMarker) this.dropoffMarker.remove();
            this.dropoffMarker = L.marker(coords, { icon: dropoffIcon, draggable: true })
                .addTo(this.map)
                .bindPopup(name ? `<b>Drop-off:</b> ${name}` : '<b>Drop-off Point</b>');

            this.dropoffMarker.on('dragend', () => this.onMarkerDrag());

            // Update input
            const dropoffInput = document.getElementById('dropoff');
            dropoffInput.value = name || `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;

            // Dispatch event
            document.dispatchEvent(new CustomEvent('dropoff-set', { detail: { coords, name } }));

            this.clickMode = 'pickup';
        }

        this.updateHint();
        this.drawRoute();
    },

    /**
     * Handle marker drag
     */
    onMarkerDrag() {
        if (this.pickupMarker) {
            const pos = this.pickupMarker.getLatLng();
            document.getElementById('pickup').value = `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
        }
        if (this.dropoffMarker) {
            const pos = this.dropoffMarker.getLatLng();
            document.getElementById('dropoff').value = `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
        }
        this.drawRoute();
    },

    /**
     * Draw route line between pickup and dropoff
     */
    drawRoute() {
        if (this.routeLine) {
            this.routeLine.remove();
            this.routeLine = null;
        }

        if (!this.pickupMarker || !this.dropoffMarker) return;

        const p1 = this.pickupMarker.getLatLng();
        const p2 = this.dropoffMarker.getLatLng();

        this.routeLine = L.polyline([p1, p2], {
            color: '#e63946',
            weight: 4,
            opacity: 0.7,
            dashArray: '8, 8'
        }).addTo(this.map);

        // Fit bounds to show both points
        const bounds = L.latLngBounds([p1, p2]);
        this.map.fitBounds(bounds, { padding: [50, 50] });

        // Calculate distance
        const distance = this.calculateDistance(p1, p2);
        const duration = PricingEngine.estimateDuration(distance);

        document.dispatchEvent(new CustomEvent('route-calculated', {
            detail: { distance, duration }
        }));
    },

    /**
     * Calculate distance between two points using Haversine formula
     * Returns distance in km with a city-driving adjustment factor
     */
    calculateDistance(p1, p2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(p2.lat - p1.lat);
        const dLng = this.toRad(p2.lng - p1.lng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRad(p1.lat)) * Math.cos(this.toRad(p2.lat)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const straightLine = R * c;

        // City driving factor: roads are ~1.35x longer than straight line
        const cityDrivingFactor = 1.35;
        return Math.round(straightLine * cityDrivingFactor * 10) / 10;
    },

    toRad(deg) {
        return deg * (Math.PI / 180);
    },

    /**
     * Swap pickup and dropoff
     */
    swapPoints() {
        if (!this.pickupMarker || !this.dropoffMarker) return;

        const pPos = this.pickupMarker.getLatLng();
        const dPos = this.dropoffMarker.getLatLng();

        const pName = document.getElementById('pickup').value;
        const dName = document.getElementById('dropoff').value;

        // Remove and recreate with swapped positions
        this.pickupMarker.remove();
        this.dropoffMarker.remove();
        this.pickupMarker = null;
        this.dropoffMarker = null;

        this.clickMode = 'pickup';
        this.setPoint([dPos.lat, dPos.lng], dName);
        this.setPoint([pPos.lat, pPos.lng], pName);
    },

    /**
     * Set pickup from landmark by name
     */
    setPickupFromLandmark(cityKey, landmarkName) {
        const city = CITIES[cityKey];
        if (!city) return;

        const lm = city.landmarks.find(l => l.name === landmarkName);
        if (!lm) return;

        this.clickMode = 'pickup';
        this.setPoint(lm.coords, lm.name);
    },

    /**
     * Set dropoff from landmark by name
     */
    setDropoffFromLandmark(cityKey, landmarkName) {
        const city = CITIES[cityKey];
        if (!city) return;

        const lm = city.landmarks.find(l => l.name === landmarkName);
        if (!lm) return;

        this.clickMode = 'dropoff';
        this.setPoint(lm.coords, lm.name);
    },

    /**
     * Get landmarks for search suggestions
     */
    searchLandmarks(cityKey, query) {
        const city = CITIES[cityKey];
        if (!city || !query) return [];

        const q = query.toLowerCase();
        return city.landmarks.filter(lm =>
            lm.name.toLowerCase().includes(q)
        );
    },

    /**
     * Update map hint text
     */
    updateHint() {
        const hint = document.getElementById('mapHint');
        if (!hint) return;

        if (!this.pickupMarker) {
            hint.textContent = 'Click on the map to set your pickup point';
            hint.style.opacity = '1';
        } else if (!this.dropoffMarker) {
            hint.textContent = 'Now click to set your drop-off point';
            hint.style.opacity = '1';
        } else {
            hint.style.opacity = '0';
        }
    },

    /**
     * Use browser geolocation
     */
    locateUser() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = [position.coords.latitude, position.coords.longitude];
                this.clickMode = 'pickup';
                this.setPoint(coords, 'My Location');
                this.map.setView(coords, 15);
            },
            () => {
                alert('Unable to retrieve your location');
            }
        );
    }
};
