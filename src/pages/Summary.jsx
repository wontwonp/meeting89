import { useData } from '../context/DataContext'
import { useState } from 'react'
import html2canvas from 'html2canvas'
import './Summary.css'

export default function Summary() {
  const { members, deposits, expenses, settings, getCurrentYearCarryOver } = useData()
  const [isCapturing, setIsCapturing] = useState(false)

  const totalDeposits = deposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const carryOverAmount = getCurrentYearCarryOver()
  const balance = carryOverAmount + totalDeposits - totalExpenses

  const memberStats = members.map(member => {
    const memberDeposits = deposits
      .filter(d => d.memberId === member.id)
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
    return {
      ...member,
      totalDeposits: memberDeposits
    }
  }).sort((a, b) => b.totalDeposits - a.totalDeposits)

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
          
          // Web Share API로 바로 공유 시도 (모바일에서 카카오톡 등으로 공유 가능)
          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: `${settings.clubName || '계모임'} 요약`,
                text: `${settings.clubName || '계모임'} 요약 정보입니다.`,
                files: [file]
              })
              // 공유 성공
              return
            } catch (shareError) {
              // 사용자가 공유를 취소했거나 실패한 경우
              if (shareError.name !== 'AbortError') {
                console.error('공유 실패:', shareError)
              }
            }
          }
          
          // Web Share API가 지원되지 않거나 실패한 경우
          // 클립보드에 복사 시도
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ])
            alert('이미지가 클립보드에 복사되었습니다.\n카카오톡에서 붙여넣기(Ctrl+V 또는 길게 누르기)로 공유하세요.')
          } catch (clipboardError) {
            // 클립보드 복사 실패 시 다운로드
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            alert('이미지가 다운로드되었습니다.\n다운로드한 이미지를 카카오톡에서 공유하세요.')
          }
        }
      }, 'image/png')
    } catch (error) {
      console.error('스크린샷 생성 실패:', error)
      alert('스크린샷 생성에 실패했습니다.')
    } finally {
      setIsCapturing(false)
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
          <p className="summary-date">생성일: {new Date().toLocaleDateString('ko-KR')}</p>
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
            <div className="stat-label">총 입금</div>
            <div className="stat-value-large positive">{totalDeposits.toLocaleString()}원</div>
          </div>
          <div className="summary-stat-card">
            <div className="stat-label">총 지출</div>
            <div className="stat-value-large negative">{totalExpenses.toLocaleString()}원</div>
          </div>
        </div>

        <div className="summary-section">
          <h3 className="section-title">멤버별 입금 현황</h3>
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
          <h3 className="section-title">최근 입금 내역 (최대 10개)</h3>
          {deposits.length > 0 ? (
            <div className="recent-list">
              {[...deposits]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map(deposit => {
                  const member = members.find(m => m.id === deposit.memberId)
                  const depositType = deposit.depositType || (deposit.memberId ? 'member' : 'interest')
                  const displayName = depositType === 'interest' ? '은행이자' : (member?.name || '알 수 없음')
                  return (
                    <div key={deposit.id} className="recent-list-item">
                      <div>
                        <div className="recent-item-name">{displayName}</div>
                        <div className="recent-item-date">{deposit.date}</div>
                      </div>
                      <div className="recent-item-amount positive">
                        +{parseFloat(deposit.amount || 0).toLocaleString()}원
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <p className="empty-text">입금 내역이 없습니다</p>
          )}
        </div>

        <div className="summary-section">
          <h3 className="section-title">최근 지출 내역 (최대 10개)</h3>
          {expenses.length > 0 ? (
            <div className="recent-list">
              {[...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
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
      </div>
    </div>
  )
}

