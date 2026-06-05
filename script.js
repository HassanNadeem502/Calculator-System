// DOMContentLoaded event ensures JS tab chale jab HTML pura load ho jaye
document.addEventListener("DOMContentLoaded", () => {

    // Display element jahan calculator ka output show hota hai
    const display = document.getElementById("display");

    // Saare buttons select kar liye jate hain jinke class "btn" hai
    const buttons = document.querySelectorAll(".btn");

    // Variables for calculator state
    let currentValue = "0";       // Jo abhi display pe dikh raha hai (user ka input ya result)
    let previousValue = null;     // Pehla number jo operator ke liye store kiya jata hai
    let operator = null;          // Current operator (+, -, *, /)
    let resetNext = false;        // Flag: agar true ho to agla input purana replace karega (display reset hoga)

    // Function to update calculator display text
    function updateDisplay() {
        display.textContent = currentValue;
    }

    // Function to reset calculator to initial state
    function resetCalculator() {
        currentValue = "0";
        previousValue = null;
        operator = null;
        resetNext = false;
        updateDisplay();
    }

    // Helper function check karta hai ki koi value operator hai ya nahi
    function isOperator(val) {
        return ["+", "-", "*", "/"].includes(val);
    }

    // Calculation karne wali function
    function calculate() {
        // Tabhi calculation kare agar operator set ho aur previousValue bhi ho
        if (operator && previousValue !== null) {
            const prev = parseFloat(previousValue);   // Pehla number float me convert karo
            const current = parseFloat(currentValue); // Current number float me convert karo
            let result = 0;

            // Operator ke mutabiq calculation karo
            switch (operator) {
                case "+": result = prev + current; break;
                case "-": result = prev - current; break;
                case "*": result = prev * current; break;

                case "/":
                    // Division by zero handle karo
                    if (current === 0) {
                        alert("Error: Division by zero");
                        return null;  // Invalid result
                    }
                    result = prev / current;
                    break;

                default:
                    return null;  // Agar operator match nahi hota to null return karo
            }

            // Result ko string me convert karke return karo taake display me dikhe
            return result.toString();
        }

        // Agar calculation na ho paye to null return karo
        return null;
    }

    // Har button par click event listener lagao
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            // Button ki data-value lo (ye woh value hoti jo button represent karta hai)
            const value = btn.dataset.value;

            // Agar button "AC" hai to calculator reset karo
            if (value === "AC") {
                resetCalculator();
                return;
            }

            // Agar button "+/-" hai to current number ka sign change karo
            if (value === "+/-") {
                if (currentValue !== "0") {
                    currentValue = (parseFloat(currentValue) * -1).toString();
                    updateDisplay();
                }
                return;
            }

            // Agar button "%" hai to current number ko 100 se divide karo (percent calculation)
            if (value === "%") {
                currentValue = (parseFloat(currentValue) / 100).toString();
                updateDisplay();
                return;
            }

            // Agar button "=" hai to calculation karo aur result show karo
            if (value === "=") {
                const result = calculate();
                if (result !== null) {
                    currentValue = result;
                    previousValue = null;
                    operator = null;
                    resetNext = true;   // Agla input purana replace karega
                    updateDisplay();
                }
                return;
            }

            // Agar button koi operator (+, -, *, /) hai
            if (isOperator(value)) {

                // Agar pehle se operator set hai aur display reset nahi hua, to pehle calculation karo
                if (operator && !resetNext) {
                    const result = calculate();
                    if (result !== null) {
                        currentValue = result;
                        updateDisplay();
                    }
                }

                // Ab current display value ko previousValue me store karo
                previousValue = currentValue;

                // Naya operator set karo
                operator = value;

                // ResetNext true karo taake agla number purane ko replace kare
                resetNext = true;
                return;
            }

            // Agar resetNext true hai to matlab agla input new number hai, purane ko reset karo
            if (resetNext) {
                currentValue = "0";
                resetNext = false;
            }

            // Agar button "." hai (decimal point)
            if (value === ".") {
                // Sirf tab decimal add karo jab already decimal na ho
                if (!currentValue.includes(".")) {
                    currentValue += ".";
                }
                updateDisplay();
                return;
            }

            // Agar button number hai (0-9)
            if (!isNaN(value)) {
                // Agar currentValue 0 hai to replace karo warna append karo
                if (currentValue === "0") {
                    currentValue = value;
                } else {
                    currentValue += value;
                }
                updateDisplay();
                return;
            }

        });
    });

    // Initial display update karo jab page load ho
    updateDisplay();
});
