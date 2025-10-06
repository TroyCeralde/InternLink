// Enhanced loading controller: showLoading(text, options), hideLoading(), setProgress(percent)
// Also auto-attaches to buttons with .loading-link and data-href attribute.

(function () {
    const overlay = document.getElementById("loading-overlay");
    const textEl = document.getElementById("loading-text");
    const progressEl = document.getElementById("loading-progress");
    let autoTimer = null;
    let rafId = null;
    let current = 0;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function animateTo(target, duration = 800) {
        cancelAnimationFrame(rafId);
        const start = performance.now();
        const from = current;
        const diff = target - from;
        function step(now) {
            const t = clamp((now - start) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
            current = from + diff * eased;
            if (progressEl) progressEl.style.width = `${Math.floor(current)}%`;
            if (t < 1) rafId = requestAnimationFrame(step);
        }
        rafId = requestAnimationFrame(step);
    }

    function autoAdvanceStart() {
        clearInterval(autoTimer);
        current = parseFloat(progressEl.style.width) || 0;
        autoTimer = setInterval(() => {
            // small random increases, but never exceed 92%
            const inc = Math.random() * 6 + 2;
            const next = clamp(current + inc, 6, 92);
            animateTo(next, 420);
        }, 360);
    }

    function showLoading(text = "Loading...", options = {}) {
        if (!overlay) return;
        if (typeof text === "string" && textEl) textEl.textContent = text;
        overlay.classList.remove("hidden");
        overlay.setAttribute("aria-hidden", "false");
        // reset and show initial progress
        if (progressEl) {
            progressEl.style.width = `${options.start || 6}%`;
            current = options.start || 6;
        }
        // start auto progress unless explicitly disabled
        if (options.autoProgress !== false) autoAdvanceStart();
        // optional ring pulse speed control
        if (options.fast) overlay.querySelectorAll(".ring").forEach(r => r.style.animationDuration = "5s");
    }

    function hideLoading(fast = false) {
        if (!overlay) return;
        clearInterval(autoTimer);
        cancelAnimationFrame(rafId);
        // finish progress to 100 with a smooth curve
        animateTo(100, fast ? 180 : 380);
        setTimeout(() => {
            overlay.classList.add("hidden");
            overlay.setAttribute("aria-hidden", "true");
            // reset progress after hiding
            setTimeout(() => {
                if (progressEl) progressEl.style.width = `0%`;
                current = 0;
            }, 220);
        }, 420);
    }

    function setProgress(percent) {
        if (!progressEl) return;
        percent = clamp(percent, 0, 100);
        clearInterval(autoTimer);
        cancelAnimationFrame(rafId);
        animateTo(percent, 360);
    }

    // helper: simulate flow then navigate (used by welcome buttons)
    function attachNavButtons() {
        const links = document.querySelectorAll(".loading-link[data-href]");
        links.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const href = btn.getAttribute("data-href");
                showLoading("Opening …");
                // simulate a little load and navigate when progress ~95%
                // we'll smooth to 92% then after a short pause finish and navigate
                animateTo(92, 900);
                setTimeout(() => {
                    animateTo(100, 280);
                    setTimeout(() => {
                        window.location.href = href;
                    }, 320);
                }, 1200);
            });
        });
    }

    // expose globally
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.setLoadingProgress = setProgress;

    // default UX: show until window load, then hide quickly
    document.addEventListener("DOMContentLoaded", () => {
        // only show if overlay exists
        if (overlay) showLoading("Preparing page…", { autoProgress: true });
        attachNavButtons();
    });
    window.addEventListener("load", () => {
        // keep overlay visible briefly to show smooth entry
        setTimeout(() => hideLoading(), 600);
    });
})();