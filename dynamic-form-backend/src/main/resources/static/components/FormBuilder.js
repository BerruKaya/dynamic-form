class FormBuilder {
    constructor(containerId, editPanelId) {
      this.container = document.getElementById(containerId);
      this.editPanel = document.getElementById(editPanelId);
      this.elements = [];
      this.editingElementId = null;
      this.formName = '';
      this.savedFormNames = new Set();
      this.formDescription = '';

      document.getElementById('save-changes').addEventListener('click', () => this.saveChanges());
      document.getElementById('add-option-button').addEventListener('click', () => this.addOption());
      document.getElementById('save-form-button').addEventListener('click', () => this.saveForm());
      document.getElementById('delete-button').addEventListener('click', () => this.removeElement());

      //  form name input
      document.getElementById('form-name').addEventListener('input', (e) => {
        this.formName = e.target.value;
      });
      document.getElementById('form-description').addEventListener('input', (e) => {
        this.formDescription = e.target.value;
    });
    }



    addElement(type) {
      const newElement = {
        id: this.elements.length + 1,
        type: type,
        label: '',
        name: '',
        placeholder: '',
        required: false,
        options: []
      };

      this.elements.push(newElement);
      this.renderElement(newElement);
    }

    renderElement(element) {
      const elementDiv = document.createElement('div');
      elementDiv.className = 'form-element';
      elementDiv.id = `element-${element.id}`;

      const inputWrapper = document.createElement('div');

      // Create the input element based on the type
      let inputElement;
      switch (element.type) {
        case 'text':
        case 'number':
        case 'email':
          inputElement = document.createElement('input');
          inputElement.type = element.type;
          inputElement.placeholder = element.placeholder;
          break;
        case 'textarea':
          inputElement = document.createElement('textarea');
          inputElement.placeholder = element.placeholder;
          break;
        case 'checkbox':
          inputElement = document.createElement('div');
          element.options.forEach((option, index) => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `checkbox-${element.id}-${index}`;
            checkbox.name = element.name;
            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = option;
            inputElement.appendChild(checkbox);
            inputElement.appendChild(label);
            inputElement.appendChild(document.createElement('br'));
          });
          break;
        case 'radio':
          inputElement = document.createElement('div');
          element.options.forEach((option, index) => {
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `radio-${element.id}-${index}`;
            radio.name = element.name;
            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = option;
            inputElement.appendChild(radio);
            inputElement.appendChild(label);
            inputElement.appendChild(document.createElement('br'));
          });
          break;
        case 'select':
          inputElement = document.createElement('select');
          element.options.forEach((option, index) => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            inputElement.appendChild(optionElement);
          });
          break;
        case 'date':
          inputElement = document.createElement('input');
          inputElement.type = 'date';
          break;
        default:
          inputElement = document.createElement('input');
          inputElement.type = 'text';
      }

      inputElement.id = `input-${element.id}`;
      inputElement.name = element.name;
      inputElement.required = element.required;

      inputWrapper.appendChild(inputElement);

      elementDiv.appendChild(inputWrapper);

      // edit button
      const editButton = document.createElement('span');
      editButton.innerText = '✏️';
      editButton.className = 'edit-button';
      editButton.onclick = () => this.editElement(element.id);
      elementDiv.appendChild(editButton);

      this.container.appendChild(elementDiv);
    }

    editElement(id) {
      this.editingElementId = id;
      const element = this.elements.find(el => el.id === id);

      document.getElementById('element-label').value = element.label;
      document.getElementById('element-name').value = element.name;
      document.getElementById('element-placeholder').value = element.placeholder;
      document.getElementById('element-required').checked = element.required;

      const optionsContainer = document.getElementById('options-container');
      if (['radio', 'checkbox', 'select'].includes(element.type)) {
        optionsContainer.style.display = 'block';
        this.renderOptions(element.options);
      } else {
        optionsContainer.style.display = 'none';
      }

      this.editPanel.style.display = 'block';
    }

    removeElement() {
      if (this.editingElementId !== null) {
        // Remove element from DOM
        const elementDiv = document.getElementById(`element-${this.editingElementId}`);
        if (elementDiv) {
          this.container.removeChild(elementDiv);
        }

        this.elements = this.elements.filter(el => el.id !== this.editingElementId);

        this.editPanel.style.display = 'none';
        this.editingElementId = null;
      } else {
        console.log('No element selected for removal.');
      }
    }

    renderOptions(options) {
      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = ''; // Clear existing options

      options.forEach((option, index) => {
        const optionInput = document.createElement('input');
        optionInput.type = 'text';
        optionInput.value = option;
        optionInput.id = `option-${index}`;
        optionInput.onchange = (e) => this.updateOption(index, e.target.value);

        optionsDiv.appendChild(optionInput);
      });
    }

    updateOption(index, value) {
      const element = this.elements.find(el => el.id === this.editingElementId);
      if (element) {
        element.options[index] = value;

        this.renderOptions(element.options);
      }
    }

    addOption() {
      const element = this.elements.find(el => el.id === this.editingElementId);
      if (element) {
        element.options.push('');
        this.renderOptions(element.options);
      }
    }

    saveChanges() {
      const element = this.elements.find(el => el.id === this.editingElementId);

      if (element) {
        // Update properties
        element.label = document.getElementById('element-label').value;
        element.name = document.getElementById('element-name').value;
        element.placeholder = document.getElementById('element-placeholder').value;
        element.required = document.getElementById('element-required').checked;

        element.options = element.options.filter(option => option.trim() !== '');

        this.editPanel.style.display = 'none';
        this.refreshForm();
      }
    }

    saveForm() {
        if (!this.formName.trim()) {
          alert('Please enter a name for the form.');
          return;
        }

        if (this.savedFormNames.has(this.formName)) {
          alert('A form with this name already exists.');
          return;
        }

        // Collect form data
        const formData = {
        name: this.formName,
        description: this.formDescription,
        elements: this.elements
    };
      // Send the form data to the backend
      fetch('http://localhost:8081/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Form saved successfully:', data);

        this.savedFormNames.add(this.formName);
         this.formName = '';
         this.formDescription = '';

        document.getElementById('form-name').value = '';
        document.getElementById('form-description').value = '';
      })
      .catch((error) => {
        console.error('Error saving form:', error);
        alert('Failed to save the form. Please try again.');
      });
    }

    refreshForm() {
      this.container.innerHTML = '<h3>Drop Zone (Build Your Form Here)</h3>';
      this.elements.forEach(el => this.renderElement(el));
    }
  }

  export default FormBuilder;
