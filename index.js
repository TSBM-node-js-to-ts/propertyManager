const express = require('express');
const app = express();
const port = 3000;

const propertyRoutes = require('./routes/Properties');
const customerRoutes = require('./routes/customers');

app.use(express.json());

app.use('/properties', propertyRoutes);

app.use('/customers', customerRoutes);

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
}); 