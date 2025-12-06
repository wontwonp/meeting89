import { useState, useEffect } from 'react'
import './KakaoShareModal.css'

export default function KakaoShareModal({ image, clubName, onClose }) {
  const [shareMethod, setShareMethod] = useState('webShare')

  useEffect(() => {
    // 모바일에서 Web Share API 지원 여부 확인
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [image.file] })) {
      setShareMethod('webShare')
    } else if (navigator.clipboard && navigator.clipboard.write) {
      setShareMethod('clipboard')
    } else {
      setShareMethod('download')
    }
  }, [image])

  const handleWebShare = async () => {
    try {
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [image.file] })) {
        await navigator.share({
          title: `${clubName} 요약`,
          text: `${clubName} 요약 정보입니다.`,
          files: [image.file]
        })
        onClose()
      } else {
        alert('이 브라우저에서는 Web Share API를 지원하지 않습니다.')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('공유 실패:', error)
        alert('공유에 실패했습니다.')
      }
    }
  }

  const handleClipboardShare = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': image.blob
        })
      ])
      alert('이미지가 클립보드에 복사되었습니다.\n카카오톡에서 붙여넣기(Ctrl+V)로 공유하세요.')
      onClose()
    } catch (error) {
      console.error('클립보드 복사 실패:', error)
      alert('클립보드 복사에 실패했습니다.')
    }
  }

  const handleKakaoTalkShare = () => {
    // 카카오톡 링크 API를 사용하여 공유
    // 실제 구현은 카카오톡 개발자 키가 필요하지만, 
    // 여기서는 Web Share API를 통해 카카오톡을 선택할 수 있게 함
    handleWebShare()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="kakao-share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>카카오톡으로 공유</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="share-preview">
            <img src={image.imageUrl} alt="요약 이미지" />
          </div>

          <div className="share-options">
            {shareMethod === 'webShare' && (
              <button 
                className="btn btn-primary btn-full share-btn"
                onClick={handleKakaoTalkShare}
              >
                📱 카카오톡으로 공유
              </button>
            )}
            
            {shareMethod === 'clipboard' && (
              <>
                <button 
                  className="btn btn-primary btn-full share-btn"
                  onClick={handleClipboardShare}
                >
                  📋 클립보드에 복사
                </button>
                <p className="share-hint">
                  복사 후 카카오톡에서 붙여넣기(Ctrl+V)로 공유하세요
                </p>
              </>
            )}

            {shareMethod === 'download' && (
              <p className="share-hint">
                모바일 브라우저에서 접속하시면 카카오톡으로 바로 공유할 수 있습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

