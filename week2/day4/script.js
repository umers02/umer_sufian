let billAmount = 0;
let tipPercentage = 0;
let numberOfPeople = 0;

const billInput = document.getElementById('billInput');
const customTipInput = document.getElementById('customTip');
const peopleInput = document.getElementById('peopleInput');
const tipButtons = document.querySelectorAll('.tip-btn');
const tipAmountDisplay = document.getElementById('tipAmount');
const totalAmountDisplay = document.getElementById('totalAmount');
const resetBtn = document.getElementById('resetBtn');

function calculateTip() {
    if (billAmount > 0 && tipPercentage > 0 && numberOfPeople > 0) {
        const tipPerPerson = (billAmount * (tipPercentage / 100)) / numberOfPeople;
        const totalPerPerson = (billAmount / numberOfPeople) + tipPerPerson;
        
        tipAmountDisplay.textContent = `$${tipPerPerson.toFixed(2)}`;
        totalAmountDisplay.textContent = `$${totalPerPerson.toFixed(2)}`;
        resetBtn.disabled = false;
    } else {
        tipAmountDisplay.textContent = '$0.00';
        totalAmountDisplay.textContent = '$0.00';
    }
}

billInput.addEventListener('input', (e) => {
    billAmount = parseFloat(e.target.value) || 0;
    calculateTip();
});

tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        tipButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-dark-cyan'));
        tipButtons.forEach(btn => btn.classList.add('bg-dark-cyan', 'text-white'));
        
        button.classList.remove('bg-dark-cyan', 'text-white');
        button.classList.add('bg-primary', 'text-dark-cyan');
        
        tipPercentage = parseFloat(button.dataset.tip);
        customTipInput.value = '';
        calculateTip();
    });
});

customTipInput.addEventListener('input', (e) => {
    tipButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-dark-cyan'));
    tipButtons.forEach(btn => btn.classList.add('bg-dark-cyan', 'text-white'));
    
    tipPercentage = parseFloat(e.target.value) || 0;
    calculateTip();
});

peopleInput.addEventListener('input', (e) => {
    numberOfPeople = parseFloat(e.target.value) || 0;
    calculateTip();
});

resetBtn.addEventListener('click', () => {
    billAmount = 0;
    tipPercentage = 0;
    numberOfPeople = 0;
    
    billInput.value = '';
    customTipInput.value = '';
    peopleInput.value = '';
    
    tipButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-dark-cyan'));
    tipButtons.forEach(btn => btn.classList.add('bg-dark-cyan', 'text-white'));
    
    tipAmountDisplay.textContent = '$0.00';
    totalAmountDisplay.textContent = '$0.00';
    resetBtn.disabled = true;
});