export default function decorate(block) {
  // 1. Define the HTML Structure
  block.innerHTML = `
    <div class="form-container">
      <form id="details-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="Name" placeholder="Enter your name" required>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" name="Email" placeholder="email@example.com" required>
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" name="City" placeholder="e.g. Bangalore" required>
        </div>
        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input type="tel" id="phone" name="Phone" placeholder="10-digit number" required>
        </div>
        <button type="submit" class="submit-button">Save to Spreadsheet</button>
      </form>
      <div id="response-message" class="hidden"></div>
    </div>
  `;

  const form = block.querySelector('#details-form');
  const messageBox = block.querySelector('#response-message');
  const submitBtn = block.querySelector('.submit-button');

  // 2. Handle the Submit Event
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Visual feedback: Disable button while saving
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    // Collect data from inputs
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    /** * IMPORTANT: Replace the URL below with your 
     * Google Apps Script URL or SheetDB API URL 
     **/
    const BACKEND_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

    try {
      // Send the data to the "Middleman"
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors', // Use 'no-cors' for simple Google Scripts
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Show Success Message
      messageBox.textContent = 'Success! Your details have been added.';
      messageBox.className = 'message-success';
      form.reset();

    } catch (error) {
      console.error('Submission Error:', error);
      messageBox.textContent = 'Oops! Something went wrong.';
      messageBox.className = 'message-error';
    } finally {
      // Restore button state
      submitBtn.textContent = 'Save to Spreadsheet';
      submitBtn.disabled = false;
    }
  });
}