import { Router } from "express";
import { createRoom, joinRoom } from "./controllers";

const router: Router = Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);

export default router;
