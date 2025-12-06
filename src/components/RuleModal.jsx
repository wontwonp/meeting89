import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'

export default function RuleModal({ rule, onClose }) {
  const { addRule, updateRule } = useData()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: ''
  })

  useEffect(() => {
    if (rule) {
      setFormData({
        title: rule.title || '',
        content: rule.content || '',
        date: rule.date || ''
      })
    }
  }, [rule])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요')
      return
    }

    if (rule) {
      updateRule(rule.id, formData)
    } else {
      addRule(formData)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{rule ? '회칙 수정' : '회칙 추가'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>내용 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={6}
            />
          </div>
          <div className="input-group">
            <label>적용일</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              {rule ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

