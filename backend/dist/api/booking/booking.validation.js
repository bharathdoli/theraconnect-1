"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = exports.getSlotsQuerySchema = void 0;
const zod_1 = require("zod");
exports.getSlotsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        therapistId: zod_1.z.string().cuid(),
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
    }),
});
exports.createBookingSchema = zod_1.z.object({
    body: zod_1.z.object({
        childId: zod_1.z.string().cuid(),
        timeSlotId: zod_1.z.string().cuid(),
    }),
});
