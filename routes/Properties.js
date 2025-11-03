const express = require('express');
const router = express.Router();

//Create
router.post('/', (req, res)=>{
    console.log('새 매물 등록 요청을 받음 : ', req.body);
    res.send('[POST /Properties]새 매물이 등록되었습니다');
});

//Read(1)
router.get('/', (req, res)=>{
    console.log('매물 목록 조회 요청을 받음');
    res.send('[GET /Properties]모든 매물 목록을 조회합니다');
});

//Read(2)
router.get('/:id', (req, res)=>{
    const propertyId = req.params.id;
    res.send(`[GET /Properties/${propertyId}] ${propertyId}번 매물 1개`);
});

//Update
router.patch(':/id', (req,res)=>{
    const propertyId = req.params.id;
    res.send(`[PATCH /Properites/${propertyId}] ${propertyId}번 매물 수정`);
});

//Delete
router.delete('/:id', (req, res)=>{
    const propertyId = req.params.id;
    res.send(`[DELETE /Properites/${propertyId}] ${propertyId}번 매물 삭제`);
});

module.exports = router;