document.addEventListener('DOMContentLoaded', () => {
    const formTemplatesContainer = document.getElementById('form-templates');
    const formSelect = document.getElementById('formSelect');
    const exportBtn = document.getElementById('exportBtn');

    async function fetchTemplates() {
        try {
            const response = await fetch('http://localhost:8081/api/forms'); //  endpoint
            const forms = await response.json();

            formTemplatesContainer.innerHTML = '';
            formSelect.innerHTML = '';

            forms.forEach(form => {
                const templateHTML = `
                    <div class="col-lg-11 col-xl-9 col-xxl-8 mb-4">
                        <div class="card shadow border-0 rounded-4">
                            <div class="card-body p-5">
                                <div class="row align-items-center gx-5">
                                    <div class="col text-center text-lg-start mb-4 mb-lg-0">
                                        <div class="bg-light p-4 rounded-4">
                                            <div class="text-primary fw-bolder mb-2">${form.name || 'Unnamed Form'}</div>
                                            <div class="small fw-bolder">${form.description || 'No description available'}</div>
                                        </div>
                                    </div>
                                    <div class="col-lg-8 text-center text-lg-start">
                                        <a href="viewForm.html?id=${form.id}" class="btn btn-primary">View Form</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                formTemplatesContainer.innerHTML += templateHTML;

                const option = document.createElement('option');
                option.value = form.id;
                option.textContent = form.name || 'Unnamed Form';
                formSelect.appendChild(option);
            });

            exportBtn.addEventListener('click', () => {
                const selectedFormId = formSelect.value;
                if (selectedFormId) {
                    window.location.href = `http://localhost:8081/api/pdf/export?formId=${selectedFormId}`;
                } else {
                    alert('Please select a form to export.');
                }
            });

        } catch (error) {
            console.error('Error fetching forms:', error);
            formTemplatesContainer.innerHTML = '<p>Failed to load templates. Please try again later.</p>';
        }
    }

    fetchTemplates();
});
