import { useData } from '../context/DataContext'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import KakaoShareModal from '../components/KakaoShareModal'
import './Summary.css'

const EVENT_TYPES = [
  { value: 'wedding', label: '결혼' },
  { value: 'dol', label: '자녀 돌 1회' },
  { value: 'grandparent', label: '조부모님상' },
  { value: 'parent', label: '부모님상' }
]

export default function Summary() {
  const { members, deposits, expenses, settings, getCurrentYearCarryOver, events } = useData()
  const [isCapturing, setIsCapturing] = useState(false)
  const [showKakaoModal, setShowKakaoModal] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)

  // 현재 연도 계산
  const currentYear = new Date().getFullYear()
  const yearStart = `${currentYear}-01-01`
  const yearEnd = `${currentYear}-12-31`

  // 현재 연도 필터 함수
  const isCurrentYear = (date) => {
    if (!date) return false
    return date >= yearStart && date <= yearEnd
  }

  // 현재 연도의 은행이자 입금만 필터링 (멤버 입금 제외)
  const currentYearInterestDeposits = deposits.filter(d => {
    const depositType = d.depositType || (d.memberId ? 'member' : 'interest')
    return depositType === 'interest' && isCurrentYear(d.date)
  })

  // 현재 연도의 지출만 필터링
  const currentYearExpenses = expenses.filter(e => isCurrentYear(e.date))

  // 현재 연도의 멤버 입금만 필터링
  const currentYearMemberDeposits = deposits.filter(d => {
    const depositType = d.depositType || (d.memberId ? 'member' : 'interest')
    return depositType === 'member' && isCurrentYear(d.date)
  })

  // 현재 연도 은행이자 총액
  const totalInterestDeposits = currentYearInterestDeposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  
  // 현재 연도 멤버 입금 총액
  const totalMemberDeposits = currentYearMemberDeposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  
  // 현재 연도 지출 총액
  const totalExpenses = currentYearExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  
  const carryOverAmount = getCurrentYearCarryOver()
  const balance = carryOverAmount + totalMemberDeposits + totalInterestDeposits - totalExpenses

  // 멤버별 현재 연도 입금 현황
  const memberStats = members.map(member => {
    const memberDeposits = currentYearMemberDeposits
      .filter(d => d.memberId === member.id)
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
    return {
      ...member,
      totalDeposits: memberDeposits
    }
  }).sort((a, b) => b.totalDeposits - a.totalDeposits)

  // 경조사 통계 계산
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

  const handleScreenshot = async () => {
    setIsCapturing(true)
    try {
      const element = document.getElementById('summary-content')
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true
      })
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const fileName = `계모임-요약-${new Date().toISOString().split('T')[0]}.png`
          const file = new File([blob], fileName, { type: 'image/png' })
          
          // 모바일에서 Web Share API 사용 (카카오톡 선택 가능)
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `${settings.clubName || '계모임'} 요약`,
                text: `${settings.clubName || '계모임'} 요약 정보입니다.`,
                files: [file]
              })
              setIsCapturing(false)
              return
            } catch (shareError) {
              if (shareError.name === 'AbortError') {
                setIsCapturing(false)
                return
              }
            }
          }
          
          // PC 또는 Web Share API가 지원되지 않는 경우
          // 이미지를 저장하고 모달 표시
          const imageUrl = URL.createObjectURL(blob)
          setCapturedImage({ blob, file, imageUrl })
          setShowKakaoModal(true)
          setIsCapturing(false)
        }
      }, 'image/png')
    } catch (error) {
      console.error('스크린샷 생성 실패:', error)
      alert('스크린샷 생성에 실패했습니다.')
      setIsCapturing(false)
    }
  }
  
  const handleCloseModal = () => {
    setShowKakaoModal(false)
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage.imageUrl)
      setCapturedImage(null)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>요약</h1>
        <p>계모임 현황을 한눈에 확인하세요</p>
      </div>

      <button 
        className="btn btn-primary btn-full" 
        onClick={handleScreenshot}
        disabled={isCapturing}
      >
        {isCapturing ? '생성 중...' : '📸 카카오톡으로 공유'}
      </button>

      <div id="summary-content" className="summary-content">
        <div className="summary-header">
          <h2>{settings.clubName || '계모임'}</h2>
          <p className="summary-date">{currentYear}년 1월 1일 ~ 12월 31일 기준</p>
          {settings.creationDate && (
            <p className="summary-date">생성일: {new Date(settings.creationDate).toLocaleDateString('ko-KR')}</p>
          )}
        </div>

        <div className="summary-stats">
          <div className="summary-stat-card">
            <div className="stat-label">현재 잔액</div>
            <div className="stat-value-large">{balance.toLocaleString()}원</div>
            {carryOverAmount > 0 && (
              <div className="stat-subtext-small">(이월: {carryOverAmount.toLocaleString()}원)</div>
            )}
          </div>
          <div className="summary-stat-card">
            <div className="stat-label">{currentYear}년 멤버 입금</div>
            <div className="stat-value-large positive">{totalMemberDeposits.toLocaleString()}원</div>
          </div>
          <div className="summary-stat-card">
            <div className="stat-label">{currentYear}년 은행이자</div>
            <div className="stat-value-large positive">{totalInterestDeposits.toLocaleString()}원</div>
          </div>
          <div className="summary-stat-card">
            <div className="stat-label">{currentYear}년 총 지출</div>
            <div className="stat-value-large negative">{totalExpenses.toLocaleString()}원</div>
          </div>
        </div>

        <div className="summary-section">
          <h3 className="section-title">{currentYear}년 멤버별 입금 현황</h3>
          {memberStats.length > 0 ? (
            <div className="member-stats-list">
              {memberStats.map(member => (
                <div key={member.id} className="member-stat-item">
                  <div className="member-stat-name">{member.name}</div>
                  <div className="member-stat-amount">
                    {member.totalDeposits.toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">멤버가 없습니다</p>
          )}
        </div>

        <div className="summary-section">
          <h3 className="section-title">{currentYear}년 은행이자 입금 내역</h3>
          {currentYearInterestDeposits.length > 0 ? (
            <div className="recent-list">
              {[...currentYearInterestDeposits]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(deposit => (
                  <div key={deposit.id} className="recent-list-item">
                    <div>
                      <div className="recent-item-name">은행이자</div>
                      <div className="recent-item-date">{deposit.date}</div>
                    </div>
                    <div className="recent-item-amount positive">
                      +{parseFloat(deposit.amount || 0).toLocaleString()}원
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="empty-text">은행이자 입금 내역이 없습니다</p>
          )}
        </div>

        <div className="summary-section">
          <h3 className="section-title">{currentYear}년 지출 내역</h3>
          {currentYearExpenses.length > 0 ? (
            <div className="recent-list">
              {[...currentYearExpenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(expense => (
                  <div key={expense.id} className="recent-list-item">
                    <div>
                      <div className="recent-item-name">{expense.description}</div>
                      <div className="recent-item-date">{expense.date}</div>
                    </div>
                    <div className="recent-item-amount negative">
                      -{parseFloat(expense.amount || 0).toLocaleString()}원
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="empty-text">지출 내역이 없습니다</p>
          )}
        </div>

        <div className="summary-section">
          <h3 className="section-title">전체 경조사 통계</h3>
          {eventStats.length > 0 ? (
            <div className="events-summary-table">
              <div className="events-summary-header">
                <div className="events-summary-cell">경조사 유형</div>
                <div className="events-summary-cell">총 지급액</div>
                <div className="events-summary-cell">지급 완료</div>
                <div className="events-summary-cell">미지급</div>
              </div>
              {eventStats.map(stat => (
                <div key={stat.type} className="events-summary-row">
                  <div className="events-summary-cell events-summary-type">{stat.label}</div>
                  <div className="events-summary-cell events-summary-amount">{stat.totalAmount.toLocaleString()}원</div>
                  <div className="events-summary-cell events-summary-count positive">{stat.paidCount}명</div>
                  <div className="events-summary-cell events-summary-count negative">{stat.unpaidCount}명</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-text">경조사 내역이 없습니다</p>
          )}
        </div>
      </div>

      {showKakaoModal && capturedImage && (
        <KakaoShareModal
          image={capturedImage}
          clubName={settings.clubName || '계모임'}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

