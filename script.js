const surgeryItems = [
    { name: 'Surg-E', itemsPerPack: 5, icon: 'Surg-E.webp' },
    { name: 'Surgical Anesthetic', itemsPerPack: 20, icon: 'Surgical Anesthetic.webp' },
    { name: 'Surgical Antibiotics', itemsPerPack: 20, icon: 'Surgical Antibiotics.webp' },
    { name: 'Surgical Antiseptic', itemsPerPack: 20, icon: 'Surgical Antiseptic.webp' },
    { name: 'Surgical Clamp', itemsPerPack: 20, icon: 'Surgical Clamp.webp' },
    { name: 'Surgical Defibrillator', itemsPerPack: 20, icon: 'Surgical Defibrillator.webp' },
    { name: 'Surgical Lab Kit', itemsPerPack: 20, icon: 'Surgical Lab Kit.webp' },
    { name: 'Surgical Pins', itemsPerPack: 20, icon: 'Surgical Pins.webp' },
    { name: 'Surgical Scalpel', itemsPerPack: 20, icon: 'Surgical Scalpel.webp' },
    { name: 'Surgical Splint', itemsPerPack: 20, icon: 'Surgical Splint.webp' },
    { name: 'Surgical Stitches', itemsPerPack: 20, icon: 'Surgical Stitches.webp' },
    { name: 'Surgical Sponge', itemsPerPack: 20, icon: 'Surgical Sponge.webp' },
    { name: 'Surgical Transfusion', itemsPerPack: 20, icon: 'Surgical Transfusion.webp' },
    { name: 'Surgical Ultrasound', itemsPerPack: 20, icon: 'Surgical Ultrasound.webp' },
];

const doctorTools = [
    { name: 'Stitches', usage: 2.351, icon: 'Surgical Stitches.webp' },
    { name: 'Scalpels', usage: 1.706, icon: 'Surgical Scalpel.webp' },
    { name: 'Sponges', usage: 1.518, icon: 'Surgical Sponge.webp' },
    { name: 'Antibiotics', usage: 1.598, icon: 'Surgical Antibiotics.webp' },
    { name: 'Anesthetic', usage: 1.021, icon: 'Surgical Anesthetic.webp' },
    { name: 'Clamps', usage: 0.05, icon: 'Surgical Clamp.webp' },
    { name: 'Defibrillator', usage: 0.375, icon: 'Surgical Defibrillator.webp' },
    { name: 'Lab Kits', usage: 0.582, icon: 'Surgical Lab Kit.webp' },
    { name: 'Pins', usage: 0.302, icon: 'Surgical Pins.webp' },
    { name: 'Transfusions', usage: 0.309, icon: 'Surgical Transfusion.webp' },
    { name: 'Ultrasounds', usage: 0.788, icon: 'Surgical Ultrasound.webp' },
    { name: 'Splints', usage: 0.712, icon: 'Surgical Splint.webp' },
    { name: 'Antiseptic', usage: 0.079, icon: 'Surgical Antiseptic.webp' },
];

const state = {
    prices: {},
    unitTypes: {}
};

surgeryItems.forEach(item => {
    state.prices[item.name] = 0;
    state.unitTypes[item.name] = 'per';
});

// Page Navigation
document.querySelectorAll('.nav-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const page = e.target.dataset.page;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(page + '-page').classList.add('active');
        document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        if (page === 'profit') {
            initializeProfit();
        } else {
            initializeDoctor();
        }
    });
});

// PROFIT CALCULATOR
function initializeProfit() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    surgeryItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        
        const numPacks = parseFloat(document.getElementById('numPacks').value) || 1;
        const totalItems = item.itemsPerPack * numPacks;
        const currentUnit = state.unitTypes[item.name];
        
        div.innerHTML = `
            <div class="item-header">
                <img src="${item.icon}" alt="${item.name}" class="item-icon">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="item-total">${totalItems} total</p>
                </div>
            </div>
            <label class="item-label">Price</label>
            <div class="item-input-wrapper">
                <input 
                    type="number" 
                    class="price-input" 
                    data-item="${item.name}" 
                    min="0" 
                    value="0" 
                    placeholder="Enter price"
                >
                <span class="unit-text" data-item="${item.name}">
                    ${currentUnit} <span class="unit-arrow">▼</span>
                </span>
            </div>
        `;
        
        container.appendChild(div);
    });

    attachProfitListeners();
}

function attachProfitListeners() {
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('input', updateProfit);
    });

    document.querySelectorAll('.unit-text').forEach(span => {
        span.addEventListener('click', (e) => {
            const itemName = e.currentTarget.dataset.item;
            state.unitTypes[itemName] = state.unitTypes[itemName] === 'per' ? 'each' : 'per';
            e.currentTarget.innerHTML = `${state.unitTypes[itemName]} <span class="unit-arrow">▼</span>`;
            updateProfit();
        });
    });
}

function updateProfit() {
    const numPacks = parseFloat(document.getElementById('numPacks').value) || 1;
    const costPerPack = parseFloat(document.getElementById('costPerPack').value) || 0;

    // Update totals
    document.querySelectorAll('.price-input').forEach(input => {
        state.prices[input.dataset.item] = parseFloat(input.value) || 0;
    });

    // Update item totals
    document.querySelectorAll('.item-total').forEach((el, idx) => {
        el.textContent = (surgeryItems[idx].itemsPerPack * numPacks) + ' total';
    });

    let totalRevenue = 0;

    surgeryItems.forEach(item => {
        const totalItemsInPacks = item.itemsPerPack * numPacks;
        const unit = state.unitTypes[item.name];
        const price = state.prices[item.name];

        if (unit === 'per') {
            if (price > 0) totalRevenue += totalItemsInPacks / price;
        } else {
            totalRevenue += totalItemsInPacks * price;
        }
    });

    const totalCost = numPacks * costPerPack;
    const netProfit = totalRevenue - totalCost;
    const profitPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    document.getElementById('totalCost').textContent = totalCost.toFixed(0);
    document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(0);
    document.getElementById('netProfit').textContent = netProfit.toFixed(0);
    document.getElementById('profitPercentage').textContent = profitPercentage.toFixed(1);

    const profitBadge = document.getElementById('profitBadge');
    profitBadge.className = netProfit < 0 ? 'profit-badge negative' : 'profit-badge';
    profitBadge.textContent = `${netProfit >= 0 ? '+' : ''}${netProfit.toFixed(0)} WL`;

    const percentageBadge = document.getElementById('percentageBadge');
    percentageBadge.className = profitPercentage < 0 ? 'profit-badge negative' : 'profit-badge';
    percentageBadge.textContent = `${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(1)}%`;
}

document.getElementById('numPacks').addEventListener('input', initializeProfit);
document.getElementById('costPerPack').addEventListener('input', updateProfit);

// DOCTOR CALCULATOR
function initializeDoctor() {
    const container = document.getElementById('doctorContainer');
    container.innerHTML = '';

    const numSurgeries = parseInt(document.getElementById('numSurgeries').value) || 1;

    let totalTools = 0;
    doctorTools.forEach(tool => {
        const required = Math.ceil(tool.usage * numSurgeries);
        totalTools += required;

        const div = document.createElement('div');
        div.className = 'doctor-card';
        div.innerHTML = `
            <img src="${tool.icon}" alt="${tool.name}" style="width: 32px; height: 32px; margin-bottom: 8px; object-fit: contain;">
            <div class="doctor-card-title">${tool.name}</div>
            <div class="doctor-card-required"><strong>${required.toLocaleString()}</strong></div>
        `;
        container.appendChild(div);
    });

    document.getElementById('totalSurgeries').textContent = numSurgeries.toLocaleString();
    document.getElementById('totalToolsNeeded').textContent = totalTools.toLocaleString();
}

document.getElementById('numSurgeries').addEventListener('input', (e) => {
    let val = parseInt(e.target.value) || 0;
    if (val < 1) e.target.value = 1;
    if (val > 10000) e.target.value = 10000;
    if (val >= 1 && val <= 10000) initializeDoctor();
});

// Initialize on load
initializeProfit();