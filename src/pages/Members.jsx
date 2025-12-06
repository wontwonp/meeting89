import { useState } from 'react'
import { useData } from '../context/DataContext'
import MemberModal from '../components/MemberModal'
import './Members.css'

export default function Members() {
  const { members, deleteMember } = useData()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  const handleAdd = () => {
    setEditingMember(null)
    setIsModalOpen(true)
  }

  const handleEdit = (member) => {
    setEditingMember(member)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    if (confirm('이 멤버를 삭제하시겠습니까?')) {
      deleteMember(id)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>멤버 관리</h1>
        <p>계모임 멤버를 추가하고 관리하세요</p>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleAdd}>
        + 멤버 추가
      </button>

      {members.length > 0 ? (
        <div className="members-list">
          {members.map(member => (
            <div key={member.id} className="card member-card">
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                {member.phone && (
                  <div className="member-phone">{member.phone}</div>
                )}
                {member.note && (
                  <div className="member-note">{member.note}</div>
                )}
              </div>
              <div className="member-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleEdit(member)}
                >
                  수정
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(member.id)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>등록된 멤버가 없습니다</p>
        </div>
      )}

      {isModalOpen && (
        <MemberModal
          member={editingMember}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

