import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'

const EVENT_TYPES = {
  wedding: '결혼',
  dol: '자녀 돌 1회',
  grandparent: '조부모님상',
  parent: '부모님상'
}

export default function EventModal({ event, eventType, onClose }) {
  const { addEvent, updateEvent, members } = useData()
  const [formData, setFormData] = useState({
    eventType: eventType || 'wedding',
    memberId: event?.memberId || '',
    date: event?.date || new Date().toISOString().split('T')[0],
    amount: event?.amount || ''
  })
  const [displayAmount, setDisplayAmount] = useState('')

  // 숫자에 컴마 추가하는 함수
  const formatNumber = (value) => {
    const numbers = value.toString().replace(/[^\d]/g, '')
    if (!numbers) return ''
    return parseInt(numbers).toLocaleString()
  }

  // 컴마 제거하는 함수
  const removeCommas = (value) => {
    return value.toString().replace(/,/g, '')
  }

  useEffect(() => {
    if (event && event.id) {
      // 수정 모드
      const amount = event.amount || ''
      setFormData({
        eventType: event.eventType || eventType || 'wedding',
        memberId: event.memberId || '',
        date: event.date || new Date().toISOString().split('T')[0],
        amount: amount,
        note: event.note || ''
      })
      setDisplayAmount(amount ? formatNumber(amount) : '')
    } else {
      // 신규 등록 모드
      const initialEventType = event?.eventType || eventType || 'wedding'
      setFormData({
        eventType: initialEventType,
        memberId: event?.memberId || '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        note: ''
      })
      setDisplayAmount('')
    }
  }, [event, eventType])

  const handleAmountChange = (e) => {
    const inputValue = e.target.value
    const numbersOnly = removeCommas(inputValue)
    const formatted = formatNumber(numbersOnly)
    
    setDisplayAmount(formatted)
    setFormData({ ...formData, amount: numbersOnly })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.memberId) {
      alert('회원을 선택해주세요')
      return
    }
    const amountValue = removeCommas(formData.amount || displayAmount)
    if (!amountValue || parseFloat(amountValue) <= 0) {
      alert('금액을 입력해주세요')
      return
    }
    if (!formData.date) {
      alert('날짜를 입력해주세요')
      return
    }
    if (!formData.eventType) {
      alert('경조사 유형을 선택해주세요')
      return
    }

    try {
      // eventType이 없으면 prop에서 가져오기
      const finalEventType = formData.eventType || eventType || 'wedding'
      
      const submitData = {
        eventType: finalEventType, // 명시적으로 eventType 포함
        memberId: formData.memberId,
        date: formData.date,
        amount: amountValue,
        note: formData.note || ''
      }
      
      console.log('저장할 데이터:', submitData) // 디버깅용
      
      if (event && event.id) {
        updateEvent(event.id, submitData)
      } else {
        addEvent(submitData)
      }
      onClose()
    } catch (error) {
      console.error('경조사 저장 실패:', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? '경조사 수정' : '경조사 등록'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>경조사 유형 *</label>
            <select
              value={formData.eventType || eventType || 'wedding'}
              onChange={(e) => {
                const newEventType = e.target.value
                setFormData({ ...formData, eventType: newEventType })
              }}
              required
            >
              <option value="wedding">결혼</option>
              <option value="dol">자녀 돌 1회</option>
              <option value="grandparent">조부모님상</option>
              <option value="parent">부모님상</option>
            </select>
          </div>
          <div className="input-group">
            <label>회원 *</label>
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
          <div className="input-group">
            <label>지급일 *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>금액 *</label>
            <input
              type="text"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder="0"
              required
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              {event ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

