console.log('🧪 Adding test budget entry...');

// Create a test budget entry
const testEntry = {
  id: 'test-' + Date.now(),
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
  additionalNotes: 'Test budget entry created for demonstration',
  status: 'pending',
  submittedAt: new Date().toISOString()
};

// Add to localStorage
const existing = JSON.parse(localStorage.getItem('binal_budget_entries') || '[]');
// Remove default entry if exists
const filtered = existing.filter(e => e.id !== 'default');
filtered.push(testEntry);
localStorage.setItem('binal_budget_entries', JSON.stringify(filtered));

console.log('✅ Test budget entry added!');
console.log('📊 Total entries:', filtered.length);

// Refresh the page to see changes
window.location.reload();