"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLeaveSchema = exports.createTimeSlotsSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createTimeSlotsSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
        slots: zod_1.z.array(zod_1.z.object({
            startTime: zod_1.z.string().datetime(),
            endTime: zod_1.z.string().datetime(),
        })).nonempty(),
    }),
});
exports.requestLeaveSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
        type: zod_1.z.nativeEnum(client_1.LeaveType),
        reason: zod_1.z.string().optional(),
    }),
});
