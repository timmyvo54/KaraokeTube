import { Router } from "express";
import { createRoom, joinRoom, handshake} from "./controllers";

const router: Router = Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);
router.post("/handshake", handshake);

export default router;
