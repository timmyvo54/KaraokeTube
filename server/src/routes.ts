import { Router } from "express";
import { createRoom, joinRoom, verifyRoomExists, handshake} from "./controllers";

const router: Router = Router();

router.post("/create-room", createRoom);
router.post("/join-room", joinRoom);
router.get("/verify-room-exists", verifyRoomExists)
router.post("/handshake", handshake);

export default router;
