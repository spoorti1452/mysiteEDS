export default function decorate(block) {
  const form = document.createElement('form');

  [...block.querySelectorAll('tr')].forEach((row) => {
    const cols = row.querySelectorAll('td');
    if (cols.length < 3) return;

    const labelText = cols[0].textContent.trim();
    const name = cols[1].textContent.trim();
    const type = cols[2].textContent.trim();
    const required = cols[3]?.textContent.trim() === 'true';

    if (type === 'submit') {
      const button = document.createElement('button');
      button.type = 'submit';
      button.textContent = labelText;
      form.append(button);
      return;
    }

    const wrapper = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = labelText;

    const input = type === 'textarea'
      ? document.createElement('textarea')
      : document.createElement('input');

    input.name = name;
    input.type = type;
    if (required) input.required = true;

    wrapper.append(label, input);
    form.append(wrapper);
  });

  block.textContent = '';
  block.append(form);
}