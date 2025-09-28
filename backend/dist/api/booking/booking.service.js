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
<<<<<<< HEAD
exports.getMyBookings = exports.createBooking = exports.getAvailableSlots = void 0;
=======
exports.getParentProfile = exports.getMyBookings = exports.createBooking = exports.getAvailableSlots = void 0;
>>>>>>> 3d1437e (final commit)
const client_1 = require("@prisma/client");
const notification_service_1 = require("../../services/notification.service");
const prisma = new client_1.PrismaClient();
const getAvailableSlots = (therapistId, date) => __awaiter(void 0, void 0, void 0, function* () {
<<<<<<< HEAD
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    return prisma.timeSlot.findMany({
=======
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
    const therapist = yield prisma.therapistProfile.findUnique({
        where: { id: therapistId },
        select: { status: true },
    });
    if (!therapist || therapist.status !== client_1.TherapistStatus.ACTIVE) {
        console.log('Therapist not found or not active');
        return [];
    }
    // Check if slots already exist for this day
    const existingSlots = yield prisma.timeSlot.findMany({
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
            { start: '09:00', end: '09:45' }, // 9:00 – 9:45
            { start: '10:00', end: '10:45' }, // 10:00 – 10:45
            { start: '11:00', end: '11:45' }, // 11:00 – 11:45
            { start: '12:00', end: '12:45' }, // 12:00 – 12:45
            { start: '14:00', end: '14:45' }, // 2:00 – 2:45
            { start: '15:00', end: '15:45' }, // 3:00 – 3:45
            { start: '16:00', end: '16:45' }, // 4:00 – 4:45
            { start: '17:00', end: '17:45' }, // 5:00 – 5:45
        ];
        const slotsToCreate = slotTimes.map(({ start, end }) => {
            return {
                therapistId,
                startTime: new Date(`${date}T${start}:00`), // Local time
                endTime: new Date(`${date}T${end}:00`), // Local time
                isBooked: false,
            };
        });
        if (slotsToCreate.length > 0) {
            yield prisma.timeSlot.createMany({
                data: slotsToCreate,
                skipDuplicates: true
            });
            console.log('Created', slotsToCreate.length, 'default slots');
        }
    }
    // Return available (unbooked) slots for the day
    const availableSlots = yield prisma.timeSlot.findMany({
>>>>>>> 3d1437e (final commit)
        where: {
            therapistId,
            isBooked: false,
            startTime: { gte: startOfDay, lte: endOfDay },
<<<<<<< HEAD
            therapist: { status: client_1.TherapistStatus.ACTIVE },
        },
        orderBy: { startTime: 'asc' },
    });
=======
        },
        orderBy: { startTime: 'asc' },
    });
    console.log('Returning', availableSlots.length, 'available slots');
    return availableSlots;
>>>>>>> 3d1437e (final commit)
});
exports.getAvailableSlots = getAvailableSlots;
const createBooking = (parentId, input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { childId, timeSlotId } = input;
<<<<<<< HEAD
=======
    console.log('Creating booking:', { parentId, childId, timeSlotId });
    // Get the time slot
>>>>>>> 3d1437e (final commit)
    const timeSlot = yield prisma.timeSlot.findFirst({
        where: { id: timeSlotId, isBooked: false },
        include: { therapist: true },
    });
<<<<<<< HEAD
    if (!timeSlot)
        throw new Error('This time slot is not available.');
    if (timeSlot.therapist.status !== client_1.TherapistStatus.ACTIVE) {
        throw new Error('This therapist is not available for booking.');
    }
    const child = yield prisma.child.findFirst({
        where: { id: childId, parentId },
    });
    if (!child)
        throw new Error('Child not found or does not belong to this parent.');
    const parent = yield prisma.parentProfile.findUnique({ where: { id: parentId } });
    const finalFee = (_a = parent === null || parent === void 0 ? void 0 : parent.customFee) !== null && _a !== void 0 ? _a : timeSlot.therapist.baseCostPerSession;
    const booking = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.timeSlot.update({ where: { id: timeSlotId }, data: { isBooked: true } });
=======
    if (!timeSlot) {
        throw new Error('This time slot is not available.');
    }
    if (timeSlot.therapist.status !== client_1.TherapistStatus.ACTIVE) {
        throw new Error('This therapist is not available for booking.');
    }
    // Verify child belongs to parent
    const child = yield prisma.child.findFirst({
        where: { id: childId, parentId },
    });
    if (!child) {
        throw new Error('Child not found or does not belong to this parent.');
    }
    // Get parent profile for fee calculation
    const parent = yield prisma.parentProfile.findUnique({ where: { id: parentId } });
    const finalFee = (_a = parent === null || parent === void 0 ? void 0 : parent.customFee) !== null && _a !== void 0 ? _a : timeSlot.therapist.baseCostPerSession;
    // Create booking in transaction
    const booking = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // Mark slot as booked
        yield tx.timeSlot.update({
            where: { id: timeSlotId },
            data: { isBooked: true }
        });
        // Create booking
>>>>>>> 3d1437e (final commit)
        const newBooking = yield tx.booking.create({
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
        yield tx.payment.create({
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
        yield tx.dataAccessPermission.create({
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
        return newBooking;
    }));
<<<<<<< HEAD
=======
    // Send notifications
>>>>>>> 3d1437e (final commit)
    yield (0, notification_service_1.sendNotification)({
        userId: timeSlot.therapist.userId,
        type: 'BOOKING_CONFIRMED',
        message: `You have a new booking with ${child.name} on ${timeSlot.startTime.toLocaleString()}.`
    });
    yield (0, notification_service_1.sendNotification)({
        userId: parent.userId,
        type: 'BOOKING_CONFIRMED',
        message: `Your booking for ${child.name} is confirmed for ${timeSlot.startTime.toLocaleString()}.`
    });
<<<<<<< HEAD
=======
    console.log('Booking created successfully:', booking.id);
>>>>>>> 3d1437e (final commit)
    return booking;
});
exports.createBooking = createBooking;
const getMyBookings = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = role === client_1.Role.PARENT
        ? { parent: { userId } }
        : { therapist: { userId, status: client_1.TherapistStatus.ACTIVE } };
    return prisma.booking.findMany({
        where: whereClause,
        include: {
            child: true,
            therapist: { select: { name: true, specialization: true } },
            parent: { select: { name: true } },
            timeSlot: true,
        },
        orderBy: { timeSlot: { startTime: 'desc' } }
    });
});
exports.getMyBookings = getMyBookings;
<<<<<<< HEAD
=======
const getParentProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.parentProfile.findUnique({ where: { userId } });
});
exports.getParentProfile = getParentProfile;
>>>>>>> 3d1437e (final commit)
