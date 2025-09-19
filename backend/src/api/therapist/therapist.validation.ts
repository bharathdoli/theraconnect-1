import { z } from 'zod';
import { LeaveType } from '@prisma/client';

export const createTimeSlotsSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    slots: z.array(z.object({
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
    })).nonempty(),
  }),
});

export const requestLeaveSchema = z.object({
  body: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    type: z.nativeEnum(LeaveType),
    reason: z.string().optional(),
  }),
});