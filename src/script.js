document.addEventListener("DOMContentLoaded", function () {
    const calendarHeader = document.getElementById("calendarHeader");
    const calendarGrid = document.getElementById("calendarGrid");
    const select = document.getElementById("monthSelect")
    const nextYearButton = document.getElementById("nextYearText")
    const prevYearButton = document.getElementById("prevYearText")
    const todayYearButton = document.getElementById("todayYearText")

    const weekDays = ["SUN", "MON", "MAR", "WED", "THU", "FRI", "SAT"];
    const hours = ["1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "12am", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm", "12pm"];
    const months = ["JAN", "FEV", "MAR", "ABR", "MAIO", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    
    const today = new Date();
    let startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    function createElementWithClass(tag, className) {
        const element = document.createElement(tag);
        element.classList.add(className);
        return element;
    }

    function createDayHeader(date) {

        const dayDiv = createElementWithClass("div", "calendar-day-header");

        if (date.toDateString() === new Date().toDateString()) {
            dayDiv.classList.add("current-day");
        }

        const monthDiv = createElementWithClass("div", "month-name")
        const month = date.toLocaleString('default', { month: 'short' }).replace('.', '');
        monthDiv.textContent = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

        const dayNumDiv = createElementWithClass("div", "day-number");
        dayNumDiv.textContent = date.getDate();

        const dayNameDiv = createElementWithClass("div", "day-name");
        dayNameDiv.textContent = weekDays[date.getDay()];

        dayDiv.appendChild(monthDiv);
        dayDiv.appendChild(dayNumDiv);
        dayDiv.appendChild(dayNameDiv);

        return dayDiv;
    }

    function renderWeekDays() {
        calendarHeader.innerHTML = "";
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dayDiv = createDayHeader(date);
            fragment.appendChild(dayDiv)
        }
        calendarHeader.appendChild(fragment);
    }

    function renderCalendar() {
        calendarHeader.innerHTML = "";
        calendarGrid.innerHTML = "";

        nextYearButton.textContent = startOfWeek.getFullYear() + 1
        prevYearButton.textContent = startOfWeek.getFullYear() - 1
        todayYearButton.textContent = startOfWeek.getFullYear()

        renderWeekDays()

        const timeLabels = document.getElementById("timeLabels");
        timeLabels.innerHTML = "";
        
        const emptyLabel = createElementWithClass("div", "time-label-empty");
        timeLabels.appendChild(emptyLabel);

        for (let i = 0; i < hours.length; i++) {
            const timeLabel = createElementWithClass("div", "time-label");
            timeLabel.textContent = hours[i];
            timeLabels.appendChild(timeLabel);
        }

        for (let i = 0; i < 7 * 24; i++) {
            const cell = createElementWithClass("div", "calendar-cell");
            calendarGrid.appendChild(cell);
        }

        const todayIndex = today.getDay()
        const hourIndex = today.getHours()
        const cellIndex = todayIndex + 7 * hourIndex
        const minutes = today.getMinutes()
        const minutesPosition = (minutes * 25)/30

        const timeIndicator = createElementWithClass("div", "time-indicator");
        timeIndicator.style.top = `${minutesPosition}px`;

        const dot = createElementWithClass("div", "indicator-dot");
        dot.style.top = `${minutesPosition - 3}px`;

        calendarGrid.children[(hourIndex * 7)].appendChild(timeIndicator);
        calendarGrid.children[cellIndex].appendChild(dot);

        loadEvents();
        renderSelectOption();
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

                        const eventDiv = createElementWithClass("div", "event");
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

    function renderSelectOption() {
        const fragment = document.createDocumentFragment()
        for(let i = 0; i < months.length; i++) {
            const option = createElementWithClass("option", "optionText");
            option.textContent = months[i];
            option.value = i
            fragment.appendChild(option)
        }
        select.appendChild(fragment)
        select.value = startOfWeek.getMonth()
    };

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

    document.getElementById("prevYear").addEventListener("click", () => {
        startOfWeek.setFullYear(startOfWeek.getFullYear() - 1);
        renderCalendar();
    })

    document.getElementById("nextYear").addEventListener("click", () => {
        startOfWeek.setFullYear(startOfWeek.getFullYear() + 1);
        renderCalendar();
    })

    document.getElementById("monthSelect").addEventListener("change", () => {
        startOfWeek.setMonth(select.value)
        console.log(startOfWeek)
        renderCalendar();
    })

    renderCalendar();
});
