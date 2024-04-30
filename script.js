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
                dayElement.innerHTML = ' ';
            }

            totalHours += hours;
            completedDays++;
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ` \n <br>`;

    const requiredHours = 8 * completedDays;
    if (totalHours*60 >= requiredHours*60) {
        const remainingHoursF_hs = totalHours*60 - requiredHours*60;
        const remainingHoursF_min = Math.trunc(totalHours*60 - requiredHours*60);
        resultDiv.innerHTML += `¡Sos Crack! 😎, Tenés ${Math.trunc(remainingHoursF_hs/60)} hs y ${((Math.trunc(remainingHoursF_min)/60-Math.trunc(remainingHoursF_hs/60))*60).toFixed(0)} min a favor <br>`;
    } else {
        const remainingHours_hs = requiredHours*60 - totalHours*60;
        const remainingHours_min = Math.trunc(requiredHours*60 - totalHours*60);
        resultDiv.innerHTML += `¡Estas al horno! 😬, Te faltan ${Math.trunc(remainingHours_hs/60)} hs y ${((Math.trunc(remainingHours_min)/60-Math.trunc(remainingHours_hs/60))*60).toFixed(0)} min para cumplir con ${Math.trunc(requiredHours)} horas diarias<br>`;
    }
}
