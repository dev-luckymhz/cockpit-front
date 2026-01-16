import { useEffect, useState } from "react";
import { getComponentStatsByGroup } from "../services/eset.services";

export default function useEsetStats() {
  const [componentCounts, setComponentCounts] = useState({});
  const [agentCount, setAgentCount] = useState(0);
  const [serverCount, setServerCount] = useState(0);
  const [pcCount, setPcCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await getComponentStatsByGroup();
        const { agentCount, componentCounts, serverCount, pcCount } = res.data;

        setAgentCount(agentCount || 0);
        setServerCount(serverCount || 0);
        setPcCount(pcCount || 0);
        setComponentCounts(componentCounts || {});
      } catch (err) {
        console.error("Erreur lors de la récupération des stats :", err);
        setComponentCounts({});
        setAgentCount(0);
        setServerCount(0);
        setPcCount(0);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return {
    loadingStats,
    componentCounts,
    agentCount,
    serverCount,
    pcCount,
  };
}
