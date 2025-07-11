import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { InventarioView } from "@/components/inventario/InventarioView";
import { ReproductivoView } from "@/components/reproductivo/ReproductivoView";
import { EngordeView } from "@/components/engorde/EngordeView";
import { SanidadView } from "@/components/sanidad/SanidadView";

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventario':
        return <InventarioView />;
      case 'reproductivo':
        return <ReproductivoView />;
      case 'engorde':
        return <EngordeView />;
      case 'sanidad':
        return <SanidadView />;
      case 'reportes':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Reportes y Análisis</h1>
            <p className="text-muted-foreground">Módulo en desarrollo - Costos, rentabilidad y dashboards</p>
          </div>
        );
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
