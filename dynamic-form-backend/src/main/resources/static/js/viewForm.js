// URL'den form id'sini al
const urlParams = new URLSearchParams(window.location.search);
const formId = urlParams.get('id');
console.log('Form ID:', formId);

if (formId) {
  fetch(`http://localhost:8081/api/forms/${formId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch form');
      }
      return response.json();
    })
    .then(formData => {
      console.log('Form Data:', formData);
      renderForm(formData);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function renderForm(formData) {
  const formContent = document.getElementById('form-container');
  if (!formContent) {
    console.error("Element with ID 'form-content' not found.");
    return;
  }

  formContent.innerHTML = '';

  const form = document.createElement('form');
  form.id = 'dynamicForm';

  if (formData.elements && Array.isArray(formData.elements)) {
    formData.elements.forEach((element) => {
      const formElement = document.createElement('div');
      formElement.classList.add('form-group', 'mb-3'); // Bootstrap

      const label = document.createElement('label');
      label.innerText = element.label || element.name || 'Untitled';
      formElement.appendChild(label);

      let inputElement;

      switch (element.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'date':
          inputElement = document.createElement('input');
          inputElement.type = element.type;
          inputElement.name = element.name;
          inputElement.classList.add('form-control');
          inputElement.placeholder = element.placeholder || '';
          break;
        case 'textarea':
          inputElement = document.createElement('textarea');
          inputElement.name = element.name;
          inputElement.classList.add('form-control');
          inputElement.placeholder = element.placeholder || '';
          break;

        case 'select':
          inputElement = document.createElement('select');
          inputElement.name = element.name;
          inputElement.classList.add('form-select');
          element.options.forEach(optionText => {
            const option = document.createElement('option');
            option.value = optionText;
            option.innerText = optionText;
            inputElement.appendChild(option);
          });
          break;

        case 'radio':
        case 'checkbox':
          inputElement = document.createElement('div');
          element.options.forEach(optionText => {
            const optionWrapper = document.createElement('div');
            optionWrapper.classList.add('form-check');
            const optionInput = document.createElement('input');
            optionInput.type = element.type;
            optionInput.name = element.name;
            optionInput.value = optionText;
            optionInput.classList.add('form-check-input');
            const optionLabel = document.createElement('label');
            optionLabel.classList.add('form-check-label');
            optionLabel.innerText = optionText;

            optionWrapper.appendChild(optionInput);
            optionWrapper.appendChild(optionLabel);
            inputElement.appendChild(optionWrapper);
          });
          break;

        default:
          console.warn(`Unsupported element type: ${element.type}`);
      }

      if (inputElement) {
        formElement.appendChild(inputElement);
      }

      form.appendChild(formElement);
    });

    formContent.appendChild(form);

    // submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('btn', 'btn-primary');
    submitButton.innerText = 'Send';
    submitButton.addEventListener('click', submitForm);
    form.appendChild(submitButton);

  } else {
    console.error('Form elements are undefined or not an array');
  }
}

function submitForm() {
  const form = document.getElementById('dynamicForm');
  const formData = new FormData(form);

  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });

  console.log('Form Data to submit:', jsonData);

  // Send the filled form data to the backend
  fetch('http://localhost:8081/api/submissions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      formId: formId,
      formData: jsonData
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      return response.json();
    })
    .then(result => {
      console.log('Form submitted successfully:', result);
      alert('Form submitted successfully!');
    })
    .catch(error => {
      console.error('Error submitting form:', error);
    });
}
