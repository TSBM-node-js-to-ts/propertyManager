const express = require('express');
const app = express();
const cors = require('cors');
const { sequelize } = require('./models');
const propertyRouter = require('./routes/Properties');
// const customerRouter = require('./routes/customers'); // 필요시 주석 해제

// Swagger 설정 
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '부동산 매물 관리 시스템 API',
      version: '1.0.0',
      description: '매물 등록/수정/삭제 및 검색 기능 제공',
    },
  },
  apis: ['./routes/*.js'], // routes 폴더 내의 파일들에서 주석을 읽어 문서를 만듦
};

const swaggerSpec = swaggerJsdoc(options);

app.use(cors());
app.use(express.json());

// API 라우트 연결
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/properties', propertyRouter);
// app.use('/api/customers', customerRouter);

// DB 연결 및 서버 시작
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
    app.listen(3000, () => {
      console.log('서버가 3000번 포트에서 실행 중입니다.');
      console.log('Swagger 문서: http://localhost:3000/api-docs');
    });
  })
  .catch((err) => {
    console.error('DB 연결 실패:', err);
  });