document.addEventListener("DOMContentLoaded", () => {
  const billType = document.getElementById("billType");
  const roomSection = document.getElementById("roomSection");
  const functionSection = document.getElementById("functionSection");
  const message = document.getElementById("message");

  billType.addEventListener("change", () => {
    if (billType.value === "room") {
      roomSection.style.display = "block";
      functionSection.style.display = "none";
    } else {
      roomSection.style.display = "none";
      functionSection.style.display = "block";
    }
  });

  document.getElementById("generateBtn").addEventListener("click", async () => {
    message.textContent = "Generating bill...";

    const type = billType.value;
    const customerName = document.getElementById("customerName").value;
    const date = document.getElementById("billDate").value;

    let details = {};
    let total = 0;

    if (type === "room") {
      const roomNumber = document.getElementById("roomNumber").value;
      const checkIn = document.getElementById("checkIn").value;
      const checkOut = document.getElementById("checkOut").value;
      const roomPrice = Number(document.getElementById("roomPrice").value);
      const breakfast = Number(document.getElementById("breakfast").value) || 0;
      const lunch = Number(document.getElementById("lunch").value) || 0;
      const dinner = Number(document.getElementById("dinner").value) || 0;
      const food = { breakfast, lunch, dinner };
      details = { roomNumber, checkIn, checkOut, roomPrice, food };
      total = roomPrice + breakfast + lunch + dinner;
    } else {
      const packageType = document.getElementById("package").value;
      const people = Number(document.getElementById("people").value);
      const pricePerPerson = Number(document.getElementById("pricePerPerson").value);
      const serviceCharge = Number(document.getElementById("serviceCharge").value);
      const packageTotal = people * pricePerPerson;
      details = { package: packageType, people, pricePerPerson, serviceCharge };
      total = packageTotal + serviceCharge;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, customerName, date, details, total }),
      });

      const data = await res.json();
      if (res.ok) {
        message.innerHTML = `✅ Bill generated successfully!<br><a href="http://localhost:5000/${data.pdfPath}" target="_blank">Download PDF</a>`;
      } else {
        message.textContent = "❌ Error: " + data.message;
      }
    } catch (error) {
      console.error(error);
      message.textContent = "❌ Failed to connect to backend.";
    }
  });
});
