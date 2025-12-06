# GitHub 업로드 가이드

## 1단계: Git 저장소 초기화

터미널에서 프로젝트 폴더로 이동한 후 다음 명령어를 실행하세요:

```bash
cd "C:\Users\k\계89"
git init
```

## 2단계: 파일 추가

모든 파일을 Git에 추가합니다:

```bash
git add .
```

## 3단계: 첫 커밋

변경사항을 커밋합니다:

```bash
git commit -m "Initial commit: 계모임 관리 시스템"
```

## 4단계: GitHub 저장소 생성

1. GitHub 웹사이트(https://github.com)에 로그인합니다.
2. 우측 상단의 "+" 버튼을 클릭하고 "New repository"를 선택합니다.
3. 저장소 이름을 입력합니다 (예: `account-club-manager`)
4. "Public" 또는 "Private"을 선택합니다.
5. **"Initialize this repository with a README"는 체크하지 마세요** (이미 로컬에 파일이 있으므로)
6. "Create repository" 버튼을 클릭합니다.

## 5단계: 원격 저장소 연결

GitHub에서 생성한 저장소의 URL을 복사한 후 다음 명령어를 실행하세요:

```bash
git remote add origin https://github.com/사용자명/저장소명.git
```

예시:
```bash
git remote add origin https://github.com/yourusername/account-club-manager.git
```

## 6단계: 코드 푸시

GitHub에 코드를 업로드합니다:

```bash
git branch -M main
git push -u origin main
```

## 이후 업데이트 방법

코드를 수정한 후 GitHub에 업로드하려면:

```bash
git add .
git commit -m "변경사항 설명"
git push
```

## 주의사항

- `.gitignore` 파일에 `node_modules`, `dist` 등이 포함되어 있어 불필요한 파일은 업로드되지 않습니다.
- GitHub에 업로드하기 전에 민감한 정보(API 키, 비밀번호 등)가 코드에 포함되어 있지 않은지 확인하세요.

