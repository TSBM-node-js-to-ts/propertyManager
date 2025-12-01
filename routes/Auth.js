const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 회원가입 및 로그인 API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ceo@test.com"
 *               password:
 *                 type: string
 *                 example: "1234"
 *               name:
 *                 type: string
 *                 example: "김대표"
 *               role:
 *                 type: string
 *                 example: "CEO"
 *     responses:
 *       201:
 *         description: 가입 성공
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        
        // 중복 체크
        const existUser = await User.findOne({ where: { email } });
        if (existUser) return res.status(400).json({ message: '이미 가입된 이메일입니다.' });

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword,
            name,
            role: role || 'STAFF'
        });

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 에러' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ceo@test.com"
 *               password:
 *                 type: string
 *                 example: "1234"
 *     responses:
 *       200:
 *         description: 로그인 성공
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ message: '이메일이 없습니다.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });

        // 로그인 성공 시 유저 정보 반환
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '로그인 에러' });
    }
});

module.exports = router;