import type { Request, Response } from 'express';
import * as therapistService from './therapist.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getTherapistId = async (userId: string) => {
    const profile = await prisma.therapistProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new Error('Therapist profile not found');
    return profile.id;
}

export const getMyProfileHandler = async (req: Request, res: Response) => {
    try {
        const profile = await therapistService.getTherapistProfile(req.user!.userId);
        res.status(200).json(profile);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createTimeSlotsHandler = async (req: Request, res: Response) => {
    try {
        const therapistId = await getTherapistId(req.user!.userId);
        await therapistService.createTimeSlots(therapistId, req.body);
        res.status(201).json({ message: 'Time slots created successfully.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const requestLeaveHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const result = await therapistService.requestLeave(therapistId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMySlotsForDateHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const date = (req.query as any).date as string;
    const slots = await therapistService.getMySlotsForDate(therapistId, { date });
    res.status(200).json(slots);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};