function calculateHours() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let totalHours = 0;
    let completedDays = 0;
    let suggestedHours = null;

    const isInternMode = document.getElementById('intern-mode').checked;
    const dailyTarget = isInternMode ? 4 : 8;

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
            suggestedHours = dailyTarget+(suggestedTime-reftime)/(1000*60*60)-(totalHours-dailyTarget*completedDays);
        }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "";

    const requiredHours = dailyTarget * completedDays;
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
            // Solución definitiva para el logo y espacio: Capturar desde el origen (0,0) del clon
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
            onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.querySelector('.container');
                
                // Forzar que el clon esté al principio del canvas invisible
                clonedContainer.style.margin = '0';
                clonedContainer.style.position = 'absolute';
                clonedContainer.style.top = '0';
                clonedContainer.style.left = '0';
                clonedContainer.style.width = '550px';
                clonedContainer.style.maxWidth = '550px';
                clonedContainer.style.transform = 'none';
                clonedContainer.style.boxShadow = 'none';

                // Asegurar que el encabezado y el logo tengan sus dimensiones exactas
                const header = clonedDoc.querySelector('.header');
                const logo = clonedDoc.getElementById('main-logo');
                if (header) {
                    header.style.marginBottom = '30px';
                    header.style.minHeight = '160px';
                }
                if (logo) {
                    logo.style.width = '120px';
                    logo.style.height = '120px';
                    logo.style.display = 'block';
                    logo.style.margin = '0 auto 15px auto';
                }

                // Reemplazar todos los inputs y botones dinámicos por bloques estáticos
                const originalInputs = container.querySelectorAll('input[type="time"]');
                const clonedInputs = clonedContainer.querySelectorAll('input[type="time"]');
                clonedInputs.forEach((input, index) => {
                    const replacement = clonedDoc.createElement('div');
                    replacement.className = 'time-replacement';
                    replacement.innerText = originalInputs[index].value || "--:--";
                    input.parentNode.replaceChild(replacement, input);
                });

                const originalCalcBtn = document.getElementById('calc-btn');
                const clonedCalcBtn = clonedDoc.getElementById('calc-btn');
                if (clonedCalcBtn) {
                    const btnReplacement = clonedDoc.createElement('div');
                    btnReplacement.className = 'button-replacement';
                    btnReplacement.innerText = originalCalcBtn.innerText;
                    clonedCalcBtn.parentNode.replaceChild(btnReplacement, clonedCalcBtn);
                }
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

async function handlePDF(input) {
    const file = input.files[0];
    if (!file) return;

    const btn = document.getElementById('import-btn');
    const originalText = btn.innerText;
    btn.innerText = '⌛ Leyendo...';
    btn.disabled = true;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map(item => item.str);
        const fullText = textItems.join(' ');
        
        const dayRegex = /(\d{2}-\d{2}-\d{4})\s+(Lunes|Martes|Miercoles|Jueves|Viernes|Sabado|Domingo)\s+([^0-9]*)/g;
        let matches = [];
        let match;
        while ((match = dayRegex.exec(fullText)) !== null) {
            const dateStr = match[1];
            const dayName = match[2];
            const remaining = fullText.substring(match.index + match[0].length, match.index + match[0].length + 100);
            const times = [];
            const timeMatch = /(\d{2}:\d{2})\s+[ES]-CAC/g;
            let t;
            while ((t = timeMatch.exec(remaining)) !== null && times.length < 2) {
                times.push(t[1]);
            }
            matches.push({ date: dateStr, day: dayName, start: times[0] || "", end: times[1] || "" });
        }

        let lastWeek = [];
        for (let i = matches.length - 1; i >= 0; i--) {
            if (matches[i].start !== "") {
                const daysMap = { 'Lunes': 0, 'Martes': 1, 'Miercoles': 2, 'Jueves': 3, 'Viernes': 4 };
                if (daysMap[matches[i].day] !== undefined) {
                    let mondayIdx = -1;
                    for (let j = i; j >= 0; j--) {
                        if (matches[j].day === 'Lunes') { mondayIdx = j; break; }
                    }
                    if (mondayIdx !== -1) { lastWeek = matches.slice(mondayIdx, mondayIdx + 5); break; }
                }
            }
        }

        if (lastWeek.length > 0) {
            const idMap = { 'Lunes': 'monday', 'Martes': 'tuesday', 'Miercoles': 'wednesday', 'Jueves': 'thursday', 'Viernes': 'friday' };
            lastWeek.forEach(dayData => {
                const prefix = idMap[dayData.day];
                if (prefix) {
                    document.getElementById(prefix + '-start').value = dayData.start;
                    document.getElementById(prefix + '-end').value = dayData.end;
                }
            });
            btn.innerText = '✅ ¡Importado!';
            btn.style.backgroundColor = '#28a745';
            calculateHours();
        } else {
            alert('No se encontraron registros de fichadas en el PDF.');
            btn.innerText = originalText;
        }

    } catch (error) {
        console.error('Error al procesar PDF:', error);
        alert('Hubo un error al procesar el PDF. Asegúrate de que es una planilla de fichadas válida.');
        btn.innerText = originalText;
    } finally {
        btn.disabled = false;
        input.value = "";
        setTimeout(() => {
            btn.innerText = '📄 Importar PDF';
            btn.style.backgroundColor = '';
        }, 3000);
    }
}