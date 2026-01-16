import React, { useEffect, useState } from "react";
import { getMergedDevices } from "../../services/inventoryServices";

export default function LicenseTables() {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getMergedDevices();
        const devices = response.data.devices || [];

        // Map API response to table-friendly format
        const mapped = devices.map((d) => ({
          name: d.systemName,
          status: { label: "Actif", icon: "ri-wifi-line", color: "success" }, // always active
          microsoft: d.os?.name ? [d.os.name] : null,
          ninja: { label: "Actif", color: "success" }, // always active
          eset: d.isEsetActive
            ? { list: d.deployedComponents?.map((c) => c.displayName) || [] }
            : { label: "Non actif", color: "danger" },
        }));

        setPcData(mapped);
      } catch (err) {
        console.error("Failed to fetch merged devices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <div className="p-5">Chargement des données...</div>;

  return (
    <div className="container py-5">
      <h3 className="mb-4">
        <i className="ri-building-line me-2"></i>
        Gestion des PC et licences clients
      </h3>

      <div className="table-container">
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Nom du PC</th>
                <th>Statut</th>
                <th>Microsoft</th>
                <th>Ninja</th>
                <th>ESET</th>
              </tr>
            </thead>
            <tbody>
              {pcData.map((pc, index) => (
                <tr key={index}>
                  <td className="pc-name">
                    <i className="ri-computer-line text-primary me-1"></i>
                    {pc.name}
                  </td>

                  <td>
                    <span className={`badge bg-${pc.status.color}`}>
                      <i className={`${pc.status.icon} me-1`}></i>
                      {pc.status.label}
                    </span>
                  </td>

                  <td>
                    {pc.microsoft ? (
                      <ul className="list-unstyled license-list mb-0">
                        {pc.microsoft.map((licence, i) => (
                          <li key={i}>
                            <i className="ri-microsoft-fill text-info me-1"></i>
                            {licence}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted">
                        <i className="ri-close-circle-line me-1"></i>
                        Aucune licence Microsoft
                      </span>
                    )}
                  </td>

                  <td>
                    <span className={`badge bg-${pc.ninja.color}`}>
                      <i className="ri-shield-check-line me-1"></i>
                      {pc.ninja.label}
                    </span>
                  </td>

                  <td>
                    {pc.eset.list ? (
                      <ul className="list-unstyled license-list mb-0">
                        {pc.eset.list.map((item, i) => (
                          <li key={i}>
                            <i className="ri-bug-line text-success me-1"></i>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className={`badge bg-${pc.eset.color}`}>
                        <i className="ri-bug-line me-1"></i>
                        {pc.eset.label}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
