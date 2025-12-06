import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'

export default function DepositModal({ deposit, onClose }) {
  const { addDeposit, updateDeposit, members } = useData()
  const [formData, setFormData] = useState({
    depositType: 'member', // 'member' or 'interest'
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  })

  useEffect(() => {
    if (deposit) {
      setFormData({
        depositType: deposit.depositType || (deposit.memberId ? 'member' : 'interest'),
        memberId: deposit.memberId || '',
        amount: deposit.amount || '',
        date: deposit.date || new Date().toISOString().split('T')[0],
        note: deposit.note || ''
      })
    }
  }, [deposit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.depositType === 'member' && !formData.memberId) {
      alert('멤버를 선택해주세요')
      return
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('금액을 입력해주세요')
      return
    }

    if (deposit) {
      updateDeposit(deposit.id, formData)
    } else {
      addDeposit(formData)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{deposit ? '입금 수정' : '입금 등록'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>입금 유형 *</label>
            <select
              value={formData.depositType}
              onChange={(e) => {
                const newType = e.target.value
                setFormData({ 
                  ...formData, 
                  depositType: newType,
                  memberId: newType === 'interest' ? '' : formData.memberId
                })
              }}
              required
            >
              <option value="member">멤버 입금</option>
              <option value="interest">은행이자</option>
            </select>
          </div>
          {formData.depositType === 'member' && (
            <div className="input-group">
              <label>멤버 *</label>
              <select
                value={formData.memberId}
                onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                required
              >
                <option value="">선택하세요</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {formData.depositType === 'interest' && (
            <div className="input-group">
              <label>은행이자</label>
              <input
                type="text"
                value="은행이자"
                disabled
                style={{ 
                  background: '#2a2a2a', 
                  color: '#888', 
                  cursor: 'not-allowed' 
                }}
              />
            </div>
          )}
          <div className="input-group">
            <label>금액 *</label>
            <div className="amount-buttons">
              <button
                type="button"
                className={`amount-btn ${formData.amount === '10000' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, amount: '10000' })}
              >
                1만원
              </button>
              <button
                type="button"
                className={`amount-btn ${formData.amount === '50000' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, amount: '50000' })}
              >
                5만원
              </button>
            </div>
            {formData.amount && (
              <div className="selected-amount">
                선택된 금액: {parseInt(formData.amount).toLocaleString()}원
              </div>
            )}
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
              {deposit ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

