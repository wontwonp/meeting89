import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import './Home.css'

export default function Home() {
  const { members, deposits, expenses, settings, getCurrentYearCarryOver } = useData()

  const totalDeposits = deposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const carryOverAmount = getCurrentYearCarryOver()
  const balance = carryOverAmount + totalDeposits - totalExpenses

  const recentDeposits = [...deposits].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{settings.clubName || '계모임'}</h1>
        <p>총무 관리 시스템</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">현재 잔액</div>
          <div className="stat-value">{balance.toLocaleString()}원</div>
          {carryOverAmount > 0 && (
            <div className="stat-subtext">(이월: {carryOverAmount.toLocaleString()}원)</div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-label">총 입금</div>
          <div className="stat-value positive">{totalDeposits.toLocaleString()}원</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">총 지출</div>
          <div className="stat-value negative">{totalExpenses.toLocaleString()}원</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">멤버 수</div>
          <div className="stat-value">{members.length}명</div>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/deposits" className="quick-action-btn">
          <span className="action-icon">💰</span>
          <span>입금 등록</span>
        </Link>
        <Link to="/expenses" className="quick-action-btn">
          <span className="action-icon">💸</span>
          <span>지출 등록</span>
        </Link>
        <Link to="/events" className="quick-action-btn">
          <span className="action-icon">🎁</span>
          <span>경조사 관리</span>
        </Link>
        <Link to="/members" className="quick-action-btn">
          <span className="action-icon">👥</span>
          <span>멤버 관리</span>
        </Link>
        <Link to="/rules" className="quick-action-btn">
          <span className="action-icon">📋</span>
          <span>회칙 관리</span>
        </Link>
      </div>

      <div className="recent-section">
        <h2 className="section-title">최근 입금</h2>
        {recentDeposits.length > 0 ? (
          <div className="card">
            {recentDeposits.map(deposit => {
              const member = members.find(m => m.id === deposit.memberId)
              const depositType = deposit.depositType || (deposit.memberId ? 'member' : 'interest')
              const displayName = depositType === 'interest' ? '은행이자' : (member?.name || '알 수 없음')
              return (
                <div key={deposit.id} className="recent-item">
                  <div className="recent-info">
                    <div className="recent-name">{displayName}</div>
                    <div className="recent-date">{deposit.date}</div>
                  </div>
                  <div className="recent-amount positive">
                    +{parseFloat(deposit.amount || 0).toLocaleString()}원
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card empty-state">
            <p>입금 내역이 없습니다</p>
          </div>
        )}
      </div>

      <div className="recent-section">
        <h2 className="section-title">최근 지출</h2>
        {recentExpenses.length > 0 ? (
          <div className="card">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="recent-item">
                <div className="recent-info">
                  <div className="recent-name">{expense.description}</div>
                  <div className="recent-date">{expense.date}</div>
                </div>
                <div className="recent-amount negative">
                  -{parseFloat(expense.amount || 0).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card empty-state">
            <p>지출 내역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}

