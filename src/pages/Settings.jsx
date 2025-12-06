import { useState, useRef, useEffect } from 'react'
import { useData } from '../context/DataContext'
import './Settings.css'

export default function Settings() {
  const { settings, updateSettings, carryOverAmounts, setCarryOverAmount, deposits, expenses, getCurrentYearCarryOver, exportData, importData, resetData } = useData()
  const [clubName, setClubName] = useState(settings.clubName || '')
  const [creationDate, setCreationDate] = useState(settings.creationDate || '')
  const currentYear = new Date().getFullYear().toString()
  const prevYear = (parseInt(currentYear) - 1).toString()
  const [carryOverAmount, setCarryOverAmountLocal] = useState(carryOverAmounts[currentYear] || '')
  const fileInputRef = useRef(null)

  // 전년도 최종 잔액 계산
  const calculatePrevYearBalance = () => {
    const prevYearCarryOver = carryOverAmounts[prevYear] || 0
    const prevYearDeposits = deposits
      .filter(d => d.date && d.date.startsWith(prevYear))
      .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0)
    const prevYearExpenses = expenses
      .filter(e => e.date && e.date.startsWith(prevYear))
      .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    return prevYearCarryOver + prevYearDeposits - prevYearExpenses
  }

  const prevYearBalance = calculatePrevYearBalance()

  useEffect(() => {
    setCarryOverAmountLocal(carryOverAmounts[currentYear] || '')
    setClubName(settings.clubName || '')
    setCreationDate(settings.creationDate || '')
  }, [carryOverAmounts, currentYear, settings])

  const handleSetPrevYearBalance = () => {
    if (prevYearBalance > 0) {
      setCarryOverAmountLocal(prevYearBalance.toString())
    }
  }

  const handleSaveSettings = () => {
    updateSettings({ clubName, creationDate })
    if (carryOverAmount) {
      setCarryOverAmount(currentYear, carryOverAmount)
    }
    alert('설정이 저장되었습니다')
  }

  const handleExport = () => {
    exportData()
    alert('데이터가 내보내기되었습니다. 다음 총무에게 이 파일을 전달하세요.')
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result
      if (text && typeof text === 'string') {
        if (confirm('기존 데이터를 가져온 데이터로 교체하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
          const success = importData(text)
          if (success) {
            alert('데이터가 성공적으로 가져와졌습니다.')
            window.location.reload()
          } else {
            alert('데이터 가져오기에 실패했습니다. 파일 형식을 확인해주세요.')
          }
        }
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (confirm('정말로 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      resetData()
      alert('모든 데이터가 삭제되었습니다.')
      window.location.reload()
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>설정</h1>
        <p>계모임 설정 및 데이터 관리</p>
      </div>

      <div className="settings-section">
        <h2 className="section-title">기본 설정</h2>
        <div className="card">
          <div className="input-group">
            <label>계모임 이름</label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              placeholder="계모임 이름을 입력하세요"
            />
          </div>
          <div className="input-group">
            <label>계모임 생성일</label>
            <input
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              placeholder="계모임 생성일을 선택하세요"
            />
          </div>
          <div className="input-group">
            <label>{currentYear}년도 전년도 이월금액</label>
            {prevYearBalance > 0 && !carryOverAmounts[currentYear] && (
              <div className="carry-over-suggestion">
                <p className="suggestion-text">
                  {prevYear}년도 최종 잔액: <strong>{prevYearBalance.toLocaleString()}원</strong>
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSetPrevYearBalance}
                  style={{ marginTop: '8px', fontSize: '14px', padding: '8px 16px' }}
                >
                  전년도 잔액으로 설정
                </button>
              </div>
            )}
            <input
              type="number"
              value={carryOverAmount}
              onChange={(e) => setCarryOverAmountLocal(e.target.value)}
              placeholder="0"
              min="0"
              step="1000"
            />
            <p className="input-hint">해가 바뀔 때 전년도 잔액을 입력하세요 (자동 계산 가능)</p>
          </div>
          {Object.keys(carryOverAmounts).length > 0 && (
            <div className="carry-over-history">
              <h4 style={{ fontSize: '14px', marginBottom: '8px', color: '#ffffff' }}>연도별 이월금액 내역</h4>
              {Object.entries(carryOverAmounts)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([year, amount]) => (
                  <div key={year} className="history-item">
                    <span>{year}년:</span>
                    <strong>{parseFloat(amount).toLocaleString()}원</strong>
                  </div>
                ))}
            </div>
          )}
          <button className="btn btn-primary btn-full" onClick={handleSaveSettings}>
            저장
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">데이터 관리</h2>
        
        <div className="card">
          <h3 className="card-title">데이터 내보내기</h3>
          <p className="card-description">
            모든 데이터를 JSON 파일로 내보냅니다. 다음 총무에게 이 파일을 전달하여 데이터를 이어받을 수 있습니다.
          </p>
          <button className="btn btn-primary btn-full" onClick={handleExport}>
            📥 데이터 내보내기
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">데이터 가져오기</h3>
          <p className="card-description">
            이전 총무로부터 받은 JSON 파일을 선택하여 데이터를 불러옵니다. 기존 데이터는 모두 교체됩니다.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button className="btn btn-secondary btn-full" onClick={handleImport}>
            📤 데이터 가져오기
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="section-title">위험한 작업</h2>
        <div className="card danger-card">
          <h3 className="card-title">모든 데이터 삭제</h3>
          <p className="card-description">
            모든 멤버, 입금, 지출, 회칙 데이터를 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <button className="btn btn-danger btn-full" onClick={handleReset}>
            🗑️ 모든 데이터 삭제
          </button>
        </div>
      </div>

      <div className="settings-section">
        <div className="card">
          <h3 className="card-title">사용 안내</h3>
          <div className="info-list">
            <div className="info-item">
              <strong>로컬 저장:</strong> 모든 데이터는 브라우저의 로컬 스토리지에 저장됩니다.
            </div>
            <div className="info-item">
              <strong>데이터 백업:</strong> 정기적으로 데이터를 내보내기하여 백업하세요.
            </div>
            <div className="info-item">
              <strong>총무 교체:</strong> 데이터 내보내기로 JSON 파일을 생성하고, 다음 총무가 데이터 가져오기로 불러오세요.
            </div>
            <div className="info-item">
              <strong>카카오톡 공유:</strong> 요약 페이지에서 스크린샷을 바로 카카오톡으로 공유할 수 있습니다. (모바일에서는 공유 메뉴에서 카카오톡 선택, PC에서는 클립보드 복사 후 붙여넣기)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

