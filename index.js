const express = require('express');
const app = express();
const port = 3000;

const { sequelize } =require('./models'); // 1. DB 연결 객체 가져오기

const propertyRoutes = require('./routes/Properties');
const customerRoutes = require('./routes/customers');

app.use(express.json());

app.use(express.static('public')); //프론트엔드 파일읇 보여줄 거임

//API설정경로
app.use('/api/properties', propertyRoutes);
app.use('/api/customers', customerRoutes);

app.listen(port, async () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
    
    try {
        // 서버 켤 때 DB 연결 확인
        await sequelize.authenticate();
        console.log('데이터베이스 연결 성공!'); 
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
    }
});