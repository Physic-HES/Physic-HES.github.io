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
            dayElement.innerHTML = '';
            if (hours >= 4) {
                dayElement.innerHTML += ' ✔️';
            } else {
                dayElement.innerHTML = '';
            }

            totalHours += hours;
            completedDays++;
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Total de horas: ${totalHours.toFixed(2)}<br>`;

    const requiredHours = 8 * completedDays;
    if (totalHours >= requiredHours) {
        const remainingHoursF_hs = (totalHours - requiredHours).toFixed(0);
        const remainingHoursF_min = (((totalHours - requiredHours).toFixed(2)-remainingHoursF_hs)*60).toFixed(0);
        resultDiv.innerHTML += `Cumple con ${requiredHours} horas diarias, tenes ${remainingHoursF_hs} hs y ${remainingHoursF_min} min a favor <br>`;
    } else {
        const remainingHours_hs = (requiredHours - totalHours).toFixed(0);
        const remainingHours_min = (((requiredHours - totalHours).toFixed(2)-remainingHours_hs)*60).toFixed(0);
        resultDiv.innerHTML += `Faltan ${remainingHours_hs} hs y ${remainingHours_min} min para cumplir con ${requiredHours} horas diarias<br>`;
    }
}
