document.addEventListener('DOMContentLoaded', () => {
    // === Elements of DOM ===
    const toggleButtons = document.querySelectorAll('.toggle-booking');
    const bookingPanel = document.getElementById('bookingPanel');
    const confirmBtn = document.getElementById('confirmBooking');
    const usualSeatsGrid = document.getElementById('usual-seats');
    const dateInput = document.getElementById('bookingDate');
    const timeInput = document.getElementById('bookingTime');
    const durationInput = document.getElementById('bookingDuration');
    const contactModal = document.getElementById('contactModal');
    const openContactButtons = document.querySelectorAll('.open-contact-modal');
    const closeButtons = document.querySelectorAll('.close');
    const contactForm = document.getElementById('contactForm');

    // === Consts ===
    const RATES = {
        usual: 140,
        vip: 260,
        bootcamp: 230
    };

    // === Status ===
    let selected = {
        usual: new Set(),
        vip: new Set(),
        bootcamp: new Set()
    };

    let isInitialized = false;

    // === Initialize places ===
    function initSeats() {
        if (isInitialized) return;

        // Usualy places
        if (usualSeatsGrid) {
            usualSeatsGrid.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                const btn = document.createElement('button');
                btn.className = 'seat-btn';
                btn.textContent = `U${i}`;
                btn.dataset.type = 'usual';
                btn.dataset.id = i;
                btn.addEventListener('click', () => {
                    toggleSeat('usual', i);
                });
                usualSeatsGrid.appendChild(btn);
            }
        }

        // Rooms
        document.querySelectorAll('.room-seats').forEach(container => {
            const room = container.dataset.room;
            const capacity = parseInt(container.dataset.capacity, 10) || 0;
            container.innerHTML = '';
            for (let i = 1; i <= capacity; i++) {
                const seat = document.createElement('div');
                seat.className = 'room-seat';
                seat.textContent = i;
                seat.dataset.room = room;
                seat.dataset.seat = i;
                seat.addEventListener('click', () => {
                    toggleRoomSeat(room, i);
                });
                container.appendChild(seat);
            }
        });

        isInitialized = true;
        updateUI();
    }

    // === Switch places ===
    function toggleSeat(type, id) {
        const key = `${type}-${id}`;
        const set = selected[type];
        if (set.has(key)) {
            set.delete(key);
        } else {
            set.add(key);
        }
        updateUI();
    }

    function toggleRoomSeat(room, seat) {
        const type = room.startsWith('bootcamp') ? 'bootcamp' : 'vip';
        const key = `${room}-${seat}`;
        const set = selected[type];
        if (set.has(key)) {
            set.delete(key);
        } else {
            set.add(key);
        }
        updateUI();
    }

    // === Update the interface ===
    function updateUI() {
        // Usualy places
        if (usualSeatsGrid) {
            for (let i = 1; i <= 25; i++) {
                const btn = usualSeatsGrid.querySelector(`[data-id="${i}"]`);
                if (btn) {
                    const isSelected = selected.usual.has(`usual-${i}`);
                    btn.classList.toggle('selected', isSelected);
                    if (!isSelected) {
                        btn.classList.add('available');
                    } else {
                        btn.classList.remove('available');
                    }
                }
            }
        }

        // Room's places
        document.querySelectorAll('.room-seat').forEach(seat => {
            const room = seat.dataset.room;
            const s = seat.dataset.seat;
            const key = `${room}-${s}`;
            const type = room.startsWith('bootcamp') ? 'bootcamp' : 'vip';
            const isSelected = selected[type].has(key);
            seat.classList.toggle('selected', isSelected);
            if (!isSelected) {
                seat.classList.add('available');
            } else {
                seat.classList.remove('available');
            }
        });

        // Enumeratos
        const usualCount = selected.usual.size;
        const vipCount = selected.vip.size;
        const bootcampCount = selected.bootcamp.size;

        const countUsualEl = document.getElementById('count-usual');
        const countVipEl = document.getElementById('count-vip');
        const countBootcampEl = document.getElementById('count-bootcamp');
        const usualCountEl = document.getElementById('usual-count');
        const totalPriceEl = document.getElementById('total-price');

        if (countUsualEl) countUsualEl.textContent = usualCount;
        if (countVipEl) countVipEl.textContent = vipCount;
        if (countBootcampEl) countBootcampEl.textContent = bootcampCount;
        if (usualCountEl) usualCountEl.textContent = usualCount;

        // Calculate sum
        const duration = durationInput ? parseInt(durationInput.value, 10) || 1 : 1;
        const total = 
            usualCount * RATES.usual * duration +
            vipCount * RATES.vip * duration +
            bootcampCount * RATES.bootcamp * duration;

        if (totalPriceEl) totalPriceEl.textContent = `${total} ₽`;

        // Button
        const totalSeats = usualCount + vipCount + bootcampCount;
        if (confirmBtn) {
            confirmBtn.disabled = totalSeats === 0;
            confirmBtn.textContent = totalSeats > 0
                ? `Забронировать (${totalSeats} мест) — ${total} ₽`
                : 'Выберите хотя бы одно место';
        }
    }

    // === Choise the date ===
    function setDate(daysFromNow) {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        if (dateInput) {
            dateInput.value = `${year}-${month}-${day}`;
        }
    }


    
    // === Function of model "Thanks"===
function openThankYouModal() {
    const thankYouModal = document.getElementById('thankYouModal');
    if (thankYouModal) {
        thankYouModal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
}




// === Treatment to book ===
function handleBooking() {
    const date = dateInput?.value;
    const time = timeInput?.value;
    const duration = durationInput?.value;
    const name = document.getElementById('bookingName')?.value || '—';

    if (!date || !time) {
        return;
    }

    const totalSeats = selected.usual.size + selected.vip.size + selected.bootcamp.size;
    if (totalSeats === 0) {
        return;
    }

    // --- To save data for to get the check ---
    const bookingDetails = {
        date,
        time,
        duration,
        name,
        usual: Array.from(selected.usual),
        vip: Array.from(selected.vip),
        bootcamp: Array.from(selected.bootcamp)
    };

    
    
    window.currentBooking = bookingDetails;
    openThankYouModal();
}





    // === Listeners ===
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookingPanel.classList.toggle('open');
            if (bookingPanel.classList.contains('open')) {
                bookingPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                initSeats();
            }
        });
    });

    // Fast dates
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const days = parseInt(btn.dataset.days, 10);
            if (!isNaN(days)) {
                setDate(days);
            }
        });
    });

    
    // Recalculate
    if (durationInput) {
        durationInput.addEventListener('input', updateUI);
    }

    // Confirm 
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleBooking);
    }

    // === Initialize forms===
    if (dateInput) {
        const today = new Date();
        const minDate = today.toISOString().split('T')[0];
        dateInput.min = minDate;
        setDate(0);
    }

    if (timeInput) {
        const now = new Date();
        let minutes = Math.ceil(now.getMinutes() / 30) * 30;
        if (minutes >= 60) {
            now.setHours(now.getHours() + 1);
            minutes = 0;
        }
        now.setMinutes(minutes, 0, 0);
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(minutes).padStart(2, '0');
        timeInput.value = `${hours}:${mins}`;
    }

    // === moadal "Contact Us" ===
    function openModal() {
        if (contactModal) {
            contactModal.style.display = 'block';
            document.body.classList.add('modal-open');
        }
    }

    function closeModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    openContactButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });


    // To close modal "Thanks"
const closeThankYouButtons = document.querySelectorAll('.close-thank-you');
closeThankYouButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.getElementById('thankYouModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
});





window.addEventListener('click', (e) => {
    const thankYouModal = document.getElementById('thankYouModal');
    if (e.target === thankYouModal) {
        thankYouModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
});





    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const email = formData.get('email') || '';
            const message = formData.get('message') || '';

            if (!message.trim()) {
                alert('❗ Сообщение не может быть пустым.');
                return;
            }

            const msg = `📩 Сообщение отправлено!\nEmail: ${email || 'не указан'}\n\n«${message}»`;
            alert(msg);
            contactForm.reset();
            closeModal();
        });
    }


    // Первая отрисовка
    updateUI();
});