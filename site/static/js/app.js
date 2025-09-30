function generateTimeSlots(selectedDate) {
    const times = [];
    const now = new Date();
    const isToday = selectedDate &&
                    selectedDate.toDateString() === now.toDateString();
    for (let h = 0; h < 24; h++) {
        [0, 30].forEach(m => {
            // Use selectedDate for slotDate
            const slotDate = selectedDate ? new Date(selectedDate) : new Date();
            slotDate.setHours(h, m, 0, 0);

            
            // Skip past times if today
            if (isToday && slotDate.getTime() <= now.getTime() + 10 * 60 * 1000) return;

            const hr = h % 12 || 12;
            const ampm = h >= 12 ? "PM" : "AM";

            times.push({
                value: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`,
                display: `${hr}:${m === 0 ? "00" : "30"} ${ampm}`
            });
        });
    }
    return times;
}

function setupDateTimePicker({dateId, timeId, dropdownId}) {
    const dateInput = document.getElementById(dateId);
    const timeInput = document.getElementById(timeId);
    const dropdown = document.getElementById(dropdownId);
    if (!dateInput || !timeInput || !dropdown) return;

    const renderDropdown = () => {
        dropdown.innerHTML = "";
        const selectedDate = dateInput.value ? new Date(dateInput.value) : null;

        generateTimeSlots(selectedDate).forEach(slot => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "dropdown-item";
            btn.textContent = slot.display;
            btn.onclick = () => {
                timeInput.value = slot.display;
                timeInput.dataset.time = slot.value;
                dropdown.classList.remove("show");
            };
            dropdown.appendChild(btn);
        });
    };

    const toggleDropdown = () => {
        document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"));
        renderDropdown();
        dropdown.classList.toggle("show");
    };

    timeInput.onclick = e => { e.stopPropagation(); toggleDropdown(); };
    timeInput.closest(".input-group")?.querySelector(".time-icon-btn")?.addEventListener("click", e => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Refresh slots when date changes
    dateInput.addEventListener("change", renderDropdown);
}

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();

    const formatDate = d => {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const minDate = formatDate(today);

    const maxDateObj = new Date(today);
    maxDateObj.setDate(maxDateObj.getDate() + 30);
    const maxDate = formatDate(maxDateObj);

    ["pickupDate", "packageDate"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.min = minDate;
            el.max = maxDate;
        }
    });

    setupDateTimePicker({dateId:"pickupDate", timeId:"pickupTime", dropdownId:"pickupTimeDropdown"});
    setupDateTimePicker({dateId:"packageDate", timeId:"packageTime", dropdownId:"packageTimeDropdown"});

    document.addEventListener("click", () => 
        document.querySelectorAll(".time-dropdown").forEach(d => d.classList.remove("show"))
    );
});
