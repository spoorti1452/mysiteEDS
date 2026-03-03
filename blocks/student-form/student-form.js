/**
 * Student Form Block
 * Fetches structure from an AEM Sheet (da.live) and submits to the 'incoming' tab.
 */
export default async function decorate(block) {
  // 1. Extract the link to the JSON from the block table
  const link = block.querySelector('a');
  if (!link) {
    block.textContent = 'Error: No link to the spreadsheet found.';
    return;
  }

  const jsonUrl = link.href;

  try {
    const resp = await fetch(jsonUrl);
    if (!resp.ok) throw new Error('Failed to fetch form JSON');
    
    const json = await resp.json();

    // 2. Determine where the data is. 
    // In da.live tabs, it's usually json.form.data. If flat, it's json.data.
    const fields = json.form ? json.form.data : json.data;
    
    if (!fields || fields.length === 0) {
      block.textContent = 'Error: Form structure is empty.';
      return;
    }

    // 3. Create the Form element
    const form = document.createElement('form');
    form.className = 'student-registration-form';
    
    // The action URL for submission is the spreadsheet URL without .json
    const actionUrl = jsonUrl.split('.json')[0];

    // 4. Loop through fields from the 'form' sheet to build HTML
    fields.forEach((field) => {
      const fieldType = field.Type?.toLowerCase();
      const fieldName = field.Field;
      const fieldLabel = field.Label;
      const isMandatory = field.Mandatory === 'true';

      // Create a wrapper for each field
      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'field-wrapper';

      // Handle Submit Button separately
      if (fieldType === 'submit') {
        const button = document.createElement('button');
        button.type = 'submit';
        button.className = 'button primary';
        button.textContent = fieldLabel || 'Submit';
        form.append(button);
        return;
      }

      // Create Label
      const label = document.createElement('label');
      label.setAttribute('for', fieldName);
      label.textContent = fieldLabel;
      if (isMandatory) label.classList.add('required');
      fieldWrapper.append(label);

      let input;
      if (fieldType === 'select') {
        // Create Dropdown
        input = document.createElement('select');
        const options = field.Options ? field.Options.split(',') : [];
        
        // Add a default placeholder
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select an option...';
        placeholder.disabled = true;
        placeholder.selected = true;
        input.append(placeholder);

        options.forEach((opt) => {
          const option = document.createElement('option');
          option.value = opt.trim();
          option.textContent = opt.trim();
          input.append(option);
        });
      } else {
        // Create Text/Email/Number inputs
        input = document.createElement('input');
        input.type = fieldType || 'text';
      }

      input.id = fieldName;
      input.name = fieldName;
      if (isMandatory) input.required = true;

      fieldWrapper.append(input);
      form.append(fieldWrapper);
    });

    // 5. Handle Form Submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const payload = {};
      
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      // Prepare submission for AEM Form Service (wraps data in a 'data' key)
      try {
        const postResp = await fetch(actionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: payload }),
        });

        if (postResp.ok) {
          alert('Success! Student details saved.');
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        alert('Error submitting form. Ensure the sheet is published.');
        console.error(err);
      }
    });

    // 6. Replace block content with the new form
    block.textContent = '';
    block.append(form);

  } catch (error) {
    block.textContent = 'Error: Could not load the student form.';
    console.error(error);
  }
}