export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const jsonUrl = link.href;

  try {
    const resp = await fetch(jsonUrl);
    if (!resp.ok) return;
    
    const json = await resp.json();
    const fields = json.form ? json.form.data : json.data;
    
    if (!fields) return;

    const form = document.createElement('form');
    form.className = 'student-registration-form';
    
    // CRITICAL: We must submit to the .live URL for POST to work
    // We remove .json and ensure the domain is .live
    const actionUrl = jsonUrl.replace('.page', '.live').split('.json')[0];

    fields.forEach((field) => {
      const fieldType = field.Type?.toLowerCase();
      if (fieldType === 'submit') {
        const button = document.createElement('button');
        button.type = 'submit';
        button.textContent = field.Label || 'Submit';
        form.append(button);
        return;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'field-wrapper';
      
      const label = document.createElement('label');
      label.textContent = field.Label;
      label.setAttribute('for', field.Field);
      
      let input;
      if (fieldType === 'select') {
        input = document.createElement('select');
        const options = field.Options ? field.Options.split(',') : [];
        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.trim();
          option.textContent = opt.trim();
          input.append(option);
        });
      } else {
        input = document.createElement('input');
        input.type = fieldType || 'text';
      }

      input.id = field.Field;
      input.name = field.Field;
      if (field.Mandatory === 'true') input.required = true;

      wrapper.append(label, input);
      form.append(wrapper);
    });

    // Handle Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Collect data into the format AEM Sheets expects
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      try {
        const postResp = await fetch(actionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The payload MUST be wrapped in a "data" object
          body: JSON.stringify({ data }),
        });

        if (postResp.ok) {
          alert('Success! Data saved to the incoming sheet.');
          form.reset();
        } else {
          const errorText = await postResp.text();
          console.error('Submission Error Details:', errorText);
          alert('Submission failed. Check Console (F12) for details.');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        alert('Network error. Check if you are logged into the Sidekick.');
      }
    });

    block.textContent = '';
    block.append(form);
  } catch (error) {
    console.error('Block Decoration Error:', error);
  }
}