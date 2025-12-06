import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import './Modal.css'

export default function MemberModal({ member, onClose }) {
  const { addMember, updateMember } = useData()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    note: ''
  })

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        note: member.note || ''
      })
    }
  }, [member])

  const formatPhoneNumber = (value) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '')
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    } else {
      // 11자리 초과 시 자르기
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData({ ...formData, phone: formatted })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('이름을 입력해주세요')
      return
    }

    if (member) {
      updateMember(member.id, formData)
    } else {
      addMember(formData)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{member ? '멤버 수정' : '멤버 추가'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>이름 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>전화번호</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="010-1234-5678"
              maxLength={13}
            />
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
              {member ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

