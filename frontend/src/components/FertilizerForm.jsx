import { useState } from 'react';

function FertilizerForm({ contract }) {
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tx = await contract.addFertilizerRecord(type, quantity, location);
      await tx.wait();
      alert("Record added!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Fertilizer Type" required />
      <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" required />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" required />
      <button type="submit">Add Record</button>
    </form>
  );
}

export default FertilizerForm;
