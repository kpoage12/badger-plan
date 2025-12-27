import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/state/:clientId", async (req, res) => {
    const {clientId} = req.params;
    const state = await prisma.userState.findUnique({ where: { clientId } });
    res.json(state ?? null);
})

router.put("/state/:clientId", async (req, res) => {
    const { clientId } = req.params;
    const { completedIds, prefs } = req.body;
  
    const state = await prisma.userState.upsert({
      where: { clientId },
      create: { clientId, completedIds: completedIds ?? [], prefs: prefs ?? {} },
      update: { completedIds: completedIds ?? [], prefs: prefs ?? {} },
    });
  
    res.json(state);
  });
  
  export default router;
  