const loginButton = document.querySelector('#login-button');
const backButton = document.querySelector('#back-button');
const appShell = document.querySelector('#app-shell');
const errorScreen = document.querySelector('#error-screen');


function showErrorPage() {
    appShell.style.display = 'none';
    errorScreen.classList.add('visible');
    errorScreen.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
}


function showHomePage() {
    errorScreen.classList.remove('visible');
    errorScreen.setAttribute('aria-hidden', 'true');
    appShell.style.display = '';
    window.location.hash = 'inicio';
}


loginButton.addEventListener('click', showErrorPage);
backButton.addEventListener('click', showHomePage);


const resultDisplay = document.querySelector('#calc-result');
const historyDisplay = document.querySelector('#calc-history');
let currentValue = '0';
let storedValue = null;
let operation = null;
let waitingForValue = false;


function updateDisplay() { resultDisplay.textContent = currentValue; }


function calculate(first, second, operator) {
    const left = Number(first);
    const right = Number(second);
    if (operator === '+') return left + right;
    if (operator === '−') return left - right;
    if (operator === '×') return left * right;
    if (operator === '÷') return right === 0 ? 'Erro' : left / right;
    if (operator === '%') return left % right;
    return right;
}


function pressValue(value) {
    if (currentValue === 'Erro') currentValue = '0';
    if (waitingForValue) { currentValue = value === '.' ? '0.' : value; waitingForValue = false; }
    else if (value === '.' && currentValue.includes('.')) return;
    else currentValue = currentValue === '0' && value !== '.' ? value : currentValue + value;
    updateDisplay();
}


function pressOperator(nextOperation) {
    if (operation && !waitingForValue) currentValue = String(calculate(storedValue, currentValue, operation));
    storedValue = currentValue;
    operation = nextOperation;
    waitingForValue = true;
    historyDisplay.textContent = `${storedValue} ${operation}`;
    updateDisplay();
}


document.querySelectorAll('.key').forEach((key) => {
    key.addEventListener('click', () => {
        const value = key.dataset.value;
        const action = key.dataset.action;
        if (value !== undefined && !['+', '−', '×', '÷', '%'].includes(value)) pressValue(value);
        if (['+', '−', '×', '÷', '%'].includes(value)) pressOperator(value);
        if (action === 'clear') { currentValue = '0'; storedValue = null; operation = null; historyDisplay.textContent = ''; updateDisplay(); }
        if (action === 'delete') { currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0'; updateDisplay(); }
        if (action === 'equals' && operation) { currentValue = String(calculate(storedValue, currentValue, operation)); historyDisplay.textContent = `${storedValue} ${operation} ${currentValue}`; storedValue = null; operation = null; waitingForValue = true; updateDisplay(); }
    });
});
