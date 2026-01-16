import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getDevicesByGroup } from "../../services/eset.services";
import useEsetStats from "../../hooks/useEsetStats";

export default function DeviceDataTable() {
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [filterText, setFilterText] = useState("");

  const { agentCount, serverCount, pcCount, componentCounts, loadingStats } =
    useEsetStats();

  const overviewCards = [
    {
      name: "ESET Management Agent",
      icon: "ri-computer-line",
      value: agentCount,
      desc: "Appareils installés",
      color: "#4e73df",
    },
    {
      name: "Servers",
      icon: "ri-server-line",
      value: serverCount,
      desc: "Nombre de serveurs",
      color: "#1cc88a",
    },
    {
      name: "PCs",
      icon: "ri-computer-line",
      value: pcCount,
      desc: "Nombre de PC",
      color: "#36b9cc",
    },
  ];

  const COLORS = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
  ];

  // Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        // ✅ Now backend determines the group automatically
        const res = await getDevicesByGroup();
        setDevices(res.data.devices || []);
      } catch (err) {
        console.error("Erreur lors de la récupération des devices :", err);
      } finally {
        setLoadingDevices(false);
      }
    };

    fetchDevices();
  }, []);

  // Filter devices
  const filteredItems = devices.filter(
    (item) =>
      item.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.group?.displayName?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Chart data
  const { ["ESET Management Agent"]: _, ...otherComponents } = componentCounts;
  const chartData = Object.entries(otherComponents).map(([name, value]) => ({
    name,
    value,
  }));

  const columns = [
    {
      name: "Nom de l'appareil",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <Link
          to={`/eset/device/${row.uuid}/details`}
          className="text-decoration-none"
        >
          {row.name}
        </Link>
      ),
    },
    {
      name: "Groupe",
      selector: (row) => row.group?.displayName,
      sortable: true,
    },
  ];

  return (
    <section className="my-5">
      <div className="container">
        <div className="row g-3 mb-4">
          {overviewCards.map((card, i) => (
            <div key={i} className="col-sm-6 col-md-3">
              <div
                className="bg-light card-cockpit-general p-3 h-100 text-center"
                style={{ borderTop: `4px solid ${card.color}` }}
              >
                <span style={{ color: card.color }}>
                  <i className={`${card.icon} ri-xl`}></i>
                </span>
                <div className="fw-semibold mt-2">{card.name}</div>
                <div className="fs-4 fw-bold">{card.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Devices Table */}
          <div className="col-lg-8">
            <div className="card card-cockpit-general">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Devices</h4>
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto"
                    placeholder="Rechercher…"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>

                {loadingDevices ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Chargement…</span>
                    </div>
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    striped
                    dense
                    highlightOnHover
                    responsive
                    defaultSortField="name"
                    noHeader
                  />
                )}
              </div>
            </div>
          </div>

          {/* Components Stats */}
          <div className="col-lg-4">
            <div className="card mb-4 card-cockpit-general">
              <div className="card-body card-cockpit-general table-responsive">
                <h4 className="mb-3">Composants déployés dans le groupe</h4>

                {loadingStats ? (
                  <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">
                        Calcul des statistiques…
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Composant</th>
                          <th>Nombre d'appareils</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(otherComponents).map(
                          ([name, count], i) => (
                            <tr key={name}>
                              <td>
                                <span
                                  className="badge"
                                  style={{
                                    backgroundColor: COLORS[i % COLORS.length],
                                  }}
                                >
                                  {name}
                                </span>
                              </td>
                              <td>{count}</td>
                            </tr>
                          )
                        )}
                        {Object.keys(otherComponents).length === 0 && (
                          <tr>
                            <td colSpan={2} className="text-center text-muted">
                              Aucun composant trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    {chartData.length > 0 && (
                      <div style={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={chartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {chartData.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
