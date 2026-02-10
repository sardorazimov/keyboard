import Header from "../../components/shared/header";
import SidebarGame from "../../components/shared/sidebar";
import Sidebar from "../../components/shared/sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
     <SidebarGame />
      <div className="flex  flex-1 flex-col">
        <main className="flex-1  mt-10  ">
          <Header />
          {children}
        </main>
      </div>
    </div>
  );
}
