import { useEffect, useState } from "react";
import {
  getOrganisation,
  getDevices,
  getDeviceLastLogged,
} from "../services/ninja.services";

export default function useNinjaStats() {
  const [organisation, setOrganisation] = useState(null);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [serverCount, setServerCount] = useState(0);
  const [workstationCount, setWorkstationCount] = useState(0);
  const [hypervCount, setHypervCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [chartData, setChartData] = useState([]);

  const COLORS = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
  ];

  // Labels français pour les types d'appareils Ninja
  const NODE_CLASS_LABELS = {
    WINDOWS_SERVER: "Serveur",
    WINDOWS_WORKSTATION: "Ordinateur / PC",
    HYPERV_VMM_HOST: "Serveur physique",
    HYPERV_VMM_GUEST: "Serveur virtuel",
    MAC: "Mac",
    LINUX_SERVER: "Serveur Linux",
    LINUX_WORKSTATION: "Poste Linux",
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const orgRes = await getOrganisation();
        setOrganisation(orgRes.data);

        const devRes = await getDevices();
        const deviceList = devRes.data.data || [];

        const enriched = await Promise.all(
          deviceList.map(async (device) => {
            if (device.nodeClass !== "WINDOWS_WORKSTATION") return device;

            try {
              const lastLog = await getDeviceLastLogged(device.id);
              return { ...device, lastLogged: lastLog.data };
            } catch {
              return { ...device, lastLogged: null };
            }
          })
        );

        setDevices(enriched);

        // Stats
        const total = enriched.length;
        setTotalCount(total);

        setServerCount(
          enriched.filter((d) => d.nodeClass === "WINDOWS_SERVER").length
        );

        setWorkstationCount(
          enriched.filter((d) => d.nodeClass === "WINDOWS_WORKSTATION").length
        );

        setHypervCount(
          enriched.filter((d) => d.nodeClass.includes("HYPERV")).length
        );

        setOfflineCount(enriched.filter((d) => d.offline).length);

        // Chart Data
        const typeCounts = enriched.reduce((acc, d) => {
          acc[d.nodeClass] = (acc[d.nodeClass] || 0) + 1;
          return acc;
        }, {});

        setChartData(
          Object.entries(typeCounts).map(([name, value]) => ({
            name: NODE_CLASS_LABELS[name] || name,
            value,
          }))
        );
      } catch (err) {
        console.error("Erreur:", err);
        setDevices([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Cards for the component
  const cardStats = [
    {
      name: "Total appareils",
      icon: "ri-computer-line",
      value: totalCount,
      color: "#4e73df",
    },
    {
      name: "Serveurs",
      icon: "ri-server-line",
      value: serverCount,
      color: "#1cc88a",
    },
    {
      name: "PCs / Laptops",
      icon: "ri-computer-line",
      value: workstationCount,
      color: "#36b9cc",
    },
    {
      name: "Hôtes Hyper-V",
      icon: "ri-hard-drive-2-line",
      value: hypervCount,
      color: "#f6c23e",
    },
  ];

  return {
    loading,
    organisation,
    devices,
    cardStats,
    chartData,
    COLORS,
  };
}
