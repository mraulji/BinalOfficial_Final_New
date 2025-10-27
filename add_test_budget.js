// Simple script to add a test budget entry
const testBudgetEntry = {
  id: 'budget-test-' + Date.now(),
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+91 98765 43210',
  eventDate: '2024-12-25',
  services: [
    {
      serviceId: 's1',
      serviceName: 'Wedding Photography',
      quantity: 1,
      unitPrice: 50000,
      totalPrice: 50000
    },
    {
      serviceId: 's2',
      serviceName: 'Videography',
      quantity: 1,
      unitPrice: 75000,
      totalPrice: 75000
    }
  ],
  totalAmount: 125000,
  additionalNotes: 'This is a test budget entry for demonstration purposes.',
  status: 'pending',
  submittedAt: new Date().toISOString()
};

// Add to localStorage
const existingEntries = JSON.parse(localStorage.getItem('binal_budget_entries') || '[]');
existingEntries.push(testBudgetEntry);
localStorage.setItem('binal_budget_entries', JSON.stringify(existingEntries));

console.log('✅ Test budget entry added:', testBudgetEntry);
console.log('📊 Total entries:', existingEntries.length);

// Trigger update event
window.dispatchEvent(new CustomEvent('localStorage-update', {
  detail: {
    key: 'binal_budget_entries',
    value: existingEntries
  }
}));