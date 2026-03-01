/**
 * Form block for da.live (Edge Delivery Services / Franklin)
 *
 * Authoring format (4 columns):
 * Label | Name | Type | Required
 * Example rows:
 * Name   | name   | text   | true
 * Email  | email  | email  | true
 * Submit | submit | submit |
 *
 * Notes:
 * - da.live converts tables to a div-grid: block > row(div) > cell(div) > p/strong
 * - This decorator supports both div-grid and real tables.
 * - Required accepts true/yes/1 (case-insensitive).
 * - Supports textarea and common input types; unknown types fall back to text.
 */
export default function decorate(block) {
  console.log('Decorating form block (da.live)', block); // Keep this while debugging

  const form = document.createElement('form');
  form.setAttribute('novalidate', '');

  // ---- helpers -------------------------------------------------------------

  const text = (el) => (el?.textContent || '').trim();
  const isTrue = (v) => /^(true|yes|1)$/i.test((v || '').trim());
  const normalizeType = (t) => {
    const raw = (t || '').toLowerCase();
    if (raw === 'message') return 'textarea'; // legacy alias
    return raw || 'text';
  };

  const buildField = ({ labelText, nameText, type, required }) => {
    // Submit row
    if (type === 'submit') {
      const btn = document.createElement('button');
      btn.type = 'submit';
      btn.textContent = labelText || 'Submit';
      btn.className = 'form-submit';
      form.append(btn);
      return;
    }

    const field = document.createElement('div');
    field.className = 'form-field';

    const safeName = (nameText || labelText || 'field')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

    const id = `form-${safeName}-${Math.random().toString(36).slice(2, 7)}`;

    let control;

    if (type === 'textarea') {
      control = document.createElement('textarea');
      control.rows = 4;
    } else {
      const valid = new Set([
        'text', 'email', 'number', 'tel', 'url',
        'date', 'password', 'search', 'checkbox',
        'radio', 'file', 'color', 'range', 'hidden',
      ]);
      control = document.createElement('input');
      control.type = valid.has(type) ? type : 'text';
    }

    control.name = safeName;
    control.id = id;
    if (required) control.required = true;

    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = labelText || safeName;

    if (control.type === 'checkbox' || control.type === 'radio') {
      field.classList.add(`is-${control.type}`);
      field.append(control, label);
    } else {
      field.append(label, control);
    }

    form.append(field);
  };

  // ---- parse authored content ---------------------------------------------

  // First try the da.live div-grid format
  const rowDivs = [...block.children].filter((el) => el.tagName === 'DIV');

  const looksLikeDivGrid =
    rowDivs.length &&
    [...rowDivs[0].children].every((cell) => cell.tagName === 'DIV');

  if (looksLikeDivGrid) {
    rowDivs.forEach((row, idx) => {
      // Header row usually contains <strong> in the first cell
      if (idx === 0) {
        const firstCell = row.querySelector(':scope > div');
        const isHeader = !!firstCell?.querySelector('strong');
        if (isHeader) return; // skip header
      }

      const cells = [...row.children].filter((el) => el.tagName === 'DIV');
      if (cells.length < 3) return;

      const labelText = text(cells[0]);
      const nameText  = text(cells[1]);
      const type      = normalizeType(text(cells[2]));
      const required  = cells[3] ? isTrue(text(cells[3])) : false;

      buildField({ labelText, nameText, type, required });
    });
  } else {
    // Fallback: real table (rare in da.live, but safe to support)
    const trs = block.querySelectorAll('tr');
    trs.forEach((tr, idx) => {
      const ths = tr.querySelectorAll('th');
      if (ths.length) return; // header

      const tds = tr.querySelectorAll('td');
      if (tds.length < 3) return;

      const labelText = text(tds[0]);
      const nameText  = text(tds[1]);
      const type      = normalizeType(text(tds[2]));
      const required  = tds[3] ? isTrue(text(tds[3])) : false;

      buildField({ labelText, nameText, type, required });
    });
  }

  // Replace the authored grid/table with the real form
  block.textContent = '';
  block.append(form);
}