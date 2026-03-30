/**
 * Stopwatch — script.js
 * States: STOPPED | RUNNING | PAUSED
 * Engine: requestAnimationFrame + performance.now() for sub-millisecond accuracy.
 * DOM updates only when the displayed value changes (optimised render).
 */

;(function () {
  'use strict';

  /* ─── State ─────────────────────────────────────────────────── */
  const STATE = { STOPPED: 'stopped', RUNNING: 'running', PAUSED: 'paused' };

  let state       = STATE.STOPPED;
  let elapsed     = 0;       // total accumulated ms
  let startMark   = 0;       // performance.now() snapshot when last started/resumed
  let rafId       = null;    // requestAnimationFrame handle

  /* ─── DOM refs ───────────────────────────────────────────────── */
  const elHH      = document.getElementById('hh');
  const elMM      = document.getElementById('mm');
  const elSS      = document.getElementById('ss');
  const elMillis  = document.getElementById('millis');
  const btnPrimary= document.getElementById('btn-primary');
  const btnClear  = document.getElementById('btn-clear');

  /* ─── Last rendered cache (avoid unnecessary DOM writes) ─────── */
  let lastHH = -1, lastMM = -1, lastSS = -1, lastMs = -1;

  /* ─── Helpers ────────────────────────────────────────────────── */
  const pad2  = n => String(n).padStart(2, '0');
  const pad3  = n => String(n).padStart(3, '0');

  function decompose(ms) {
    const totalSec = Math.floor(ms / 1000);
    return {
      hh:   Math.floor(totalSec / 3600),
      mm:   Math.floor((totalSec % 3600) / 60),
      ss:   totalSec % 60,
      msec: Math.floor(ms % 1000),
    };
  }

  /* ─── Render ─────────────────────────────────────────────────── */
  function render() {
    const now = (state === STATE.RUNNING)
      ? elapsed + (performance.now() - startMark)
      : elapsed;

    const { hh, mm, ss, msec } = decompose(now);

    if (hh   !== lastHH)   { elHH.textContent    = pad2(hh);   lastHH  = hh;   }
    if (mm   !== lastMM)   { elMM.textContent    = pad2(mm);   lastMM  = mm;   }
    if (ss   !== lastSS)   { elSS.textContent    = pad2(ss);   lastSS  = ss;   }
    if (msec !== lastMs)   { elMillis.textContent = pad3(msec); lastMs  = msec; }

    if (state === STATE.RUNNING) {
      rafId = requestAnimationFrame(render);
    }
  }

  /* ─── UI sync ────────────────────────────────────────────────── */
  function syncUI() {
    // Body class drives CSS (glow, sep animation, etc.)
    document.body.className = state;

    switch (state) {
      case STATE.STOPPED:
        btnPrimary.textContent = 'Start';
        btnPrimary.className   = '';
        btnClear.disabled      = true;
        break;

      case STATE.RUNNING:
        btnPrimary.textContent = 'Pause';
        btnPrimary.className   = '';
        btnClear.disabled      = false;
        break;

      case STATE.PAUSED:
        btnPrimary.textContent = 'Continue';
        btnPrimary.className   = 'state-continue';
        btnClear.disabled      = false;
        break;
    }
  }

  /* ─── Actions ────────────────────────────────────────────────── */
  function start() {
    if (state !== STATE.STOPPED) return;
    state     = STATE.RUNNING;
    startMark = performance.now();
    syncUI();
    rafId = requestAnimationFrame(render);
  }

  function pause() {
    if (state !== STATE.RUNNING) return;
    cancelAnimationFrame(rafId);
    rafId   = null;
    elapsed += performance.now() - startMark;   // bank accumulated time
    state   = STATE.PAUSED;
    syncUI();
    render();   // freeze display at exact pause moment
  }

  function resume() {
    if (state !== STATE.PAUSED) return;
    state     = STATE.RUNNING;
    startMark = performance.now();               // re-anchor timestamp
    syncUI();
    rafId = requestAnimationFrame(render);
  }

  function clear() {
    if (state === STATE.RUNNING) cancelAnimationFrame(rafId);
    rafId   = null;
    state   = STATE.STOPPED;
    elapsed = 0;

    // Reset render cache so next render() writes all segments
    lastHH = lastMM = lastSS = lastMs = -1;

    syncUI();
    render();   // push zeros to DOM
  }

  /* ─── Event wiring ───────────────────────────────────────────── */
  btnPrimary.addEventListener('click', () => {
    if      (state === STATE.STOPPED) start();
    else if (state === STATE.RUNNING) pause();
    else if (state === STATE.PAUSED)  resume();
  });

  btnClear.addEventListener('click', () => {
    if (state !== STATE.STOPPED) clear();
  });

  /* ─── Boot ───────────────────────────────────────────────────── */
  syncUI();
  render();

})();