import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

export function SiteHeader() {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex flex-col">
          <h1 className="text-base font-medium">
            {user?.agency?.name || "Swift Aid Admin"}
          </h1>
          {user?.agency?.branch && (
            <p className="text-xs text-muted-foreground">
              {user.agency.branch} - {user.agency.type}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-sm font-medium">{user?.name || "Admin"}</span>
            <span className="text-xs text-muted-foreground">
              {user?.badgeNumber ? `Badge: ${user.badgeNumber}` : user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
