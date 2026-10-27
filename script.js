$(function () {
  let current = "0";
  let previous = null;
  let operator = null;
  let shouldReset = false;

  function updateDisplay() {
    $("#result").text(current);
    $("#expression").text(previous !== null && operator ? previous + " " + displayOperator(operator) : "Ready");
  }

  function displayOperator(op) {
    return op === "*" ? "×" : op === "/" ? "÷" : op;
  }

  function enterNumber(number) {
    if (shouldReset || current === "Error") {
      current = number;
      shouldReset = false;
    } else if (current === "0") {
      current = number;
    } else if (current.length < 14) {
      current += number;
    }
    updateDisplay();
  }

  function enterDecimal() {
    if (shouldReset || current === "Error") {
      current = "0";
      shouldReset = false;
    }
    if (!current.includes(".")) current += ".";
    updateDisplay();
  }

  function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? null : a / b;
    return b;
  }

  function chooseOperator(op) {
    if (current === "Error") return;
    const value = Number(current);
    if (operator && previous !== null && !shouldReset) {
      const answer = calculate(previous, value, operator);
      if (answer === null) {
        current = "Error";
        previous = null;
        operator = null;
        shouldReset = true;
        $("#expression").text("Cannot divide by zero");
        $("#result").text(current);
        return;
      }
      previous = answer;
      current = String(Number(answer.toPrecision(12)));
    } else {
      previous = value;
    }
    operator = op;
    shouldReset = true;
    updateDisplay();
  }

  function equals() {
    if (operator === null || previous === null || current === "Error") return;
    const second = Number(current);
    const answer = calculate(previous, second, operator);
    $("#expression").text(previous + " " + displayOperator(operator) + " " + second + " =");
    if (answer === null) {
      current = "Error";
    } else {
      current = String(Number(answer.toPrecision(12)));
    }
    previous = null;
    operator = null;
    shouldReset = true;
    $("#result").text(current);
  }

  function clearAll() {
    current = "0"; previous = null; operator = null; shouldReset = false;
    updateDisplay();
  }

  function backspace() {
    if (shouldReset || current === "Error") { current = "0"; shouldReset = false; }
    else current = current.length > 1 ? current.slice(0, -1) : "0";
    updateDisplay();
  }

  $(".key[data-number]").on("click", function () { enterNumber($(this).data("number").toString()); });
  $("[data-operator]").on("click", function () { chooseOperator($(this).data("operator")); });
  $('[data-action="decimal"]').on("click", enterDecimal);
  $('[data-action="clear"]').on("click", clearAll);
  $('[data-action="backspace"]').on("click", backspace);
  $('[data-action="equals"]').on("click", equals);

  $(document).on("keydown", function (event) {
    const key = event.key;
    if (/^[0-9]$/.test(key)) enterNumber(key);
    else if (key === ".") enterDecimal();
    else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
    else if (key === "Enter" || key === "=") { event.preventDefault(); equals(); }
    else if (key === "Escape") clearAll();
    else if (key === "Backspace") backspace();
  });

  updateDisplay();
});
