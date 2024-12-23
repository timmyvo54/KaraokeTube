import { Router } from "express";
import { createRoom } from "./controllers";

const router: Router = Router();

router.post("/create-room", createRoom);

export default router;
