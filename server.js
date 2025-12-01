const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const propertyRouter = require('./routes/Properties');

// --- Swagger 설정 시작 ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '부동산 매물 관리 시스템 API',
      version: '1.0.0',
      description: '매물 등록, 수정, 삭제(권한필요), 검색 기능을 제공합니다.',
    },
  },
  // 중요: routes 폴더에 있는 모든 .js 파일의 주석(@swagger)을 읽어옴
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);
// --- Swagger 설정 끝 ---

app.use(cors());
app.use(express.json());

// API 주소 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/properties', propertyRouter);

// 서버 실행
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ 데이터베이스 연결 성공 (SQLite)');
    app.listen(3000, () => {
      console.log('🚀 서버 실행 중: http://localhost:3000/api-docs (Swagger 확인)');
    });
  })
  .catch((err) => {
    console.error('❌ DB 연결 에러:', err);
  });