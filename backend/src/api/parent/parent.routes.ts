import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '@prisma/client';
import {
  getMyProfileHandler,
  getMyChildrenHandler,
  addChildHandler,
  updateChildHandler,
  deleteChildHandler,
} from './parent.controller';
import { childIdParamSchema, childSchema, updateChildSchema } from './parent.validation';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// All routes are for authenticated Parents only
router.use(authenticate, authorize([Role.PARENT]));

router.get('/me/profile', getMyProfileHandler);

// Children CRUD
router.get('/me/children', getMyChildrenHandler);
router.post('/me/children', validate({body : childSchema.shape.body}), addChildHandler);
router.put('/me/children/:childId', validate({ body: updateChildSchema.shape.body, params: childIdParamSchema.shape.params }), updateChildHandler);
router.delete('/me/children/:childId', validate({ params: childIdParamSchema.shape.params }), deleteChildHandler);

// Public list of active therapists for parents
router.get('/therapists', async (req, res) => {
  try {
    const therapists = await prisma.therapistProfile.findMany({
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
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

export default router;