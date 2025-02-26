// This script will be injected into the webpage
function checkDocuments() {
  // Predefined list of treatments and their corresponding document names
  const treatments = [
    { name: 'Breast Lump - Excision - Unilateral', documents: ['undefined'] },
    { name: 'Cesarean delivery', documents: ['Document3', 'Document4'] },
    { name: 'TreatmentC', documents: ['Document5', 'Document6'] }
  ];

  // Find all <dt> elements with the class 't-AVPList-label'
  const labels = document.querySelectorAll('dt.t-AVPList-label');
  let treatmentValue = null;

  // Iterate through the labels to find the one with the text "Treatment"
  labels.forEach(label => {
    if (label.innerText.trim() === 'Treatment') {
      // Find the corresponding <dd> element
      const valueElement = label.nextElementSibling;

      // Check if the next sibling is a <dd> element and has the class 't-AVPList-value'
      if (valueElement && valueElement.tagName === 'DD' && valueElement.classList.contains('t-AVPList-value')) {
        // Extract the inner text of the span inside the <dd> element
        const spanElement = valueElement.querySelector('span');
        if (spanElement) {
          treatmentValue = spanElement.innerText.trim();
        }
      }
    }
  });

  // Check if treatmentValue was found
  if (!treatmentValue) {
    alert('Treatment value not found on the page.');
    return;
  }

  // Find the corresponding treatment from the predefined list
  const matchedTreatment = treatments.find(treatment => treatment.name === treatmentValue);

  if (!matchedTreatment) {
    alert(`No predefined documents found for treatment: ${treatmentValue}`);
    return;
  }

  // Fetch all PDF navigation items and map their text content
  const pdfNavigationItems = Array.from(document.querySelectorAll('#pdfNavigation li')).map(li => li.innerText.trim());

  // Check if all documents for the matched treatment exist in the PDF navigation list
  const missingDocuments = matchedTreatment.documents.filter(doc => !pdfNavigationItems.includes(doc));

  if (missingDocuments.length > 0) {
    alert(`Missing documents for treatment "${treatmentValue}": ${missingDocuments.join(', ')}`);
  } else {
    alert('All documents are present.');
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkDocuments') {
    checkDocuments();
    sendResponse({ status: 'done' });
  }
});
