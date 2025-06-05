document.addEventListener("DOMContentLoaded", function () {
  // References to each step container
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const resultBox = document.getElementById("resultBox");

  // Buttons
  const next1 = document.getElementById("next1");
  const next2 = document.getElementById("next2");
  const back2 = document.getElementById("back2");
  const back3 = document.getElementById("back3");
  const submitBtn = document.getElementById("submitBtn");

  // Inputs
  const lastPeriodInput = document.getElementById("lastPeriodDate");
  const cycleLengthInput = document.getElementById("cycleLength");
  const actualStartInput = document.getElementById("actualStartDate");

  // Enable “Next” on Step 1 only when a valid date is chosen
  lastPeriodInput.addEventListener("change", function () {
    next1.disabled = !lastPeriodInput.value;
  });

  // Enable “Next” on Step 2 only when a valid number between 20–45 is entered
  cycleLengthInput.addEventListener("input", function () {
    const val = parseInt(cycleLengthInput.value, 10);
    next2.disabled = isNaN(val) || val < 20 || val > 45;
  });

  // Step 1 → Step 2
  next1.addEventListener("click", function () {
    slideToStep(step1, step2);
  });

  // Step 2 → Step 1 (Back)
  back2.addEventListener("click", function () {
    slideToStep(step2, step1);
  });

  // Step 2 → Step 3
  next2.addEventListener("click", function () {
    slideToStep(step2, step3);
  });

  // Step 3 → Step 2 (Back)
  back3.addEventListener("click", function () {
    slideToStep(step3, step2);
  });

  // Final “Submit” button
  submitBtn.addEventListener("click", function () {
    processResults();
  });

  // Helper: Fade out current, fade in next
  function slideToStep(currentStep, nextStep) {
    currentStep.classList.remove("active");
    nextStep.classList.add("active");
  }

  // Format Date object as YYYY-MM-DD
  function formatDate(date) {
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    if (m < 10) m = "0" + m;
    if (d < 10) d = "0" + d;
    return `${y}-${m}-${d}`;
  }

  // Main logic to calculate prediction & show result
  function processResults() {
    // Parse inputs
    const lastVal = lastPeriodInput.value;
    const cycleVal = parseInt(cycleLengthInput.value, 10);
    const actualVal = actualStartInput.value;

    // Validate Last Period Date
    const lastDate = new Date(lastVal);
    if (isNaN(lastDate)) {
      alert("Please enter a valid Last Period Start Date.");
      return;
    }

    // Calculate Predicted Next Period Date
    const predictedDate = new Date(lastDate);
    predictedDate.setDate(predictedDate.getDate() + cycleVal);

    // Today's date (time zeroed out)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build result HTML
    let html = `<div class="content">
      <h2>Cycle Prediction Result</h2>
      <p><strong>Predicted Next Period:</strong> ${formatDate(predictedDate)}</p>`;

    // If actual start is provided
    if (actualVal) {
      const actualDate = new Date(actualVal);
      if (isNaN(actualDate)) {
        alert("Please enter a valid Actual Period Start Date.");
        return;
      }
      actualDate.setHours(0, 0, 0, 0);

      const diffTime = actualDate.getTime() - predictedDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        html += `<p><strong>Status:</strong> Your period started on time. 🎉</p>`;
      } else if (diffDays < 0) {
        const earlyBy = Math.abs(diffDays);
        html += `<p>
          <strong>Status:</strong> Early by
          <span class="highlight-early">${earlyBy} day(s)</span>.
        </p>
        <p><strong>Possible Reasons for Early Period:</strong></p>
        <ul>
          <li>Stress or sudden routine changes.</li>
          <li>Weight fluctuations.</li>
          <li>Hormonal shifts (e.g., thyroid).</li>
          <li>Intense exercise.</li>
        </ul>
        <p><strong>Suggestions:</strong></p>
        <ul>
          <li>Practice relaxation (yoga, meditation).</li>
          <li>Maintain balanced meals and consistent sleep.</li>
          <li>Monitor exercise intensity.</li>
          <li>See a doctor if it continues.</li>
        </ul>`;
      } else {
        html += `<p>
          <strong>Status:</strong> Late by
          <span class="highlight-late">${diffDays} day(s)</span>.
        </p>
        <p><strong>Possible Reasons for Late Period:</strong></p>
        <ul>
          <li>High stress or anxiety.</li>
          <li>Possible pregnancy (if applicable).</li>
          <li>Hormonal imbalance (e.g., thyroid).</li>
          <li>Major lifestyle changes.</li>
        </ul>
        <p><strong>Suggestions:</strong></p>
        <ul>
          <li>Consider a home pregnancy test, if relevant.</li>
          <li>Ensure consistent sleep & stress management.</li>
          <li>Avoid crash diets; focus on nutrition.</li>
          <li>If >7 days late, consult a gynecologist.</li>
        </ul>`;
      }
    } else {
      // No actual date provided → compare predicted vs today
      const diffTimeToday = today.getTime() - predictedDate.getTime();
      const diffDaysToday = Math.round(
        diffTimeToday / (1000 * 60 * 60 * 24)
      );

      if (diffDaysToday < 0) {
        const daysLeft = Math.abs(diffDaysToday);
        html += `<p>
          <strong>Info:</strong> Your next period is in
          <strong>${daysLeft}</strong> day(s). 😊
        </p>`;
      } else if (diffDaysToday === 0) {
        html += `<p>
          <strong>Info:</strong> Your period starts <strong>today</strong>. 🌺
        </p>`;
      } else {
        html += `<p>
          <strong>Info:</strong> Your period is late by
          <strong>${diffDaysToday}</strong> day(s).
        </p>
        <p><strong>Possible Reasons for Late Period:</strong></p>
        <ul>
          <li>Stress or life changes.</li>
          <li>Possible pregnancy (if applicable).</li>
          <li>Hormonal imbalance (e.g., thyroid).</li>
        </ul>
        <p><strong>Suggestions:</strong></p>
        <ul>
          <li>Take a home pregnancy test if needed.</li>
          <li>Practice relaxation (deep breathing, yoga).</li>
          <li>Maintain balanced nutrition & sleep.</li>
          <li>If >7 days late, visit a doctor.</li>
        </ul>`;
      }
    }

    // Add Reset button at the end
    html += `
      <button id="resetBtn" class="btn">Reset ↺</button>
    </div>`;

    // Append a confetti-style doodle in result 
    html += `
      <svg class="doodle doodle-confetti" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="4" fill="none" stroke="#f38181" stroke-width="2"/>
        <circle cx="52" cy="16" r="3" fill="none" stroke="#90dfee" stroke-width="2"/>
        <circle cx="20" cy="50" r="3" fill="none" stroke="#ea8fea" stroke-width="2"/>
        <circle cx="48" cy="48" r="4" fill="none" stroke="#fce38a" stroke-width="2"/>
        <line x1="32" y1="8" x2="32" y2="16" stroke="#f38181" stroke-width="1"/>
        <line x1="32" y1="56" x2="32" y2="48" stroke="#90dfee" stroke-width="1"/>
        <line x1="8" y1="32" x2="16" y2="32" stroke="#ea8fea" stroke-width="1"/>
        <line x1="56" y1="32" x2="48" y2="32" stroke="#fce38a" stroke-width="1"/>
      </svg>
    `;

    // Hide all steps
    [step1, step2, step3].forEach((el) => el.classList.remove("active"));
    // Inject result into resultBox and show it
    resultBox.innerHTML = html;
    resultBox.classList.add("active");

    // Attach listener to Reset button
    document.getElementById("resetBtn").addEventListener("click", resetAll);
  }

  // Reset everything to Step 1
  function resetAll() {
    // Clear input values
    lastPeriodInput.value = "";
    cycleLengthInput.value = "";
    actualStartInput.value = "";

    // Disable “Next” buttons again
    next1.disabled = true;
    next2.disabled = true;

    // Hide result box
    resultBox.classList.remove("active");
    resultBox.innerHTML = "";

    // Show Step 1 again
    step1.classList.add("active");
  }
});
