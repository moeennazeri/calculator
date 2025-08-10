// ساده، واضح و بدون وابستگی — Vanilla JS

const display = document.getElementById('display');

let firstOperand = null;
let operator = null;
let waitingForSecond = false;

// کمک: مقدار نمایش را مدیریت کن
function updateDisplay(value) {
  display.textContent = value.toString().slice(0, 20); // محدود کردن طول
}

// گرفتن کلیدها و هندل کردن‌شون
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const num = btn.dataset.number;
    const action = btn.dataset.action;

    if (num !== undefined) {
      handleNumber(num);
    } else if (action) {
      handleAction(action, btn.dataset.value);
    }
  });
});

// تابع برای اعداد و نقطه
function handleNumber(input) {
  const current = display.textContent === '0' ? '' : display.textContent;

  // جلوگیری از چند نقطه
  if (input === '.' && current.includes('.')) return;

  if (waitingForSecond) {
    updateDisplay(input === '.' ? '0.' : input);
    waitingForSecond = false;
  } else {
    updateDisplay((current + input) || '0');
  }
}

// تابع برای عملیات و دکمه‌های عملکردی
function handleAction(action, value) {
  const current = parseFloat(display.textContent.replace(',', '.')) || 0;

  switch (action) {
    case 'clear':
      firstOperand = null;
      operator = null;
      waitingForSecond = false;
      updateDisplay('0');
      break;

    case 'toggle-sign':
      updateDisplay((current * -1).toString());
      break;

    case 'percent':
      updateDisplay((current / 100).toString());
      break;

    case 'operator':
      if (!operator) {
        firstOperand = current;
        operator = value;
        waitingForSecond = true;
      } else {
        // اگر کاربر چند operator پشت سر هم زد، مقدار را محاسبه کن
        const result = compute(firstOperand, current, operator);
        updateDisplay(result);
        firstOperand = result;
        operator = value;
        waitingForSecond = true;
      }
      break;

    case 'equals':
      if (operator) {
        const result = compute(firstOperand, current, operator);
        updateDisplay(result);
        firstOperand = null;
        operator = null;
        waitingForSecond = false;
      }
      break;
  }
}

// تابع محاسبات اصلی
function compute(a, b, op) {
  // مدیریت تقسیم بر صفر
  if (op === '/' && b === 0) {
    alert('خطا: تقسیم بر صفر مجاز نیست');
    return 0;
  }

  switch (op) {
    case '+': return (a + b);
    case '-': return (a - b);
    case '*': return (a * b);
    case '/': return (a / b);
    default: return b;
  }
}

// کیبورد پشتیبانی ساده
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
  if (e.key === '.') handleNumber('.');
  if (['+', '-', '*', '/'].includes(e.key)) handleAction('operator', e.key);
  if (e.key === 'Enter' || e.key === '=') handleAction('equals');
  if (e.key === 'Backspace') {
    const cur = display.textContent;
    updateDisplay(cur.length > 1 ? cur.slice(0, -1) : '0');
  }
  if (e.key.toLowerCase() === 'c') handleAction('clear');
});
