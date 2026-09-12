import { useState } from 'react'
import { X, Check } from 'lucide-react'

const categoriesList = [
  'Starters',
  'Main Course',
  'Biryani',
  'Breads',
  'Chinese',
  'South Indian',
  'Beverages',
  'Desserts'
]

export default function MenuFormModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item?.name || '')
  const [category, setCategory] = useState(item?.category || 'Starters')
  const [price, setPrice] = useState(item?.price || '')
  const [type, setType] = useState(item?.type || 'Veg')
  const [description, setDescription] = useState(item?.description || '')
  const [image, setImage] = useState(
    item?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
  )
  const [inStock, setInStock] = useState(item?.inStock !== false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !price) return
    onSave({
      name,
      category,
      price: Number(price),
      type,
      description,
      image,
      inStock
    })
  }

  return (
    <div className="modal-backdrop">
      <div className="modal menu-form-modal">
        <div className="modal-head">
          <div>
            <p className="eyebrow accent">{item ? 'Edit Menu Item' : 'New Dish'}</p>
            <h2>{item ? `Edit: ${item.name}` : 'Add Menu Item'}</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <label className="modal-field col-span-2">
              <span>Item Name *</span>
              <input
                required
                type="text"
                placeholder="e.g. Paneer Butter Masala"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="modal-field">
              <span>Price (₹) *</span>
              <input
                required
                type="number"
                min="1"
                placeholder="320"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>

            <label className="modal-field">
              <span>Dietary Type</span>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Veg">Vegetarian (Veg)</option>
                <option value="Non-Veg">Non-Vegetarian (Non-Veg)</option>
              </select>
            </label>

            <label className="modal-field">
              <span>Stock Status</span>
              <select
                value={inStock ? 'true' : 'false'}
                onChange={(e) => setInStock(e.target.value === 'true')}
              >
                <option value="true">In Stock (Available)</option>
                <option value="false">Out of Stock</option>
              </select>
            </label>

            <label className="modal-field col-span-2">
              <span>Description</span>
              <input
                type="text"
                placeholder="Short description of the dish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="modal-field col-span-2">
              <span>Image URL</span>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              <Check size={16} /> Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
