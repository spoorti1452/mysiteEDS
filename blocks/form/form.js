export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  try {
    const response = await fetch(link.href);
    const data = await response.json();
    const fields = data.data || data;

    const form = document.createElement('form');
    form.classList.add('dynamic-form');

    // Build the form fields from info sheet
    fields.forEach((field) => {
      if (!field.Type) return;

      if (field.Type.toLowerCase() === 'submit') {
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = field.Label;
        button.classList.add('form-submit-btn');
        form.appendChild(button);
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.classList.add('form-group');

      const label = document.createElement('label');
      label.textContent = field.Label;

      let input;
      const type = field.Type.toLowerCase();
      if (type === 'message') {
        input = document.createElement('textarea');
      } else {
        input = document.createElement('input');
        input.type = (type === 'mobile') ? 'tel' : (type === 'number' ? 'number' : 'text');
      }

      input.name = field.Name; // Matches Google Sheet Headers
      input.placeholder = field.placeholder || '';
      input.required = true;

      wrapper.appendChild(label);
      wrapper.appendChild(input);
      form.appendChild(wrapper);
    });

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const jsonData = Object.fromEntries(formData.entries());
      const submitBtn = form.querySelector('button[type="submit"]');
      
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwkoWf2rufULoukcIFF1bEsBbLeR_zKIiF1zR6Alrsw4ycAKGvJn-n88LPonj6m63pW/exec';

        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
        });

        // 1. Reset the form fields
        form.reset();

        // 2. Clear old success messages
        const oldMsg = form.querySelector('.success-msg');
        if (oldMsg) oldMsg.remove();

        // 3. Add new success message below the button
        const message = document.createElement('p');
        message.classList.add('success-msg');
        message.textContent = 'Form Submitted Successfully';
        message.style.cssText = 'color: green; font-weight: bold; margin-top: 15px; text-align: center;';
        
        form.appendChild(message);

      } catch (error) {
        console.error('Error!', error);
        alert('Submission Failed. Please try again.');
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = fields.find(f => f.Type.toLowerCase() === 'submit').Label;
      }
    });

    block.innerHTML = '';
    block.appendChild(form);

  } catch (error) {
    console.error('Error loading form:', error);
  }
}