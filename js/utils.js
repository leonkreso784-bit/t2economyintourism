// ===== SOKRAT STUDY — UTILITIES =====

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let toastTimeout = null;

// F2 2D.1: prikaz toasta vodi Web Component <sokrat-toast> (js/components/sokrat-toast.js).
// showToast() je sada TANKI delegat — svih ~13 pozivatelja ostaje nepromijenjeno.
// FALLBACK ispod čuva staro ponašanje ako custom element nije upgrade-an (stari preglednik /
// skripta nije stigla) → 0 regresije. Logika fallbacka = doslovno prijašnji showToast().
function showToast(message) {
    const toast = document.getElementById('toast');

    // Sretan put: element je upgrade-an u <sokrat-toast> → delegiraj (komponenta posjeduje logiku).
    if (toast && typeof (/** @type {any} */ (toast).show) === 'function') {
        (/** @type {any} */ (toast)).show(message);
        return;
    }

    // Fallback (nije Web Component): klasičan DOM put — identičan izvornom ponašanju.
    const msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toast.classList.remove('show');
    void toast.offsetWidth; // force reflow
    toast.classList.add('show');

    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toastTimeout = null;
    }, 2500);
}
