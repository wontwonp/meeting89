import { useState } from 'react'
import { useData } from '../context/DataContext'
import DepositModal from '../components/DepositModal'
import './Deposits.css'

export default function Deposits() {
  const { deposits, members, deleteDeposit } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeposit, setEditingDeposit] = useState(null)

  const sortedDeposits = [...deposits].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleAdd = () => {
    setEditingDeposit(null)
    setIsModalOpen(true)
  }

  const handleEdit = (deposit) => {
    setEditingDeposit(deposit)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('이 입금 내역을 삭제하시겠습니까?')) {
      deleteDeposit(id)
    }
  }

  const totalAmount = deposits.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>입금 관리</h1>
        <p>총 입금액: {totalAmount.toLocaleString()}원</p>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleAdd}>
        + 입금 등록
      </button>

      {sortedDeposits.length > 0 ? (
        <div className="deposits-list">
          {sortedDeposits.map(deposit => {
            const member = members.find(m => m.id === deposit.memberId)
            const depositType = deposit.depositType || (deposit.memberId ? 'member' : 'interest')
            const displayName = depositType === 'interest' ? '은행이자' : (member?.name || '알 수 없음')
            return (
              <div key={deposit.id} className="card deposit-card">
                <div className="deposit-info">
                  <div className="deposit-header">
                    <div className="deposit-name">
                      {displayName}
                      {depositType === 'interest' && (
                        <span className="deposit-type-badge">이자</span>
                      )}
                    </div>
                    <div className="deposit-amount positive">
                      +{parseFloat(deposit.amount || 0).toLocaleString()}원
                    </div>
                  </div>
                  <div className="deposit-date">{deposit.date}</div>
                  {deposit.note && (
                    <div className="deposit-note">{deposit.note}</div>
                  )}
                </div>
                <div className="deposit-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEdit(deposit)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(deposit.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card empty-state">
          <p>등록된 입금 내역이 없습니다</p>
        </div>
      )}

      {isModalOpen && (
        <DepositModal
          deposit={editingDeposit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

