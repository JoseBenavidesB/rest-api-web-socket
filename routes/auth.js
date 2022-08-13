const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin, validateJsonWebToken } = require('../controllers/auth');
const { fieldValidate } = require('../middlewares/field-validate');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

/* ------Login------ */
router.post('/login', [
    check('email', 'Email necessary').isEmail(),
    check('password', 'Password is necessary').not().isEmpty(),
    fieldValidate
] ,login);

/* ------Google Login------ */
router.post('/google', [
    check('id_token', 'id_token necessary').not().isEmpty(),
    fieldValidate
] ,googleSignin);

/* ------Validate JWT------ */
router.get('/', validateJWT, validateJsonWebToken);

module.exports = router;