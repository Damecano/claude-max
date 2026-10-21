// Fills [data-spec="key"] from window.__SPECS__ (data/specs.json, injected by tools/render.mjs).
// Missing value: element inside [data-optional] wrapper -> wrapper is hidden; otherwise shows ⟨__⟩ (class .ph).
// res_total_kg is summed automatically when all five band values are present.
(function () {
  const S = Object.assign({}, window.__SPECS__ || {});
  const num = v => parseFloat(String(v).replace(',', '.'));
  const bands = ['yellow', 'green', 'red', 'blue', 'black'].map(c => S['res_' + c + '_kg']);
  if ((S.res_total_kg == null || S.res_total_kg === '') && bands.every(v => v != null && v !== '' && !isNaN(num(v)))) {
    const t = bands.reduce((a, v) => a + num(v), 0);
    S.res_total_kg = String(Math.round(t * 10) / 10).replace('.', ',');
  }
  document.querySelectorAll('[data-spec]').forEach(el => {
    const v = S[el.dataset.spec];
    if (v == null || v === '') {
      const wrap = el.closest('[data-optional]');
      if (wrap) wrap.style.display = 'none';
      else { el.textContent = '⟨__⟩'; el.classList.add('ph'); }
    } else el.textContent = String(v);
  });
  document.documentElement.dataset.bound = '1';
})();
