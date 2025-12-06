import { useState } from 'react'
import { useData } from '../context/DataContext'
import RuleModal from '../components/RuleModal'
import './Rules.css'

export default function Rules() {
  const { rules, deleteRule } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRule, setEditingRule] = useState(null)

  const handleAdd = () => {
    setEditingRule(null)
    setIsModalOpen(true)
  }

  const handleEdit = (rule) => {
    setEditingRule(rule)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('이 회칙을 삭제하시겠습니까?')) {
      deleteRule(id)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>회칙 관리</h1>
        <p>계모임 회칙을 작성하고 관리하세요</p>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleAdd}>
        + 회칙 추가
      </button>

      {rules.length > 0 ? (
        <div className="rules-list">
          {rules.map(rule => (
            <div key={rule.id} className="card rule-card">
              <div className="rule-info">
                <div className="rule-title">{rule.title}</div>
                <div className="rule-content">{rule.content}</div>
                {rule.date && (
                  <div className="rule-date">적용일: {rule.date}</div>
                )}
              </div>
              <div className="rule-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(rule)}
                >
                  수정
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(rule.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>등록된 회칙이 없습니다</p>
        </div>
      )}

      {isModalOpen && (
        <RuleModal
          rule={editingRule}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

