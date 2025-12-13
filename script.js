const items = [
    { name: 'Surg-E', itemsPerPack: 5, icon: '⚕️', isSpecial: false },
    { name: 'Surgical Stitches', itemsPerPack: 20, icon: '🧵', isSpecial: true },
    { name: 'Surgical Antibiotics', itemsPerPack: 20, icon: '💊', isSpecial: false },
    { name: 'Surgical Anesthetic', itemsPerPack: 20, icon: '💉', isSpecial: false },
    { name: 'Surgical Scalpel', itemsPerPack: 20, icon: '🔪', isSpecial: false },
    { name: 'Surgical Sponge', itemsPerPack: 20, icon: '🟨', isSpecial: false },
    { name: 'Surgical Antiseptic', itemsPerPack: 20, icon: '🧴', isSpecial: false },
    { name: 'Surgical Clamp', itemsPerPack: 20, icon: '🔧', isSpecial: false },
    { name: 'Surgical Defibrillator', itemsPerPack: 20, icon: '💔', isSpecial: false },
    { name: 'Surgical Lab Kit', itemsPerPack: 20, icon: '🧪', isSpecial: false },
    { name: 'Surgical Pins', itemsPerPack: 20, icon: '📌', isSpecial: false },
    { name: 'Surgical Splint', itemsPerPack: 20, icon: '🦴', isSpecial: false },
    { name: 'Surgical Transfusion', itemsPerPack: 20, icon: '🩸', isSpecial: false },
    { name: 'Surgical Ultrasound', itemsPerPack: 20, icon: '📡', isSpecial: false },
];

const state = {
    prices: {},
    unitTypes: {},
    stitchesPerWL: 0,
    stitchesUnit: 'per'
};

// Initialize state
items.forEach(item => {
    state.prices[item.name] = 0;
    state.unitTypes[item.name] = 'per';
});

// Initialize DOM
function initializeItems() {
    const container = document.getElementById('itemsContainer');
    container.innerHTML = '';

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-card';
        
        const inputId = item.isSpecial ? 'stitches-input' : `price-${item.name}`;
        const inputClass = item.isSpecial ? 'stitches-input' : 'price-input';
        const currentUnit = item.isSpecial ? state.stitchesUnit : state.unitTypes[item.name];
        
        div.innerHTML = `
            <div class="item-header">
                <span class="item-icon">${item.icon}</span>
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>${item.itemsPerPack} total</p>
                </div>
            </div>
            <label class="item-label">Price</label>
            <div class="item-input-wrapper">
                <input 
                    type="number" 
                    id="${inputId}" 
                    class="${inputClass}" 
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

    attachEventListeners();
}

function attachEventListeners() {
    // Price inputs
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.prices[e.target.dataset.item] = parseFloat(e.target.value) || 0;
            updateCalculations();
        });
    });

    // Stitches input
    document.querySelectorAll('.stitches-input').forEach(input => {
        input.addEventListener('input', (e) => {
            state.stitchesPerWL = parseFloat(e.target.value) || 0;
            updateCalculations();
        });
    });

    // Unit toggles
    document.querySelectorAll('.unit-text').forEach(span => {
        span.addEventListener('click', (e) => {
            const itemName = e.target.closest('.unit-text').dataset.item;
            
            if (itemName === 'Surgical Stitches') {
                state.stitchesUnit = state.stitchesUnit === 'per' ? 'each' : 'per';
            } else {
                state.unitTypes[itemName] = state.unitTypes[itemName] === 'per' ? 'each' : 'per';
            }
            
            const newUnit = itemName === 'Surgical Stitches' ? state.stitchesUnit : state.unitTypes[itemName];
            e.target.closest('.unit-text').innerHTML = `${newUnit} <span class="unit-arrow">▼</span>`;
            
            updateCalculations();
        });
    });
}

function updateCalculations() {
    const numPacks = parseFloat(document.getElementById('numPacks').value) || 1;
    const costPerPack = parseFloat(document.getElementById('costPerPack').value) || 0;

    let totalRevenuePerPack = 0;

    items.forEach(item => {
        if (item.isSpecial) {
            if (state.stitchesUnit === 'per') {
                const revenuePerPack = (item.itemsPerPack / 200) * state.stitchesPerWL;
                totalRevenuePerPack += revenuePerPack;
            } else {
                const revenuePerPack = item.itemsPerPack * state.stitchesPerWL;
                totalRevenuePerPack += revenuePerPack;
            }
        } else {
            const unit = state.unitTypes[item.name];
            if (unit === 'per') {
                const itemsPerWL = state.prices[item.name];
                if (itemsPerWL > 0) {
                    const revenuePerPack = item.itemsPerPack / itemsPerWL;
                    totalRevenuePerPack += revenuePerPack;
                }
            } else {
                const revenuePerPack = item.itemsPerPack * state.prices[item.name];
                totalRevenuePerPack += revenuePerPack;
            }
        }
    });

    const totalRevenue = totalRevenuePerPack * numPacks;
    const totalCost = numPacks * costPerPack;
    const netProfit = totalRevenue - totalCost;
    const profitPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

    // Update displays
    document.getElementById('totalCost').textContent = totalCost.toFixed(0);
    document.getElementById('totalRevenue').textContent = totalRevenue.toFixed(0);
    document.getElementById('netProfit').textContent = netProfit.toFixed(0);
    document.getElementById('profitPercentage').textContent = profitPercentage.toFixed(1);

    // Update badges
    const profitBadge = document.getElementById('profitBadge');
    const percentageBadge = document.getElementById('percentageBadge');
    
    profitBadge.className = netProfit < 0 ? 'profit-badge negative' : 'profit-badge';
    profitBadge.textContent = `${netProfit >= 0 ? '+' : ''}${netProfit.toFixed(0)} WL`;

    percentageBadge.className = profitPercentage < 0 ? 'profit-badge negative' : 'profit-badge';
    percentageBadge.textContent = `${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toFixed(1)}%`;
}

// Main inputs listeners
document.getElementById('numPacks').addEventListener('input', updateCalculations);
document.getElementById('costPerPack').addEventListener('input', updateCalculations);

// Initialize
initializeItems();
updateCalculations();