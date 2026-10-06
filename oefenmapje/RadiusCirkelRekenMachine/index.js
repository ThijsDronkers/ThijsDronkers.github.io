

const PI = 3.14159;
let radius;
let omtrek;

document.getElementById("calculateButton").onclick = function() {
    radius = document.getElementById("radiusInput").value;
    omtrek = 2 * PI * radius;
    document.getElementById("result").textContent = `De omtrek is ${omtrek}`;
}