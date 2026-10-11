interface LoopOptions {
    update: (dt: number, elapsed: number) => void;
    onSlow?: () => void; // called when the device keeps missing frames
}

// 0 = uncapped. Set to 30 if you want to hold phones to 30 fps.
const FPS_CAP = 0;

export function startLoop({ update, onSlow }: LoopOptions): () => void {
    const minFrame = FPS_CAP ? 1 / FPS_CAP - 0.002 : 0;
    const expected = FPS_CAP ? 1 / FPS_CAP : 1 / 60;

    let rafId = 0;
    let last = performance.now();
    let acc = 0;
    let elapsed = 0;
    let slow = 0;

    function frame(now: number) {
        rafId = requestAnimationFrame(frame);
        acc += (now - last) / 1000;
        last = now;
        if (acc < minFrame) return; // skipping this frame to hold the cap

        const frameTime = acc;
        const dt = Math.min(frameTime, 0.05);
        acc = 0;
        elapsed += dt;

        // After about 45 slow frames in a row, ask the scene to lower its resolution.
        if (frameTime > expected * 1.5) slow++;
        else slow = Math.max(0, slow - 1);
        if (slow > 45) {
            slow = 0;
            onSlow?.();
        }

        update(dt, elapsed);
    }

    function onVisibility() {
        cancelAnimationFrame(rafId);
        if (!document.hidden) {
            last = performance.now();
            acc = 0;
            rafId = requestAnimationFrame(frame);
        }
    }

    document.addEventListener('visibilitychange', onVisibility);
    rafId = requestAnimationFrame(frame);

    return () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener('visibilitychange', onVisibility);
    };
}