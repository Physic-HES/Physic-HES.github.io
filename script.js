function calculateHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let totalHours = 0;
    let completedDays = 0;
    let suggestedHours = null;

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
        } else if (start && !end) {
            const reftime = new Date('1970-01-01T00:00')
            const suggestedTime = new Date('1970-01-01T' + start);
            suggestedHours = 8+(suggestedTime-reftime)/(1000*60*60)-(totalHours-8*completedDays);
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    const requiredHours = 8 * completedDays;
    if (completedDays) {
        if (totalHours*60 >= requiredHours*60) {
            const remainingHoursF_hs = totalHours*60 - requiredHours*60;
            const remainingHoursF_min = Math.trunc(totalHours*60 - requiredHours*60);
            resultDiv.innerHTML += `¡Sos Crack! 😎, Tenés ${Math.trunc(remainingHoursF_hs/60)} hs y ${((Math.trunc(remainingHoursF_min)/60-Math.trunc(remainingHoursF_hs/60))*60).toFixed(0)} min a favor <br>`;
        } else {
            const remainingHours_hs = requiredHours*60 - totalHours*60;
            const remainingHours_min = Math.trunc(requiredHours*60 - totalHours*60);
            resultDiv.innerHTML += `¡Estas al horno! 😬, Te faltan ${Math.trunc(remainingHours_hs/60)} hs y ${((Math.trunc(remainingHours_min)/60-Math.trunc(remainingHours_hs/60))*60).toFixed(0)} min para cumplir con las ${Math.trunc(requiredHours)} horas<br>`;
        }
    }
    if (suggestedHours) {
        resultDiv.innerHTML += `Deberías salir a las ${Math.trunc(suggestedHours)}:${((suggestedHours-Math.trunc(suggestedHours))*60).toFixed(0).padStart(2,'0')} hs. No cuelgues! afuera hay una vida<br>`;
    }
}

async function captureAndCopy() {
    const container = document.querySelector('.container');
    const btn = document.getElementById('capture-btn');
    
    btn.innerText = '⌛ Capturando...';
    btn.disabled = true;

    try {
        const canvas = await html2canvas(container, {
            backgroundColor: '#333',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY, // Corregir desfase de scroll
            onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.querySelector('.container');
                
                // 1. Asegurar dimensiones del Logo en el clon
                const clonedLogo = clonedDoc.getElementById('main-logo');
                if (clonedLogo) {
                    clonedLogo.style.width = '110px';
                    clonedLogo.style.height = '110px';
                    clonedLogo.style.display = 'block';
                    clonedLogo.style.margin = '0 auto 15px auto';
                }

                // 2. Reemplazar inputs por texto (solución definitiva para renderizado)
                const originalInputs = container.querySelectorAll('input[type="time"]');
                const clonedInputs = clonedContainer.querySelectorAll('input[type="time"]');
                clonedInputs.forEach((input, index) => {
                    const replacement = clonedDoc.createElement('div');
                    replacement.className = 'time-replacement';
                    replacement.innerText = originalInputs[index].value || "--:--";
                    input.parentNode.replaceChild(replacement, input);
                });

                // 3. Reemplazar botón por bloque estático
                const originalCalcBtn = document.getElementById('calc-btn');
                const clonedCalcBtn = clonedDoc.getElementById('calc-btn');
                if (clonedCalcBtn) {
                    const btnReplacement = clonedDoc.createElement('div');
                    btnReplacement.className = 'button-replacement';
                    btnReplacement.innerText = originalCalcBtn.innerText;
                    clonedCalcBtn.parentNode.replaceChild(btnReplacement, clonedCalcBtn);
                }

                // 4. Limpiar estilos del contenedor para la captura
                clonedContainer.style.boxShadow = 'none';
                clonedContainer.style.transform = 'none';
                clonedContainer.style.margin = '0 auto';
                clonedContainer.style.position = 'relative';
            }
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            try {
                const item = new ClipboardItem({ "image/png": blob });
                await navigator.clipboard.write([item]);
                btn.innerText = '✅ ¡Copiado!';
                btn.style.backgroundColor = '#28a745';
            } catch (err) {
                // Fallback descarga automática si falla el portapapeles
                const link = document.createElement('a');
                link.download = 'mi_horario.png';
                link.href = canvas.toDataURL();
                link.click();
                btn.innerText = '💾 Descargado';
            }

            setTimeout(() => {
                btn.innerText = '📸 Capturar y Copiar al Portapapeles';
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        }, 'image/png');

    } catch (error) {
        console.error(error);
        btn.innerText = '📸 Reintentar';
        btn.disabled = false;
    }
}