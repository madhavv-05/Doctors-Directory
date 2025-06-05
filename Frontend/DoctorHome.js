// JavaScript for DoctorHome.html to handle dynamic rendering and interactivity

document.addEventListener('DOMContentLoaded', () => {
    const profileFields = ['name', 'specialization', 'address', 'fees', 'dob', 'availability'];
    let isEditing = false;

    // Sample doctor profile data (would be fetched from backend in real app)
    let doctorProfile = {
        name: "Dr. John Doe",
        specialization: "Cardiology",
        address: "123 Medical St, Health City",
        fees: 150,
        dob: "1975-06-15",
        availability: "available",
        profilePicture: "images/doctor.png"
    };

    // Sample appointments data by date (YYYY-MM-DD)
    // Each appointment has id, patientName, time, status ('completed' or 'pending'), details
    let appointments = {
        "2024-06-10": [
            { id: 1, patientName: "Alice Smith", time: "10:00 AM", status: "completed", details: "Routine checkup" },
            { id: 2, patientName: "Bob Johnson", time: "2:00 PM", status: "pending", details: "Follow-up visit" }
        ],
        "2024-06-15": [
            { id: 3, patientName: "Charlie Brown", time: "11:00 AM", status: "pending", details: "Consultation" }
        ]
    };

    // Sample amount collected this year
    let amountCollected = 12000;

    // Elements
    const profilePictureEl = document.getElementById('profile-picture');
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const appointmentDetailsEl = document.getElementById('appointment-details');
    const amountCollectedEl = document.getElementById('amount-collected');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const calendarEl = document.getElementById('calendar');
    const patientSearchInput = document.getElementById('patient-search');

    // Initialize profile fields with data
    function loadProfile() {
        profilePictureEl.src = doctorProfile.profilePicture;
        profileFields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.value = doctorProfile[field];
                input.disabled = !isEditing;
            }
        });
    }

    // Enable or disable editing
    function toggleEditing(editing) {
        isEditing = editing;
        profileFields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.disabled = !editing;
            }
        });
        editBtn.style.display = editing ? 'none' : 'inline-block';
        saveBtn.style.display = editing ? 'inline-block' : 'none';
    }

    // Save profile changes
    function saveProfile() {
        profileFields.forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                doctorProfile[field] = input.value;
            }
        });
        toggleEditing(false);
        // TODO: Send updated profile to backend
        alert('Profile saved successfully.');
    }

    // Populate month and year selects
    function populateMonthYear() {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        const currentYear = new Date().getFullYear();
        for (let y = currentYear - 5; y <= currentYear + 5; y++) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            yearSelect.appendChild(option);
        }

        // Set current month and year as default
        monthSelect.value = new Date().getMonth();
        yearSelect.value = currentYear;
    }

    // Render calendar for selected month and year
    function renderCalendar(month, year) {
        calendarEl.innerHTML = '';
        appointmentDetailsEl.innerHTML = '';

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get day of week for first day (0=Sunday, 6=Saturday)
        const startDay = firstDay.getDay();

        // Fill empty slots before first day
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            calendarEl.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.dataset.date = dateStr;

            const dateNumber = document.createElement('div');
            dateNumber.classList.add('date-number');
            dateNumber.textContent = day;
            dayCell.appendChild(dateNumber);

            // Show number of appointments and status dots
            if (appointments[dateStr]) {
                const appts = appointments[dateStr];
                const count = appts.length;
                const countEl = document.createElement('div');
                countEl.classList.add('appointment-count');
                countEl.textContent = `${count} appointment${count > 1 ? 's' : ''}`;
                dayCell.appendChild(countEl);

                // Show status dots for each appointment
                appts.forEach(appt => {
                    const statusDot = document.createElement('span');
                    statusDot.classList.add('appointment-status');
                    statusDot.classList.add(appt.status === 'completed' ? 'completed' : 'pending');
                    dayCell.appendChild(statusDot);
                });
            }

            dayCell.addEventListener('click', () => {
                showAppointments(dateStr);
            });

            calendarEl.appendChild(dayCell);
        }
    }

    // Show appointments for a selected date
    function showAppointments(dateStr) {
        appointmentDetailsEl.innerHTML = `<h4>Appointments on ${dateStr}</h4>`;
        if (!appointments[dateStr] || appointments[dateStr].length === 0) {
            appointmentDetailsEl.innerHTML += '<p>No appointments.</p>';
            return;
        }
        const list = document.createElement('ul');
        appointments[dateStr].forEach(appt => {
            const item = document.createElement('li');
            item.textContent = `${appt.time} - ${appt.patientName} (${appt.status})`;
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
            alert(`Appointment Details:\nPatient: ${appt.patientName}\nTime: ${appt.time}\nStatus: ${appt.status}\nDetails: ${appt.details}`);
            });
            list.appendChild(item);
        });
        appointmentDetailsEl.appendChild(list);
    }

    // Update amount collected display
    function updateAmountCollected() {
        amountCollectedEl.textContent = `Amount Collected This Year: $${amountCollected.toLocaleString()}`;
    }

    // Search patients (dummy implementation)
    function searchPatients(query) {
        // Dummy patient data for demonstration
        const allPatients = [
            { id: 1, name: "Alice Smith", age: 30, gender: "Female", contact: "alice@example.com" },
            { id: 2, name: "Bob Johnson", age: 45, gender: "Male", contact: "bob@example.com" },
            { id: 3, name: "Charlie Brown", age: 28, gender: "Male", contact: "charlie@example.com" },
            { id: 4, name: "Diana Prince", age: 35, gender: "Female", contact: "diana@example.com" }
        ];

        const patientListEl = document.getElementById('patient-list');
        patientListEl.innerHTML = '';

        if (!query) {
            patientListEl.style.display = 'none';
            return;
        }

        const filtered = allPatients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

        if (filtered.length === 0) {
            patientListEl.style.display = 'none';
            return;
        }

        filtered.forEach(patient => {
            const item = document.createElement('div');
            item.textContent = patient.name;
            item.style.padding = '8px';
            item.style.cursor = 'pointer';
            item.style.borderBottom = '1px solid #eee';
            item.addEventListener('click', () => {
                showPatientDetails(patient);
                patientListEl.style.display = 'none';
                document.getElementById('patient-search').value = patient.name;
            });
            patientListEl.appendChild(item);
        });
    }

    // Show patient details in left pane profile (or could be a modal)
    function showPatientDetails(patient) {
        // For now, show in alert, can be enhanced to modal or left pane update
        alert(`Patient Details:\nName: ${patient.name}\nAge: ${patient.age}\nGender: ${patient.gender}\nContact: ${patient.contact}`);
    }

    // Show appointment details in modal popup instead of alert
    function showAppointmentModal(appt) {
        const modal = document.getElementById('appointment-modal');
        const modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = `
            <p><strong>Patient:</strong> ${appt.patientName}</p>
            <p><strong>Time:</strong> ${appt.time}</p>
            <p><strong>Status:</strong> ${appt.status}</p>
            <p><strong>Prescription:</strong> ${appt.status === 'pending' ? 'N/A' : (appt.prescription || 'N/A')}</p>
            <p><strong>Details:</strong> ${appt.details}</p>
        `;
        // Set prescription textarea value
        const prescriptionTextarea = document.getElementById('prescription-text');
        if (appt.status === 'pending') {
            prescriptionTextarea.value = '';
            prescriptionTextarea.disabled = true;
        } else {
            prescriptionTextarea.value = appt.prescription || '';
            prescriptionTextarea.disabled = false;
        }
        modal.style.display = 'block';
    }

    // Close modal event
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        document.getElementById('appointment-modal').style.display = 'none';
    });

    // Handle video call button click
    document.getElementById('video-call-btn').addEventListener('click', () => {
        // For now, redirect to VideoCall.html or alert
        window.location.href = 'VideoCall.html';
    });

    // Handle prescribe button click
    document.getElementById('prescribe-btn').addEventListener('click', () => {
        const prescription = document.getElementById('prescription-text').value.trim();
        if (!prescription) {
            alert('Please enter a prescription before prescribing medicines.');
            return;
        }
        // TODO: Send prescription to backend or save it
        alert(`Prescription sent:\n${prescription}`);
        // Clear prescription textarea
        document.getElementById('prescription-text').value = '';
    });

    // Update showAppointments to use modal popup for appointment details
    function showAppointments(dateStr) {
        appointmentDetailsEl.innerHTML = `<h4>Appointments on ${dateStr}</h4>`;
        if (!appointments[dateStr] || appointments[dateStr].length === 0) {
            appointmentDetailsEl.innerHTML += '<p>No appointments.</p>';
            return;
        }
        const list = document.createElement('ul');
        appointments[dateStr].forEach(appt => {
            const item = document.createElement('li');
            item.textContent = `${appt.time} - ${appt.patientName} (${appt.status})`;
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                showAppointmentModal(appt);
            });
            list.appendChild(item);
        });
        appointmentDetailsEl.appendChild(list);
    }

    // Event listeners
    editBtn.addEventListener('click', () => toggleEditing(true));
    saveBtn.addEventListener('click', saveProfile);
    signoutBtn.addEventListener('click', () => {
        // TODO: Implement sign out logic
        alert('Signing out...');
        // Redirect to login or home page
        window.location.href = 'index.html';
    });
    monthSelect.addEventListener('change', () => {
        renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });
    yearSelect.addEventListener('change', () => {
        renderCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });
    patientSearchInput.addEventListener('input', (e) => {
        searchPatients(e.target.value.trim());
    });

    // Initialize page
    loadProfile();
    populateMonthYear();
    renderCalendar(new Date().getMonth(), new Date().getFullYear());
    updateAmountCollected();
});
