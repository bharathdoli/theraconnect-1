"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const client_1 = require("@prisma/client");
const parent_controller_1 = require("./parent.controller");
const parent_validation_1 = require("./parent.validation");
const client_2 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_2.PrismaClient();
// All routes are for authenticated Parents only
router.use(auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.Role.PARENT]));
router.get('/me/profile', parent_controller_1.getMyProfileHandler);
// Children CRUD
router.get('/me/children', parent_controller_1.getMyChildrenHandler);
router.post('/me/children', (0, validate_middleware_1.validate)({ body: parent_validation_1.childSchema.shape.body }), parent_controller_1.addChildHandler);
router.put('/me/children/:childId', (0, validate_middleware_1.validate)({ body: parent_validation_1.updateChildSchema.shape.body, params: parent_validation_1.childIdParamSchema.shape.params }), parent_controller_1.updateChildHandler);
router.delete('/me/children/:childId', (0, validate_middleware_1.validate)({ params: parent_validation_1.childIdParamSchema.shape.params }), parent_controller_1.deleteChildHandler);
// Public list of active therapists for parents
router.get('/therapists', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const therapists = yield prisma.therapistProfile.findMany({
            where: { status: 'ACTIVE' },
            select: {
                id: true,
                name: true,
                specialization: true,
                experience: true,
                baseCostPerSession: true,
                averageRating: true,
            },
            orderBy: { name: 'asc' },
        });
        res.json(therapists);
    }
    catch (e) {
        res.status(500).json({ message: e.message });
    }
}));
exports.default = router;
