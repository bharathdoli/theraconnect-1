import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '@prisma/client';
import {
  getMyProfileHandler,
  createTimeSlotsHandler,
  requestLeaveHandler,
} from './therapist.controller';
import { createTimeSlotsSchema, requestLeaveSchema } from './therapist.validation';

const router = Router();
router.use(authenticate, authorize([Role.THERAPIST]));

router.get('/me/profile', getMyProfileHandler);
router.post(
  '/me/slots',
  validate({ body: createTimeSlotsSchema.shape.body }), // <-- just the schema
  createTimeSlotsHandler
)
router.post('/me/leaves', validate({body : requestLeaveSchema.shape.body}), requestLeaveHandler);

export default router;