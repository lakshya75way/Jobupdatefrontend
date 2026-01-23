import { JwtPayload } from "../utils/jwt.types";
declare global{
    namespace Express {
        interface Request{
            user?:JwtPayload;
        }
    }
}
export{};