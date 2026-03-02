/**
 * Morocco Cities Data
 * Includes coordinates, landmarks, and city-specific pricing multipliers
 */
const CITIES = {
    casablanca: {
        name: 'Casablanca',
        nameAr: 'الدار البيضاء',
        emoji: '🏙️',
        center: [33.5731, -7.5898],
        zoom: 12,
        multiplier: 1.0,
        landmarks: [
            { name: 'Hassan II Mosque', coords: [33.6086, -7.6322] },
            { name: 'Casa Voyageurs Station', coords: [33.5886, -7.5911] },
            { name: 'Mohammed V Airport', coords: [33.3675, -7.5898] },
            { name: 'Morocco Mall', coords: [33.5486, -7.6572] },
            { name: 'Maarif', coords: [33.5761, -7.6319] },
            { name: 'Ain Diab', coords: [33.5920, -7.6694] },
            { name: 'Anfa Place', coords: [33.5888, -7.6522] },
            { name: 'Derb Sultan', coords: [33.5788, -7.6050] },
            { name: 'Casa Port Station', coords: [33.6020, -7.6170] },
            { name: 'Twin Center', coords: [33.5797, -7.6340] },
            { name: 'Habous Quarter', coords: [33.5770, -7.5960] },
            { name: 'Central Market', coords: [33.5930, -7.6150] }
        ]
    },
    rabat: {
        name: 'Rabat',
        nameAr: 'الرباط',
        emoji: '🏛️',
        center: [34.0209, -6.8416],
        zoom: 13,
        multiplier: 0.95,
        landmarks: [
            { name: 'Hassan Tower', coords: [34.0245, -6.8235] },
            { name: 'Rabat Ville Station', coords: [34.0180, -6.8370] },
            { name: 'Rabat Agdal Station', coords: [33.9920, -6.8490] },
            { name: 'Chellah', coords: [34.0096, -6.8174] },
            { name: 'Kasbah of Udayas', coords: [34.0320, -6.8340] },
            { name: 'Rabat Zoo', coords: [33.9580, -6.8260] },
            { name: 'Souissi', coords: [33.9800, -6.8530] },
            { name: 'Hay Riad', coords: [33.9620, -6.8710] },
            { name: 'Mega Mall', coords: [33.9710, -6.8650] },
            { name: 'Medina Rabat', coords: [34.0260, -6.8350] }
        ]
    },
    marrakech: {
        name: 'Marrakech',
        nameAr: 'مراكش',
        emoji: '🕌',
        center: [31.6295, -7.9811],
        zoom: 13,
        multiplier: 1.1,
        landmarks: [
            { name: 'Jemaa el-Fnaa', coords: [31.6258, -7.9891] },
            { name: 'Marrakech Station', coords: [31.6341, -8.0150] },
            { name: 'Menara Airport', coords: [31.6069, -8.0363] },
            { name: 'Majorelle Garden', coords: [31.6417, -8.0032] },
            { name: 'Koutoubia Mosque', coords: [31.6239, -7.9938] },
            { name: 'Bahia Palace', coords: [31.6216, -7.9830] },
            { name: 'Gueliz', coords: [31.6370, -8.0080] },
            { name: 'Menara Gardens', coords: [31.6180, -8.0220] },
            { name: 'Hivernage', coords: [31.6270, -8.0100] },
            { name: 'Palmeraie', coords: [31.6650, -7.9650] }
        ]
    },
    fes: {
        name: 'Fes',
        nameAr: 'فاس',
        emoji: '🏺',
        center: [34.0331, -5.0003],
        zoom: 13,
        multiplier: 0.85,
        landmarks: [
            { name: 'Bab Boujloud', coords: [34.0627, -4.9818] },
            { name: 'Fes Station', coords: [34.0390, -5.0150] },
            { name: 'Fes Saiss Airport', coords: [33.9273, -4.9779] },
            { name: 'Al Quaraouiyine', coords: [34.0639, -4.9734] },
            { name: 'Borj Nord', coords: [34.0670, -4.9860] },
            { name: 'Royal Palace Fes', coords: [34.0570, -4.9760] },
            { name: 'Ville Nouvelle', coords: [34.0350, -5.0020] },
            { name: 'Fes Medina', coords: [34.0610, -4.9780] },
            { name: 'Merenides Tombs', coords: [34.0700, -4.9780] },
            { name: 'Borj Sud', coords: [34.0580, -4.9850] }
        ]
    },
    tangier: {
        name: 'Tangier',
        nameAr: 'طنجة',
        emoji: '⛴️',
        center: [35.7595, -5.8340],
        zoom: 13,
        multiplier: 0.9,
        landmarks: [
            { name: 'Tangier Port', coords: [35.7870, -5.8060] },
            { name: 'Tangier Ville Station', coords: [35.7690, -5.8100] },
            { name: 'Ibn Battouta Airport', coords: [35.7269, -5.9168] },
            { name: 'Cape Spartel', coords: [35.7912, -5.9208] },
            { name: 'Grand Socco', coords: [35.7831, -5.8124] },
            { name: 'Tangier Marina Bay', coords: [35.7880, -5.7980] },
            { name: 'Kasbah Museum', coords: [35.7880, -5.8100] },
            { name: 'Tanger City Mall', coords: [35.7590, -5.8230] },
            { name: 'Malabata', coords: [35.7930, -5.7730] },
            { name: 'Médina Tangier', coords: [35.7850, -5.8110] }
        ]
    },
    agadir: {
        name: 'Agadir',
        nameAr: 'أكادير',
        emoji: '🏖️',
        center: [30.4278, -9.5981],
        zoom: 13,
        multiplier: 0.88,
        landmarks: [
            { name: 'Agadir Beach', coords: [30.4230, -9.6130] },
            { name: 'Agadir Al Massira Airport', coords: [30.3253, -9.4131] },
            { name: 'Souk El Had', coords: [30.4290, -9.5950] },
            { name: 'Agadir Oufella', coords: [30.4370, -9.6210] },
            { name: 'Marina Agadir', coords: [30.4130, -9.6230] },
            { name: 'Crocoparc', coords: [30.3720, -9.5350] },
            { name: 'Amazigh Heritage Museum', coords: [30.4270, -9.5970] },
            { name: 'Nouveau Talborjt', coords: [30.4230, -9.5980] }
        ]
    },
    meknes: {
        name: 'Meknes',
        nameAr: 'مكناس',
        emoji: '🏰',
        center: [33.8935, -5.5473],
        zoom: 13,
        multiplier: 0.8,
        landmarks: [
            { name: 'Bab Mansour', coords: [33.8932, -5.5632] },
            { name: 'Meknes Station', coords: [33.8870, -5.5430] },
            { name: 'Royal Palace Meknes', coords: [33.8880, -5.5670] },
            { name: 'Heri es-Souani', coords: [33.8820, -5.5590] },
            { name: 'Lahdim Square', coords: [33.8940, -5.5630] },
            { name: 'Mausoleum Moulay Ismail', coords: [33.8890, -5.5650] },
            { name: 'Medina Meknes', coords: [33.8930, -5.5620] },
            { name: 'Ville Nouvelle Meknes', coords: [33.8900, -5.5400] }
        ]
    },
    oujda: {
        name: 'Oujda',
        nameAr: 'وجدة',
        emoji: '🌄',
        center: [34.6814, -1.9086],
        zoom: 13,
        multiplier: 0.78,
        landmarks: [
            { name: 'Oujda Station', coords: [34.6840, -1.9100] },
            { name: 'Oujda Angads Airport', coords: [34.7872, -1.9239] },
            { name: 'Parc Lalla Aicha', coords: [34.6830, -1.9090] },
            { name: 'Bab Sidi Abdelwahab', coords: [34.6850, -1.9120] },
            { name: 'Medina Oujda', coords: [34.6860, -1.9100] },
            { name: 'University of Oujda', coords: [34.6560, -1.9400] }
        ]
    },
    kenitra: {
        name: 'Kenitra',
        nameAr: 'القنيطرة',
        emoji: '🌊',
        center: [34.2610, -6.5802],
        zoom: 13,
        multiplier: 0.82,
        landmarks: [
            { name: 'Kenitra Station', coords: [34.2640, -6.5760] },
            { name: 'Mehdia Beach', coords: [34.2540, -6.6700] },
            { name: 'Kenitra Center', coords: [34.2610, -6.5800] },
            { name: 'La Mamora Forest', coords: [34.2800, -6.5600] }
        ]
    },
    tetouan: {
        name: 'Tetouan',
        nameAr: 'تطوان',
        emoji: '🏔️',
        center: [35.5785, -5.3684],
        zoom: 13,
        multiplier: 0.83,
        landmarks: [
            { name: 'Tetouan Medina', coords: [35.5710, -5.3680] },
            { name: 'Place Hassan II', coords: [35.5740, -5.3660] },
            { name: 'Royal Palace Tetouan', coords: [35.5700, -5.3690] },
            { name: 'Martil Beach', coords: [35.6170, -5.2740] },
            { name: 'Tamuda Bay', coords: [35.6430, -5.2540] }
        ]
    }
};

/**
 * Vehicle types with base pricing
 */
const VEHICLES = {
    petit_taxi: {
        name: 'Petit Taxi',
        icon: '🚕',
        capacity: '1-3 passengers',
        baseFare: 7,      // MAD
        perKm: 3.5,       // MAD per km
        perMinute: 0.5,   // MAD per minute waiting
        minFare: 7,
        description: 'City taxi, short distances'
    },
    grand_taxi: {
        name: 'Grand Taxi',
        icon: '🚖',
        capacity: '1-6 passengers',
        baseFare: 10,
        perKm: 2.5,
        perMinute: 0.3,
        minFare: 10,
        description: 'Shared or private, longer routes'
    },
    indriver: {
        name: 'InDriver',
        icon: '📱',
        capacity: '1-4 passengers',
        baseFare: 5,
        perKm: 4.0,
        perMinute: 0.6,
        minFare: 10,
        description: 'Negotiate your price'
    },
    careem: {
        name: 'Careem',
        icon: '🟢',
        capacity: '1-4 passengers',
        baseFare: 8,
        perKm: 4.5,
        perMinute: 0.7,
        minFare: 12,
        description: 'Premium app-based rides'
    },
    heetch: {
        name: 'Heetch',
        icon: '🟣',
        capacity: '1-4 passengers',
        baseFare: 6,
        perKm: 3.8,
        perMinute: 0.5,
        minFare: 10,
        description: 'Affordable app-based rides'
    },
    premium: {
        name: 'Premium',
        icon: '🚘',
        capacity: '1-4 passengers',
        baseFare: 15,
        perKm: 6.0,
        perMinute: 1.0,
        minFare: 25,
        description: 'Luxury vehicles'
    }
};

/**
 * Ride-hailing providers active in Morocco
 */
const PROVIDERS = {
    indriver: {
        name: 'InDriver',
        color: '#2ECC40',
        available: ['casablanca', 'rabat', 'marrakech', 'fes', 'tangier', 'agadir', 'meknes', 'oujda', 'kenitra', 'tetouan'],
        priceMultiplier: 0.92,
        etaRange: [3, 8]
    },
    careem: {
        name: 'Careem',
        color: '#00B140',
        available: ['casablanca', 'rabat', 'marrakech', 'tangier', 'agadir'],
        priceMultiplier: 1.05,
        etaRange: [4, 10]
    },
    heetch: {
        name: 'Heetch',
        color: '#7B2D8E',
        available: ['casablanca', 'rabat', 'marrakech', 'fes', 'tangier', 'agadir'],
        priceMultiplier: 0.95,
        etaRange: [3, 7]
    },
    yango: {
        name: 'Yango',
        color: '#FF4444',
        available: ['casablanca', 'rabat'],
        priceMultiplier: 0.98,
        etaRange: [5, 12]
    },
    petit_taxi: {
        name: 'Petit Taxi',
        color: '#E63946',
        available: ['casablanca', 'rabat', 'marrakech', 'fes', 'tangier', 'agadir', 'meknes', 'oujda', 'kenitra', 'tetouan'],
        priceMultiplier: 1.0,
        etaRange: [1, 5]
    }
};
