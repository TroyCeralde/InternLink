// Very small mouse-parallax for the floating blobs (non-destructive, requestAnimationFrame)
(function () {
    const bg = document.getElementById("hero-bg");
    if (!bg) return;
    const blobs = Array.from(bg.querySelectorAll(".blob"));
    let bounds = bg.getBoundingClientRect();
    let mouse = { x: 0, y: 0 };
    let raf = null;

    function onMove(e) {
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - (bounds.left || 0);
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - (bounds.top || 0);
        mouse.x = (x / (bounds.width || 1)) - 0.5;
        mouse.y = (y / (bounds.height || 1)) - 0.5;
        if (!raf) raf = requestAnimationFrame(update);
    }

    function update() {
        raf = null;
        blobs.forEach((b, i) => {
            const depth = (i + 1) / (blobs.length + 1);
            const tx = mouse.x * 18 * depth;
            const ty = mouse.y * 14 * depth;
            b.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        });
    }

    function onResize() { bounds = bg.getBoundingClientRect(); }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
})();