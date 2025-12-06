import { useState } from 'react'
import { useData } from '../context/DataContext'
import ExpenseModal from '../components/ExpenseModal'
import './Expenses.css'

export default function Expenses() {
  const { expenses, deleteExpense } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  const handleAdd = () => {
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('이 지출 내역을 삭제하시겠습니까?')) {
      deleteExpense(id)
    }
  }

  const totalAmount = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>지출 관리</h1>
        <p>총 지출액: {totalAmount.toLocaleString()}원</p>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleAdd}>
        + 지출 등록
      </button>

      {sortedExpenses.length > 0 ? (
        <div className="expenses-list">
          {sortedExpenses.map(expense => (
            <div key={expense.id} className="card expense-card">
              <div className="expense-info">
                <div className="expense-header">
                  <div className="expense-description">{expense.description}</div>
                  <div className="expense-amount negative">
                    -{parseFloat(expense.amount || 0).toLocaleString()}원
                  </div>
                </div>
                <div className="expense-date">{expense.date}</div>
                {expense.category && (
                  <div className="expense-category">{expense.category}</div>
                )}
                {expense.note && (
                  <div className="expense-note">{expense.note}</div>
                )}
              </div>
              <div className="expense-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(expense)}
                >
                  수정
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(expense.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>등록된 지출 내역이 없습니다</p>
        </div>
      )}

      {isModalOpen && (
        <ExpenseModal
          expense={editingExpense}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

