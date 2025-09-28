import { z } from 'zod';

export const getSlotsQuerySchema = z.object({
<<<<<<< HEAD
  query: z.object({
    therapistId: z.string().cuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  }),
});

export const createBookingSchema = z.object({
  body: z.object({
    childId: z.string().cuid(),
    timeSlotId: z.string().cuid(),
  }),
});
=======
  therapistId: z.string().cuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
});

export const createBookingSchema = z.object({
  childId: z.string().cuid(),
  timeSlotId: z.string().cuid(),
});
>>>>>>> 3d1437e (final commit)
