function calculateHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let totalHours = 0;
    let completedDays = 0;

    days.forEach(day => {
        const start = document.getElementById(day.toLowerCase() + '-start').value;
        const end = document.getElementById(day.toLowerCase() + '-end').value;

        if (start && end) {
            const startTime = new Date('1970-01-01T' + start);
            const endTime = new Date('1970-01-01T' + end);

            const hours = (endTime - startTime) / (1000 * 60 * 60);

            const dayElement = document.getElementById(day.toLowerCase() + '-output');
            dayElement.innerHTML = '  ';
            if (hours >= 4) {
                dayElement.innerHTML += ' ✔️';
            } else {
                dayElement.innerHTML = '  ';
            }

            totalHours += hours;
            completedDays++;
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Total de horas: ${totalHours.toFixed(2)}<br>`;

    const requiredHours = 8 * completedDays;
    if (totalHours*60 >= requiredHours*60) {
        const remainingHoursF_hs = (totalHours*60 - requiredHours*60).toFixed(0);
        const remainingHoursF_min = (totalHours*60 - requiredHours*60).toFixed(0);
        resultDiv.innerHTML += `¡Sos Crack! 😎, tenés ${(remainingHoursF_hs/60).toFixed(0)} hs y ${remainingHoursF_min} min a favor <br>`;
    } else {
        const remainingHours_hs = (requiredHours*60 - totalHours*60).toFixed(0);
        const remainingHours_min = (requiredHours*60 - totalHours*60).toFixed(0);
        resultDiv.innerHTML += `¡Estas al horno!, te faltan ${(remainingHours_hs/60).toFixed(0)} hs y ${remainingHours_min} min para cumplir con ${requiredHours} horas diarias<br>`;
    }
}
