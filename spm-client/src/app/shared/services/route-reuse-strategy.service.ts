import { RouteReuseStrategy } from "@angular/router/";
import { ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";
import { UserRole } from "../interfaces/user.interface";
import { IStringMap } from "../utility/common";

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  private readonly storedRouteHandles = new Map<string, DetachedRouteHandle>();
  private readonly allowRetrieveCache: IStringMap<boolean> = {
    [UserRole.MANAGER]: false,
    [UserRole.EMPLOYEE]: false,
    [UserRole.ADMIN]: false,
  };

  shouldReuseRoute(
    before: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    const data = this.getData(curr);
    if (Object.keys(this.allowRetrieveCache).includes(data)) {
      this.allowRetrieveCache[data] = true;
    }
    return before.routeConfig === curr.routeConfig;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.storedRouteHandles.get(
      this.getData(route)
    ) as DetachedRouteHandle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const data = this.getData(route);
    if (this.allowRetrieveCache[data]) {
      return this.storedRouteHandles.has(data);
    }
    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.allowRetrieveCache.hasOwnProperty(this.getData(route));
  }

  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {
    this.storedRouteHandles.set(this.getData(route), detachedTree);
  }

  private getData(route: ActivatedRouteSnapshot): string {
    if (
      route.routeConfig &&
      route.routeConfig.data &&
      route.routeConfig.data.route
    ) {
      return route.routeConfig.data.route;
    }
    return "";
  }
}
