import { PrismaClient, Role, TherapistStatus } from '@prisma/client';
import { z } from 'zod';
import { sendNotification } from '../../services/notification.service';
<<<<<<< HEAD
import type { createBookingSchema } from './booking.validation';

const prisma = new PrismaClient();
type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];

export const getAvailableSlots = async (therapistId: string, date: string) => {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    return prisma.timeSlot.findMany({
=======

const prisma = new PrismaClient();

export const getAvailableSlots = async (therapistId: string, date: string) => {
    console.log('getAvailableSlots called with:', { therapistId, date });
    
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    
    // Skip weekends: 0 = Sunday, 6 = Saturday (UTC)
    const dayOfWeek = startOfDay.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log('Weekend detected, returning empty slots');
        return [];
    }
    
    // Ensure therapist is ACTIVE
    const therapist = await prisma.therapistProfile.findUnique({
        where: { id: therapistId },
        select: { status: true },
    });
    
    if (!therapist || therapist.status !== TherapistStatus.ACTIVE) {
        console.log('Therapist not found or not active');
        return [];
    }
    
    // Check if slots already exist for this day
    const existingSlots = await prisma.timeSlot.findMany({
        where: {
            therapistId,
            startTime: { gte: startOfDay, lte: endOfDay }
        },
    });
    
    console.log('Existing slots count:', existingSlots.length);
    
    // If no slots exist, create default slots
    if (existingSlots.length === 0) {
        console.log('Creating default slots for', date);
        
        // Define exact time slots (in local time)
        const slotTimes = [
            { start: '09:00', end: '09:45' },   // 9:00 – 9:45
            { start: '10:00', end: '10:45' },   // 10:00 – 10:45
            { start: '11:00', end: '11:45' },   // 11:00 – 11:45
            { start: '12:00', end: '12:45' },   // 12:00 – 12:45
            { start: '14:00', end: '14:45' },   // 2:00 – 2:45
            { start: '15:00', end: '15:45' },   // 3:00 – 3:45
            { start: '16:00', end: '16:45' },   // 4:00 – 4:45
            { start: '17:00', end: '17:45' },   // 5:00 – 5:45
        ];

        const slotsToCreate = slotTimes.map(({ start, end }) => {
            return {
                therapistId,
                startTime: new Date(`${date}T${start}:00`), // Local time
                endTime: new Date(`${date}T${end}:00`),     // Local time
                isBooked: false,
            };
        });
        
        if (slotsToCreate.length > 0) {
            await prisma.timeSlot.createMany({ 
                data: slotsToCreate, 
                skipDuplicates: true 
            });
            console.log('Created', slotsToCreate.length, 'default slots');
        }
    }
    
    // Return available (unbooked) slots for the day
    const availableSlots = await prisma.timeSlot.findMany({
>>>>>>> 3d1437e (final commit)
        where: {
            therapistId,
            isBooked: false,
            startTime: { gte: startOfDay, lte: endOfDay },
<<<<<<< HEAD
            therapist: { status: TherapistStatus.ACTIVE },
        },
        orderBy: { startTime: 'asc' },
    });
};

export const createBooking = async (parentId: string, input: CreateBookingInput) => {
    const { childId, timeSlotId } = input;

=======
        },
        orderBy: { startTime: 'asc' },
    });
    
    console.log('Returning', availableSlots.length, 'available slots');
    return availableSlots;
};

export const createBooking = async (parentId: string, input: { childId: string; timeSlotId: string }) => {
    const { childId, timeSlotId } = input;
    
    console.log('Creating booking:', { parentId, childId, timeSlotId });
    
    // Get the time slot
>>>>>>> 3d1437e (final commit)
    const timeSlot = await prisma.timeSlot.findFirst({
        where: { id: timeSlotId, isBooked: false },
        include: { therapist: true },
    });
<<<<<<< HEAD
    if (!timeSlot) throw new Error('This time slot is not available.');
    if (timeSlot.therapist.status !== TherapistStatus.ACTIVE) {
        throw new Error('This therapist is not available for booking.');
    }

    const child = await prisma.child.findFirst({
        where: { id: childId, parentId },
    });
    if (!child) throw new Error('Child not found or does not belong to this parent.');

    const parent = await prisma.parentProfile.findUnique({ where: { id: parentId } });

    const finalFee = parent?.customFee ?? timeSlot.therapist.baseCostPerSession;

    const booking = await prisma.$transaction(async (tx) => {
        await tx.timeSlot.update({ where: { id: timeSlotId }, data: { isBooked: true } });

=======
    
    if (!timeSlot) {
        throw new Error('This time slot is not available.');
    }
    
    if (timeSlot.therapist.status !== TherapistStatus.ACTIVE) {
        throw new Error('This therapist is not available for booking.');
    }
    
    // Verify child belongs to parent
    const child = await prisma.child.findFirst({
        where: { id: childId, parentId },
    });
    
    if (!child) {
        throw new Error('Child not found or does not belong to this parent.');
    }
    
    // Get parent profile for fee calculation
    const parent = await prisma.parentProfile.findUnique({ where: { id: parentId } });
    const finalFee = parent?.customFee ?? timeSlot.therapist.baseCostPerSession;
    
    // Create booking in transaction
    const booking = await prisma.$transaction(async (tx) => {
        // Mark slot as booked
        await tx.timeSlot.update({ 
            where: { id: timeSlotId }, 
            data: { isBooked: true } 
        });
        
        // Create booking
>>>>>>> 3d1437e (final commit)
        const newBooking = await tx.booking.create({
            data: {
                parentId,
                childId,
                therapistId: timeSlot.therapistId,
                timeSlotId,
            },
        });
<<<<<<< HEAD

=======
        
        // Create payment record
>>>>>>> 3d1437e (final commit)
        await tx.payment.create({
            data: {
                bookingId: newBooking.id,
                parentId,
                therapistId: timeSlot.therapistId,
                amount: finalFee,
            }
        });
<<<<<<< HEAD

=======
        
        // Create data access permission
>>>>>>> 3d1437e (final commit)
        await tx.dataAccessPermission.create({
            data: {
                bookingId: newBooking.id,
                childId,
                therapistId: timeSlot.therapistId,
<<<<<<< HEAD
                canViewDetails: false, // Default to false
=======
                canViewDetails: false,
>>>>>>> 3d1437e (final commit)
                accessStartTime: timeSlot.startTime,
                accessEndTime: timeSlot.endTime,
            }
        });
<<<<<<< HEAD

        return newBooking;
    });

=======
        
        return newBooking;
    });
    
    // Send notifications
>>>>>>> 3d1437e (final commit)
    await sendNotification({
        userId: timeSlot.therapist.userId,
        type: 'BOOKING_CONFIRMED',
        message: `You have a new booking with ${child.name} on ${timeSlot.startTime.toLocaleString()}.`
    });
<<<<<<< HEAD
=======
    
>>>>>>> 3d1437e (final commit)
    await sendNotification({
        userId: parent!.userId,
        type: 'BOOKING_CONFIRMED',
        message: `Your booking for ${child.name} is confirmed for ${timeSlot.startTime.toLocaleString()}.`
    });
<<<<<<< HEAD

=======
    
    console.log('Booking created successfully:', booking.id);
>>>>>>> 3d1437e (final commit)
    return booking;
};

export const getMyBookings = async (userId: string, role: Role) => {
<<<<<<< HEAD
    const whereClause =
        role === Role.PARENT
            ? { parent: { userId } }
            : { therapist: { userId, status: TherapistStatus.ACTIVE } };
=======
    const whereClause = role === Role.PARENT
        ? { parent: { userId } }
        : { therapist: { userId, status: TherapistStatus.ACTIVE } };
    
>>>>>>> 3d1437e (final commit)
    return prisma.booking.findMany({
        where: whereClause,
        include: {
            child: true,
<<<<<<< HEAD
            therapist: { select: { name: true, specialization: true }},
            parent: { select: { name: true }},
            timeSlot: true,
        },
        orderBy: { timeSlot: { startTime: 'desc' }}
    });
};
=======
            therapist: { select: { name: true, specialization: true } },
            parent: { select: { name: true } },
            timeSlot: true,
        },
        orderBy: { timeSlot: { startTime: 'desc' } }
    });
};

export const getParentProfile = async (userId: string) => {
    return prisma.parentProfile.findUnique({ where: { userId } });
};
>>>>>>> 3d1437e (final commit)
