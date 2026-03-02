/**
 * Pricing Engine for Ride-Hailing in Morocco
 */
const PricingEngine = {
    /**
     * Calculate the price for a ride
     */
    calculate(params) {
        const { city, vehicle, distanceKm, durationMin, options } = params;

        if (!city || !vehicle || !distanceKm) return null;

        const cityData = CITIES[city];
        const vehicleData = VEHICLES[vehicle];
        if (!cityData || !vehicleData) return null;

        // Base calculation
        let baseFare = vehicleData.baseFare;
        let distanceCost = distanceKm * vehicleData.perKm;
        let timeCost = (durationMin || distanceKm * 3) * vehicleData.perMinute;

        // City multiplier (some cities are cheaper/more expensive)
        const cityMultiplier = cityData.multiplier;

        // Subtotal before extras
        let subtotal = (baseFare + distanceCost + timeCost) * cityMultiplier;

        // Options
        let nightSurcharge = 0;
        let peakSurcharge = 0;
        let acCharge = 0;
        let luggageCharge = 0;

        if (options.nightRide) {
            nightSurcharge = subtotal * 0.30;
        }

        if (options.peakHours) {
            peakSurcharge = subtotal * 0.20;
        }

        if (options.acRequired) {
            acCharge = 5;
        }

        if (options.luggage) {
            luggageCharge = 10;
        }

        let total = subtotal + nightSurcharge + peakSurcharge + acCharge + luggageCharge;

        // Apply minimum fare
        total = Math.max(total, vehicleData.minFare);

        // Round to nearest 0.5 MAD
        total = Math.round(total * 2) / 2;

        return {
            baseFare: this.round(baseFare),
            distanceCost: this.round(distanceCost),
            timeCost: this.round(timeCost),
            cityMultiplier,
            subtotal: this.round(subtotal),
            nightSurcharge: this.round(nightSurcharge),
            peakSurcharge: this.round(peakSurcharge),
            acCharge,
            luggageCharge,
            total: this.round(total),
            lowEstimate: this.round(total * 0.85),
            highEstimate: this.round(total * 1.2),
            currency: 'MAD'
        };
    },

    /**
     * Calculate prices for all available providers in a city
     */
    getProviderPrices(city, distanceKm, durationMin, options) {
        const results = [];

        for (const [key, provider] of Object.entries(PROVIDERS)) {
            if (!provider.available.includes(city)) continue;

            // Use the base vehicle type for the provider
            let vehicleType = 'petit_taxi';
            if (key === 'indriver') vehicleType = 'indriver';
            else if (key === 'careem') vehicleType = 'careem';
            else if (key === 'heetch') vehicleType = 'heetch';

            const basePrice = this.calculate({
                city,
                vehicle: vehicleType,
                distanceKm,
                durationMin,
                options
            });

            if (!basePrice) continue;

            const adjustedTotal = this.round(basePrice.total * provider.priceMultiplier);
            const etaMin = provider.etaRange[0];
            const etaMax = provider.etaRange[1];
            const eta = Math.floor(Math.random() * (etaMax - etaMin + 1)) + etaMin;

            results.push({
                key,
                name: provider.name,
                color: provider.color,
                price: adjustedTotal,
                lowPrice: this.round(adjustedTotal * 0.88),
                highPrice: this.round(adjustedTotal * 1.15),
                eta: eta,
                currency: 'MAD'
            });
        }

        // Sort by price (cheapest first)
        results.sort((a, b) => a.price - b.price);

        // Mark cheapest
        if (results.length > 0) {
            results[0].cheapest = true;
        }

        return results;
    },

    /**
     * Estimate duration from distance (average city speed ~25 km/h)
     */
    estimateDuration(distanceKm) {
        const avgSpeedKmH = 25;
        const minutes = (distanceKm / avgSpeedKmH) * 60;
        return Math.round(minutes);
    },

    /**
     * Format price for display
     */
    formatPrice(amount) {
        return amount.toFixed(1);
    },

    /**
     * Round to one decimal
     */
    round(value) {
        return Math.round(value * 10) / 10;
    },

    /**
     * Get a negotiation tip based on the calculated price
     */
    getTip(total, vehicle) {
        if (vehicle === 'petit_taxi') {
            return 'Always insist the driver uses the meter (compteur). It is your legal right in Morocco.';
        }
        if (vehicle === 'grand_taxi') {
            const perSeat = Math.round(total / 6);
            return `For shared Grand Taxi, you can expect ~${perSeat} MAD per seat. Private hire costs the full amount.`;
        }
        if (vehicle === 'indriver') {
            const suggest = Math.round(total * 0.85);
            return `Start your offer around ${suggest} MAD and negotiate from there. Most drivers accept within 10-15% of the app estimate.`;
        }
        return `Compare prices across apps before booking for the best deal.`;
    }
};
