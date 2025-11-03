// 1. express.Router() 가져오기
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('새 고객 등록 요청 받음:', req.body);
    res.send('[POST /customers] 새 고객 등록이 (나중에) 처리될 예정입니다.');
});

router.get('/', (req, res) => {
    console.log('고객 목록 조회 요청 받음');
    res.send('[GET /customers] 모든 고객 목록을 (나중에) 반환할 예정입니다.');
});

router.get('/:id', (req, res) => {
    const customerId = req.params.id;
    console.log(`${customerId}번 고객 상세 조회 요청 받음`);
    res.send(`[GET /customers/${customerId}] ${customerId}번 고객 1명을 (나중에) 반환할 예정입니다.`);
});

router.patch('/:id', (req, res) => {
    const customerId = req.params.id;
    console.log(`${customerId}번 고객 수정 요청 받음:`, req.body);
    res.send(`[PATCH /customers/${customerId}] ${customerId}번 고객 정보가 (나중에) 수정될 예정입니다.`);
});

router.delete('/:id', (req, res) => {
    const customerId = req.params.id;
    console.log(`${customerId}번 고객 삭제 요청 받음`);
    res.send(`[DELETE /customers/${customerId}] ${customerId}번 고객 정보가 (나중에) 삭제될 예정입니다.`);
});


module.exports = router;