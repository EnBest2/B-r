
let calendarData = {};

function generateCalendar() {
  const wage = parseFloat(document.getElementById('wage').value);
  const monthInput = document.getElementById('month').value;
  const shiftStart = document.getElementById('shiftStart').value;
  if (!monthInput) return alert("Válassz egy hónapot!");

  const [year, month] = monthInput.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();

  calendarData = {};
  let html = "";
  const weekdays = ["H", "K", "Sze", "Cs", "P", "Szo", "V"];

  weekdays.forEach(d => html += `<div class='day header'>${d}</div>`);

  let currentShift = shiftStart;

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month - 1, i);
    const weekday = date.getDay(); // 0=vasárnap
    let type = "work-day";
    if (weekday === 0 || weekday === 6) type = "free";

    if (type === "work-day") {
      type = currentShift === "day" ? "work-day" : "afternoon";
    }

    calendarData[i] = { type, vacation: false };

    html += `<div class='day ${type}' onclick='toggleVacation(${i})'>${i}</div>`;

    if (weekday === 5) { // péntek -> váltás
      currentShift = currentShift === "day" ? "afternoon" : "day";
    }
  }

  document.getElementById("calendar").innerHTML = html;
  calculateSummary(wage);
}

function toggleVacation(day) {
  const data = calendarData[day];
  if (!data || data.type === "free") return;

  data.vacation = !data.vacation;
  const el = document.querySelector(`#calendar .day:nth-child(${day + 7})`);
  if (data.vacation) {
    el.classList.add("vacation");
  } else {
    el.classList.remove("vacation");
  }
  calculateSummary(parseFloat(document.getElementById('wage').value));
}

function calculateSummary(wage) {
  let total = 0;
  let workDays = 0;
  let vacDays = 0;
  for (const day in calendarData) {
    const { type, vacation } = calendarData[day];
    if (type === "work-day") {
      total += 8 * wage;
      workDays++;
    } else if (type === "afternoon") {
      if (vacation) {
        total += 8 * wage;
        vacDays++;
      } else {
        total += 8 * wage + (3.5 * wage * 0.3);
        workDays++;
      }
    } else if (vacation) {
      total += 8 * wage;
      vacDays++;
    }
  }
  document.getElementById("summary").innerText =
    `Összesen: ${total.toFixed(0)} Ft | Munkanapok: ${workDays} | Szabadság: ${vacDays}`;
}

function exportPDF() {
  alert("PDF export funkció később kerül beépítésre.");
}
