import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@/modules/auth/decorators/role.decorator";
import { Role } from "@/common/enums/index";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) return true

    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) {
      throw new ForbiddenException("User not found")
    }

    return requiredRoles.some((role) => role === user.role)
  }
}