import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const routeTitles = {
  '/dashboard': 'Tableau de bord',
  '/zones-clients': 'Zones clients',
  '/inventaire': 'Inventaire',
  '/tickets': 'Tickets',
  '/utilisateurs': 'Utilisateurs',
  '/abonnements': 'Abonnements',
  '/securite': 'Sécurité',
  '/sauvegardes': 'Sauvegardes',
  '/statut-des-services': 'Statut des services',
  '/monitoring-zabbix': 'Monitoring Zabbix',
  '/parametres': 'Paramètres',

  // New routes
  '/ion/device': 'ION - Device',
  '/eset/device/list': 'ESET - Device List',
  '/inventory/list': 'Inventory List',
};


const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const pageTitle = routeTitles[location.pathname] || 'CockPit';
    document.title = `${pageTitle} | CockPit`;
  }, [location.pathname]);

  return (
    <div className={`page-wrapper coockpit-theme ${isSidebarOpen ? 'toggled' : ''}`}>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="page-content">
        <Header pageTitle={routeTitles[location.pathname] || 'CockPit'} />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
