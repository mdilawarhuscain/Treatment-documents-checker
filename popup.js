// Add event listener to the button with ID 'checkDocuments'
document.getElementById('checkDocuments').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Send a message to the content script in the active tab
    chrome.tabs.sendMessage(tabs[0].id, { action: 'checkDocuments' }, (response) => {
      if (response && response.status === 'done') {
        console.log('Check completed successfully.');
      } else {
        console.error('Failed to run checkDocuments or no response received.');
      }
    });
  });
});
