import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { NavbarSidebar } from "@/modules/home/ui/components/navbar-sidebar";
import { Footer } from "@/modules/home/ui/components/footer";
import { AppSidebar } from "@/modules/home/ui/components/app-sidebar";
import { SiteHeader } from "@/modules/home/ui/components/site-header";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* <SectionCards /> */}
                <div className="px-4 lg:px-6">
                  {/* <ChartAreaInteractive /> */}
                </div>
                {/* <DataTable data={data} /> */}
              </div>
            </div>
          </div>
          <main className="flex flex-col w-full overflow-hidden">
            {/* <Navbar /> */}
            <div className="flex-1">{children}</div>  
            {/* <Footer /> */}
          </main>
        </SidebarInset>
      </SidebarProvider>
      {/* <NavbarSidebar /> */}
    </div>
  );
};

export default Layout;
