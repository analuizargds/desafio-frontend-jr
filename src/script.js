document.addEventListener("DOMContentLoaded", function () {
    const calendarHeader = document.getElementById("calendarHeader");
    const calendarGrid = document.getElementById("calendarGrid");

    const weekDays = ["SUN", "MON", "MAR", "WED", "THU", "FRI", "SAT"];
    const hours = ["1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12pm"];
    
    const today = new Date();
    let startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    function renderCalendar() {
        calendarHeader.innerHTML = "";
        calendarGrid.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);

            const dayDiv = document.createElement("div");

            if (date.toDateString() === new Date().toDateString()) {
                dayDiv.classList.add("current-day");
            }
            
            dayDiv.classList.add("calendar-day-header");

            const monthDiv = document.createElement("div");
            monthDiv.classList.add("month-name");
            monthDiv.textContent = date.toLocaleString('default', { month: 'short' }).replace('.', '').toUpperCase();

            const dayNumDiv = document.createElement("div");
            dayNumDiv.classList.add("day-number");
            dayNumDiv.textContent = date.getDate();

            const dayNameDiv = document.createElement("div");
            dayNameDiv.classList.add("day-name");
            dayNameDiv.textContent = weekDays[date.getDay()];

            dayDiv.appendChild(monthDiv);
            dayDiv.appendChild(dayNumDiv);
            dayDiv.appendChild(dayNameDiv);
            calendarHeader.appendChild(dayDiv);
        }

        const timeLabels = document.getElementById("timeLabels");
        timeLabels.innerHTML = "";
        
        const emptyLabel = document.createElement("div");
        emptyLabel.classList.add("time-label-empty");
        timeLabels.appendChild(emptyLabel);

        for (let i = 0; i < 24; i++) {
            const timeLabel = document.createElement("div");
            timeLabel.classList.add("time-label");
            timeLabel.textContent = hours[i];
            timeLabels.appendChild(timeLabel);
        }

        for (let i = 0; i < 7 * 24; i++) {
            const cell = document.createElement("div");
            cell.classList.add("calendar-cell");
            calendarGrid.appendChild(cell);
        }

        const todayIndex = today.getDay()
        const hourIndex = today.getHours()
        const cellIndex = todayIndex + 7 * hourIndex
        const minutes = today.getMinutes()
        const minutesPosition = (minutes * 25)/30

        const timeIndicator = document.createElement("div");
        timeIndicator.classList.add("time-indicator")
        timeIndicator.style.top = `${minutesPosition}px`;

        const dot = document.createElement("div");
        dot.style.top = `${minutesPosition - 3}px`;
        dot.classList.add("indicator-dot");

        calendarGrid.children[(hourIndex * 7)].appendChild(timeIndicator);
        calendarGrid.children[cellIndex].appendChild(dot);

        loadEvents();
    }

    function loadEvents() {
        fetch("../eventos.json")
            .then(response => response.json())
            .then(data => {
                data.eventos.forEach(evento => {
                    const startTime = new Date(evento.data_inicio);
                    const endTime = new Date(evento.data_fim);

                    if (startTime >= startOfWeek && startTime < new Date(startOfWeek.getTime() + 7 * 86400000)) {
                        const dayIndex = (startTime.getDay());
                        const startHour = startTime.getHours();
                        const duration = (endTime - startTime) / (1000 * 60 * 60);
                        const minutes = startTime.getMinutes()

                        const hourIndex = startHour;
                        const cellIndex = dayIndex + 7 * hourIndex;

                        const yposition = (minutes * 25)/30

                        const eventDiv = document.createElement("div");
                        eventDiv.classList.add("event");
                        eventDiv.textContent = evento.nome;
                        eventDiv.style.top = `${yposition}px`;
                        eventDiv.style.height = `${duration * 50}px`;
                        eventDiv.style.backgroundColor = evento.cor;

                        if (calendarGrid.children[cellIndex]) {
                            calendarGrid.children[cellIndex].appendChild(eventDiv);
                        } else {
                            console.log(`Célula não encontrada para o evento: ${evento.nome} - índice: ${cellIndex}`);
                        }
                    }
                });
            });
    }

    document.getElementById("prevWeek").addEventListener("click", () => {
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        renderCalendar();
    });

    document.getElementById("nextWeek").addEventListener("click", () => {
        startOfWeek.setDate(startOfWeek.getDate() + 7);
        renderCalendar();
    });

    document.getElementById("today").addEventListener("click", () => {
        startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        renderCalendar();
    });

    renderCalendar();
});
