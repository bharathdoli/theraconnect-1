"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validate_middleware_1 = require("../../middleware/validate.middleware");
const client_1 = require("@prisma/client");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
<<<<<<< HEAD
router.use(auth_middleware_1.authenticate);
// A parent can get slots for a therapist
router.get('/slots', (0, auth_middleware_1.authorize)([client_1.Role.PARENT]), (0, validate_middleware_1.validate)({ query: booking_validation_1.getSlotsQuerySchema }), booking_controller_1.getAvailableSlotsHandler);
// A parent can create a booking
router.post('/', (0, auth_middleware_1.authorize)([client_1.Role.PARENT]), (0, validate_middleware_1.validate)({ body: booking_validation_1.createBookingSchema }), booking_controller_1.createBookingHandler);
// Both parents and therapists can view their own bookings
router.get('/me', (0, auth_middleware_1.authorize)([client_1.Role.PARENT, client_1.Role.THERAPIST]), booking_controller_1.getMyBookingsHandler);
=======
// A parent can get slots for a therapist
router.get('/slots', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.Role.PARENT]), booking_controller_1.getAvailableSlotsHandler);
// A parent can create a booking
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.Role.PARENT]), (0, validate_middleware_1.validate)({ body: booking_validation_1.createBookingSchema }), booking_controller_1.createBookingHandler);
// Both parents and therapists can view their own bookings
router.get('/me', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)([client_1.Role.PARENT, client_1.Role.THERAPIST]), booking_controller_1.getMyBookingsHandler);
>>>>>>> 3d1437e (final commit)
exports.default = router;
