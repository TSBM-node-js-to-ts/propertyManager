const express = require('express');
const router = express.Router();
const { Property } = require('../models'); // DB 모델 가져오기
const { Op } = require('sequelize');

// 1. 매물 등록 (Create)
router.post('/', async (req, res) => {
    try {
        const property = await Property.create(req.body);
        console.log('매물 등록 성공:', property.id);
        res.status(201).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '매물 등록 실패' });
    }
});

// 2. 매물 전체 조회 (Read All)
router.get('/', async (req, res) => {
    try {
        const properties = await Property.findAll({
            order: [['id', 'DESC']] // 최신순 정렬
        });
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '매물 조회 실패' });
    }
});

// 3. 매물 상세 조회 (Read One)
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: '매물 없음' });
        res.status(200).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '상세 조회 실패' });
    }
});

// 4. 매물 수정 (Update)
router.patch('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: '매물 없음' });
        
        await property.update(req.body);
        res.status(200).json(property);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '매물 수정 실패' });
    }
});

// 5. 매물 삭제 (Delete)
router.delete('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: '매물 없음' });
        
        await property.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '매물 삭제 실패' });
    }
});

module.exports = router;