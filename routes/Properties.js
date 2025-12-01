const express = require('express');
const router = express.Router();
const { Property, sequelize } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: 부동산 매물 관리 API (상세 기능 포함)
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: 매물 전체 조회 및 검색
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 주소 또는 건물명 검색어
 *     responses:
 *       200:
 *         description: 조회 성공
 */
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let whereClause = {};
        if (search) {
            whereClause = {
                address: { [Op.like]: `%${search}%` }
            };
        }
        const properties = await Property.findAll({
            where: whereClause,
            order: [['id', 'DESC']]
        });
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '조회 실패' });
    }
});

/**
 * @swagger
 * /api/properties:
 *   post:
 *     summary: 새 매물 상세 등록
 *     tags: [Properties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "원룸"
 *               address:
 *                 type: string
 *                 example: "서울시 마포구 노고산동 107-17"
 *               roomNumber:
 *                 type: string
 *                 example: "201호"
 *               builtYear:
 *                 type: integer
 *                 example: 2020
 *               areaGeneral:
 *                 type: number
 *                 example: 15.5
 *               areaPrivate:
 *                 type: number
 *                 example: 8.5
 *               rooms:
 *                 type: integer
 *                 example: 1
 *               priceSale:
 *                 type: integer
 *                 description: 매매가
 *               priceDeposit:
 *                 type: integer
 *                 description: 보증금
 *               priceMonth:
 *                 type: integer
 *                 description: 월세
 *               pricePremium:
 *                 type: integer
 *                 description: 권리금
 *               ownerPhone:
 *                 type: string
 *                 example: "010-1234-5678"
 *               tenantName:
 *                 type: string
 *                 description: 세입자 성함
 *               tenantPhone:
 *                 type: string
 *                 description: 세입자 연락처
 *               options:
 *                 type: string
 *                 example: "에어컨,냉장고,세탁기"
 *               photoLink:
 *                 type: string
 *                 description: 사진 링크
 *               contractLink:
 *                 type: string
 *                 description: 계약서 링크
 *     responses:
 *       201:
 *         description: 등록 성공
 */
router.post('/', async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json(property);
    } catch (error) {
        res.status(500).json({ message: '등록 실패' });
    }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: 매물 상세 조회
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상세 정보 반환
 */
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: '매물 없음' });
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: '에러' });
    }
});

/**
 * @swagger
 * /api/properties/{id}:
 *   delete:
 *     summary: 매물 삭제 (CEO 권한 필요)
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *         description: CEO 또는 STAFF
 *     responses:
 *       204:
 *         description: 삭제 성공
 */
router.delete('/:id', async (req, res) => {
    const userRole = req.headers['x-user-role'];
    if (userRole !== 'CEO') {
        return res.status(403).json({ message: '권한 없음' });
    }
    try {
        const property = await Property.findByPk(req.params.id);
        if (!property) return res.status(404).json({ message: '매물 없음' });
        await property.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: '삭제 실패' });
    }
});

module.exports = router;