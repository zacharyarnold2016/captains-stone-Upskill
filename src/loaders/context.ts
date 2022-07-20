import { Context } from "../interfaces/general";
import { AuthService } from "../services/auth.service";

const loadContext = async (): Promise<Context> => ({
  services: {
    authService: new AuthService(),
  },
});

export default loadContext;
