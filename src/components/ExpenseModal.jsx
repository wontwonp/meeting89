import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'

const categories = [
  '식비', '교통비', '모임비', '기타'
]

export default function ExpenseModal({ expense, onClose }) {
  const { addExpense, updateExpense } = useData()
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    note: ''
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || '',
        note: expense.note || ''
      })
    }
  }, [expense])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      alert('내용을 입력해주세요')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('금액을 입력해주세요')
      return
    }

    if (expense) {
      updateExpense(expense.id, formData)
    } else {
      addExpense(formData)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{expense ? '지출 수정' : '지출 등록'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>내용 *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="지출 내용을 입력하세요"
              required
            />
          </div>
          <div className="input-group">
            <label>금액 *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
              min="0"
              step="1000"
              required
            />
          </div>
          <div className="input-group">
            <label>날짜 *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">선택하세요</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>메모</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="추가 정보를 입력하세요"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              {expense ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

