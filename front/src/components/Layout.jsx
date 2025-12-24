import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div>
      <Sidebar />

      <main className="pl-16 min-h-screen transition-none">{children}</main>
    </div>
  );
}
