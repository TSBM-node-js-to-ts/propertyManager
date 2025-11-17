const express = require('express');
const router = express.Router();
const { Customer } = require('../models'); // DB 모델 가져오기

// 1. 고객 등록
router.post('/', async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '고객 등록 실패' });
    }
});

// 2. 고객 목록 조회
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.findAll({
             order: [['id', 'DESC']]
        });
        res.status(200).json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '고객 조회 실패' });
    }
});

// 3. 고객 상세 조회
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: '고객 없음' });
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '상세 조회 실패' });
    }
});

// 4. 고객 수정
router.patch('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: '고객 없음' });

        await customer.update(req.body);
        res.status(200).json(customer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '고객 수정 실패' });
    }
});

// 5. 고객 삭제
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) return res.status(404).json({ message: '고객 없음' });

        await customer.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '고객 삭제 실패' });
    }
});

module.exports = router;