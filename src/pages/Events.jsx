import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import EventModal from '../components/EventModal'
import './Events.css'

const EVENT_TYPES = [
  { value: 'wedding', label: '결혼' },
  { value: 'dol', label: '자녀 돌 1회' },
  { value: 'grandparent', label: '조부모님상' },
  { value: 'parent', label: '부모님상' }
]

export default function Events() {
  const { events, members, deleteEvent } = useData()
  const [selectedEventType, setSelectedEventType] = useState('wedding')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  // events 데이터가 변경될 때마다 자동 업데이트
  useEffect(() => {
    // 데이터 변경 감지
  }, [events])

  const filteredEvents = events.filter(e => e.eventType === selectedEventType)
  const eventTypeLabel = EVENT_TYPES.find(e => e.value === selectedEventType)?.label || ''

  // 통계 계산
  const eventStats = EVENT_TYPES.map(type => {
    const typeEvents = events.filter(e => e.eventType === type.value)
    const totalAmount = typeEvents.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    const paidCount = typeEvents.length
    const unpaidCount = members.length - paidCount
    return {
      type: type.value,
      label: type.label,
      totalAmount,
      paidCount,
      unpaidCount,
      totalMembers: members.length
    }
  })

  const currentStats = eventStats.find(s => s.type === selectedEventType) || {
    totalAmount: 0,
    paidCount: 0,
    unpaidCount: members.length,
    totalMembers: members.length
  }

  const handleAdd = () => {
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('이 경조사 지급 내역을 삭제하시겠습니까?')) {
      deleteEvent(id)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  // 각 회원별로 지급 내역 확인
  const getMemberEvent = (memberId) => {
    return filteredEvents.find(e => e.memberId === memberId)
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>경조사 관리</h1>
        <p>회원별 경조사 지급 내역을 관리하세요</p>
      </div>

      <div className="all-events-summary">
        <h3 className="summary-title">전체 경조사 통계</h3>
        <div className="summary-table">
          <div className="summary-header-row">
            <div className="summary-cell">경조사 유형</div>
            <div className="summary-cell">총 지급액</div>
            <div className="summary-cell">지급 완료</div>
            <div className="summary-cell">미지급</div>
          </div>
          {eventStats.map(stat => (
            <div key={stat.type} className="summary-row">
              <div className="summary-cell summary-type">{stat.label}</div>
              <div className="summary-cell summary-amount">{stat.totalAmount.toLocaleString()}원</div>
              <div className="summary-cell summary-count positive">{stat.paidCount}명</div>
              <div className="summary-cell summary-count negative">{stat.unpaidCount}명</div>
            </div>
          ))}
        </div>
      </div>

      <div className="event-type-selector">
        {EVENT_TYPES.map(type => (
          <button
            key={type.value}
            className={`event-type-btn ${selectedEventType === type.value ? 'active' : ''}`}
            onClick={() => setSelectedEventType(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="event-stats-card">
        <h3 className="stats-title">{eventTypeLabel} 통계</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">총 지급액</div>
            <div className="stat-value">{currentStats.totalAmount.toLocaleString()}원</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">지급 완료</div>
            <div className="stat-value positive">{currentStats.paidCount}명</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">미지급</div>
            <div className="stat-value negative">{currentStats.unpaidCount}명</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleAdd}>
        + {eventTypeLabel} 지급 등록
      </button>

      {members.length > 0 ? (
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>회원명</th>
                <th>지급일</th>
                <th>금액</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const memberEvent = getMemberEvent(member.id)
                return (
                  <tr key={member.id}>
                    <td className="member-name-cell">
                      <span>{member.name}</span>
                      {!memberEvent && (
                        <span className="not-paid-badge">미지급</span>
                      )}
                    </td>
                    <td>
                      {memberEvent ? memberEvent.date : '-'}
                    </td>
                    <td className="amount-cell">
                      {memberEvent ? `${parseFloat(memberEvent.amount || 0).toLocaleString()}원` : '-'}
                    </td>
                    <td className="action-cell">
                      {memberEvent ? (
                        <>
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => handleEdit(memberEvent)}
                          >
                            수정
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(memberEvent.id)}
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => {
                            setEditingEvent({ eventType: selectedEventType, memberId: member.id })
                            setIsModalOpen(true)
                          }}
                        >
                          등록
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty-state">
          <p>등록된 멤버가 없습니다. 먼저 멤버를 추가해주세요.</p>
        </div>
      )}

      {isModalOpen && (
        <EventModal
          event={editingEvent}
          eventType={selectedEventType}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

