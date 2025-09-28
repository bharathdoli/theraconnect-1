import type { Request, Response } from 'express';
import * as bookingService from './booking.service';
<<<<<<< HEAD
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
=======
>>>>>>> 3d1437e (final commit)

export const getAvailableSlotsHandler = async (req: Request, res: Response) => {
    try {
        const { therapistId, date } = req.query as { therapistId: string; date: string };
<<<<<<< HEAD
        const slots = await bookingService.getAvailableSlots(therapistId, date);
        res.status(200).json(slots);
    } catch (error: any) {
=======
        console.log('Getting slots for therapist:', therapistId, 'date:', date);
        
        const slots = await bookingService.getAvailableSlots(therapistId, date);
        console.log('Found slots:', slots.length);
        
        res.status(200).json(slots);
    } catch (error: any) {
        console.error('Error in getAvailableSlotsHandler:', error);
>>>>>>> 3d1437e (final commit)
        res.status(500).json({ message: 'Failed to get slots' });
    }
};

export const createBookingHandler = async (req: Request, res: Response) => {
    try {
<<<<<<< HEAD
        const parentProfile = await prisma.parentProfile.findUnique({ where: { userId: req.user!.userId }});
        if (!parentProfile) return res.status(404).json({ message: 'Parent profile not found' });
=======
        const parentProfile = await bookingService.getParentProfile(req.user!.userId);
        if (!parentProfile) {
            return res.status(404).json({ message: 'Parent profile not found' });
        }
>>>>>>> 3d1437e (final commit)

        const booking = await bookingService.createBooking(parentProfile.id, req.body);
        res.status(201).json(booking);
    } catch (error: any) {
<<<<<<< HEAD
=======
        console.error('Error in createBookingHandler:', error);
>>>>>>> 3d1437e (final commit)
        res.status(400).json({ message: error.message });
    }
};

export const getMyBookingsHandler = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getMyBookings(req.user!.userId, req.user!.role);
        res.status(200).json(bookings);
    } catch (error: any) {
<<<<<<< HEAD
        res.status(500).json({ message: 'Failed to retrieve bookings' });
    }
}
=======
        console.error('Error in getMyBookingsHandler:', error);
        res.status(500).json({ message: 'Failed to retrieve bookings' });
    }
};
>>>>>>> 3d1437e (final commit)
