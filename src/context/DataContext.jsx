import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

const STORAGE_KEY = 'account-club-data'

const defaultData = {
  members: [],
  rules: [],
  deposits: [],
  expenses: [],
  carryOverAmounts: {}, // 연도별 이월금액 { "2024": 100000, "2025": 50000 }
  events: [], // 경조사 지급 내역 [{ eventType, memberId, date, amount }]
  settings: {
    clubName: '계모임',
    currency: '원'
  }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(defaultData)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // 데이터 로드
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setData({ ...defaultData, ...parsed })
      } catch (e) {
        console.error('데이터 로드 실패:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    // 데이터 저장
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isLoaded])

  const addMember = (member) => {
    const newMember = {
      id: Date.now().toString(),
      ...member,
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }))
  }

  const updateMember = (id, updates) => {
    setData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === id ? { ...m, ...updates } : m)
    }))
  }

  const deleteMember = (id) => {
    setData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }))
  }

  const addRule = (rule) => {
    const newRule = {
      id: Date.now().toString(),
      ...rule,
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      rules: [...prev.rules, newRule]
    }))
  }

  const updateRule = (id, updates) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, ...updates } : r)
    }))
  }

  const deleteRule = (id) => {
    setData(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id)
    }))
  }

  const addDeposit = (deposit) => {
    const newDeposit = {
      id: Date.now().toString(),
      ...deposit,
      date: deposit.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      deposits: [...prev.deposits, newDeposit]
    }))
  }

  const updateDeposit = (id, updates) => {
    setData(prev => ({
      ...prev,
      deposits: prev.deposits.map(d => d.id === id ? { ...d, ...updates } : d)
    }))
  }

  const deleteDeposit = (id) => {
    setData(prev => ({
      ...prev,
      deposits: prev.deposits.filter(d => d.id !== id)
    }))
  }

  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
      date: expense.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }))
  }

  const updateExpense = (id, updates) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
    }))
  }

  const deleteExpense = (id) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }))
  }

  const updateSettings = (settings) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...settings }
    }))
  }

  const addEvent = (event) => {
    const newEvent = {
      id: Date.now().toString(),
      ...event,
      createdAt: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      events: [...prev.events, newEvent]
    }))
  }

  const updateEvent = (id, updates) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
    }))
  }

  const deleteEvent = (id) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }))
  }

  const setCarryOverAmount = (year, amount) => {
    setData(prev => ({
      ...prev,
      carryOverAmounts: {
        ...prev.carryOverAmounts,
        [year]: parseFloat(amount) || 0
      }
    }))
  }

  const getCarryOverAmount = (year) => {
    return data.carryOverAmounts[year] || 0
  }

  const getCurrentYearCarryOver = () => {
    const currentYear = new Date().getFullYear().toString()
    return getCarryOverAmount(currentYear)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `account-club-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData)
      setData({ ...defaultData, ...parsed })
      return true
    } catch (e) {
      console.error('데이터 가져오기 실패:', e)
      return false
    }
  }

  const resetData = () => {
    if (confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setData(defaultData)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const value = {
    data,
    isLoaded,
    members: data.members,
    rules: data.rules,
    deposits: data.deposits,
    expenses: data.expenses,
    events: data.events,
    carryOverAmounts: data.carryOverAmounts,
    settings: data.settings,
    addMember,
    updateMember,
    deleteMember,
    addRule,
    updateRule,
    deleteRule,
    addDeposit,
    updateDeposit,
    deleteDeposit,
    addExpense,
    updateExpense,
    deleteExpense,
    addEvent,
    updateEvent,
    deleteEvent,
    updateSettings,
    setCarryOverAmount,
    getCarryOverAmount,
    getCurrentYearCarryOver,
    exportData,
    importData,
    resetData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

