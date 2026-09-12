import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useRestaurant } from '../useRestaurant'
import { money } from '../utils'
import MenuFormModal from '../components/MenuFormModal'
import { toast } from 'sonner'

const categories = [
  'All',
  'Starters',
  'Main Course',
  'Biryani',
  'Breads',
  'Chinese',
  'South Indian',
  'Beverages',
  'Desserts'
]

export default function MenuPage() {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemStock,
    setAllItemsStock,
    resetMenuToDefault
  } = useRestaurant()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const filteredItems = menuItems.filter((item) => {
    const catMatches = category === 'All' || item.category === category
    const typeMatches = typeFilter === 'All' || item.type === typeFilter
    const queryMatches =
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    return catMatches && typeMatches && queryMatches
  })

  const handleSave = (itemData) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData)
      toast.success(`Updated menu item: ${itemData.name}`)
    } else {
      addMenuItem(itemData)
      toast.success(`Added new dish: ${itemData.name}`)
    }
    setModalOpen(false)
    setEditingItem(null)
  }

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteMenuItem(item.id)
      toast.success(`Deleted ${item.name}`)
    }
  }

  return (
    <div className="page menu-management-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow accent">Kitchen Catalogue ({menuItems.length} Dishes)</p>
          <h2>Menu Management</h2>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="secondary-button"
            onClick={() => {
              setAllItemsStock(true)
              toast.success('All items set to In Stock!')
            }}
          >
            <CheckCircle size={16} /> Mark All In Stock
          </button>

          <button
            className="secondary-button"
            title="Reset menu items to default catalogue"
            onClick={() => {
              if (window.confirm('Reset all menu items to default full menu?')) {
                resetMenuToDefault()
                toast.success('Menu reset to full default catalogue!')
              }
            }}
          >
            <RefreshCw size={16} /> Reset Catalogue
          </button>

          <button
            className="primary-button"
            onClick={() => {
              setEditingItem(null)
              setModalOpen(true)
            }}
          >
            <Plus size={16} /> Add New Dish
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="panel menu-toolbar-panel">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search catalogue by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Veg">Veg Only</option>
              <option value="Non-Veg">Non-Veg Only</option>
            </select>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? 'selected' : ''}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Admin Grid */}
      <div className="menu-admin-grid">
        {filteredItems.map((item) => (
          <div className={`admin-menu-card ${!item.inStock ? 'out' : ''}`} key={item.id}>
            <div className="admin-menu-img-wrap">
              <img src={item.image} alt={item.name} />
              <span className={`type-badge ${item.type === 'Veg' ? 'veg' : 'nonveg'}`} />
            </div>

            <div className="admin-menu-info">
              <div className="admin-menu-header">
                <strong>{item.name}</strong>
                <span className="price-tag">{money(item.price)}</span>
              </div>
              <span className="category-tag">{item.category}</span>
              <p>{item.description}</p>

              <div className="admin-menu-footer">
                <button
                  className={`stock-toggle-btn ${item.inStock ? 'in-stock' : 'out-of-stock'}`}
                  onClick={() => {
                    toggleItemStock(item.id)
                    toast.info(`${item.name} is now ${!item.inStock ? 'In Stock' : 'Out of Stock'}`)
                  }}
                >
                  {item.inStock ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </button>

                <div className="card-actions">
                  <button
                    className="icon-button"
                    title="Edit Item"
                    onClick={() => {
                      setEditingItem(item)
                      setModalOpen(true)
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-button danger"
                    title="Delete Item"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <MenuFormModal
          item={editingItem}
          onClose={() => {
            setModalOpen(false)
            setEditingItem(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
