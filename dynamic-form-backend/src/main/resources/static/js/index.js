import FormBuilder from '../components/FormBuilder.js';

document.addEventListener('DOMContentLoaded', () => {
  const formBuilder = new FormBuilder('form-builder-container', 'edit-panel');

  // drop zone kısmına sürükleme
  const dropZone = document.getElementById('form-builder-container');
  dropZone.addEventListener('dragover', (e) => e.preventDefault());

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    formBuilder.addElement(elementType);
  });

  const draggableItems = document.querySelectorAll('.draggable-item');
  draggableItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.type);
    });
  });


  document.getElementById('save-changes').addEventListener('click', () => {
    formBuilder.saveChanges();
  });

  document.getElementById('add-option-button').addEventListener('click', () => {
    addOptionButton.removeEventListener('click', handleAddOption);
    formBuilder.addOption();
  });

  document.getElementById('delete-button').addEventListener('click', () => {
    formBuilder.removeElement();
  });

  document.getElementById('save-form-button').addEventListener('click', () => {
    saveFormButton.removeEventListener('click', handleSave);
    formBuilder.saveForm();
  });
});
