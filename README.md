# propertyManager
부동산 중개사를 위한 매물 관리 프로그램 - 배윤선

## 현재 진행 상황
### 2025-11-17
**1. 무엇을?**<br>
매물관리 기능의 최소기능을 구현했습니다

**2. 상세설명**<br>
 i. 백엔드 CRUD 로직 구현

- `sequelize`와 `mysql2`를 사용하여 Node.js 서버와 MySQL 데이터베이스를 연결함
- `sequelize-cli`를 이용해 데이터의 설계도인 `Property`(매물)와 `Customer`(고객) 모델을 만들고, `db:migrate`로 실제 DB 테이블을 생성
- 실제로 기능하는 CRUD 기능을 구현함
    - **Create (등록):** `Property.create(req.body)`로 클라이언트가 보낸 데이터를 DB에 저장.
    - **Read (조회):** `Property.findAll()`로 DB에 저장된 모든 데이터를 가져옴.
    - **Delete (삭제):** `Property.destroy()`로 특정 ID의 데이터를 DB에서 삭제.
- 보안상의 이유로 막혀있는 브라우저(프론트엔드)의 요청을 허용하기 위해 `cors` 미들웨어를 적용했습니다.


ii. 프론트엔드 연동 및 테스트

- `pnpm create vite`를 통해 최신 React 환경(`client` 폴더)을 생성함
- 백엔드에 요청을 보내기 위해 `axios` 라이브러리를 설치
- 간단하게 화면/기능 구현
    - **State 관리 (`useState`):** 사용자가 입력하는 폼 데이터(`formState`)와 서버에서 받아온 매물 목록(`properties`)을 실시간으로 기억하고 관리했습니다.
    - **API 연동 (`axios`):**
        - `axios.get`: 화면이 켜질 때(`useEffect`) 백엔드에서 목록을 가져와 보여줌.
        - `axios.post`: '등록' 버튼을 누르면 입력한 정보를 백엔드로 보냄.
        - `axios.delete`: '삭제' 버튼을 누르면 해당 매물 삭제 요청을 보냄.
     
          
**3. 관련스크린샷**
<br>
<img width="421" height="817" alt="Image" src="https://github.com/user-attachments/assets/fd08a141-0c82-4455-92a5-2e3358e7917e" />
