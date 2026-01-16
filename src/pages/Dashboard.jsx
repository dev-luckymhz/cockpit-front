import { useEffect, useState } from "react";
import { getComputers } from "../services/inventoryServices";

import useEsetStats from "../hooks/useEsetStats";
import useNinjaStats from "../hooks/useNinjaStats";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const { loadingStats, agentCount, componentCounts } = useEsetStats();
  const {
    loading: loadingNinja,
    cardStats: ninjaCards,
    chartData: ninjaChart,
    COLORS: ninjaColors,
  } = useNinjaStats();

  const [computerCount, setComputerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch computers
  useEffect(() => {
    async function load() {
      try {
        const comp = await getComputers();
        setComputerCount(comp.data?.totalCount || 0);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Dashboard cards
  const cards = [
    {
      label: "Ordinateurs",
      value: computerCount,
      icon: "ri-computer-line",
      color: "#4e73df",
      link: "/inventory/list?tab=computers",
    },
    {
      label: "Agents ESET",
      value: agentCount,
      icon: "ri-shield-check-line",
      color: "#36b9cc",
      link: "/eset/device/list",
    },
    {
      label: "Agents Ninja",
      value: ninjaCards.length ? ninjaCards[0]?.value : 0,
      icon: "ri-global-line",
      color: "#1cc88a",
      link: "/ninja/organisation",
    },
  ];

  // Correlation chart data
  const correlationData = [
    { name: "Ordinateurs", count: computerCount },
    { name: "Agents ESET", count: agentCount },
  ];

  // ESET Pie chart data
  const { ["ESET Management Agent"]: _, ...otherComponents } = componentCounts;
  const esetChartData = Object.entries(otherComponents).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
  ];

  return (
    <div className="container-fluid mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item">
            <a href="#">Accueil</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Tableau de bord
          </li>
        </ol>
      </nav>

      {/* Top cards */}
      <div className="row g-3 mb-4">
        {loading || loadingStats || loadingNinja ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : (
          cards.map((card, i) => (
            <div key={i} className="col-sm-6 col-md-3">
              <a
                href={card.link}
                className="text-decoration-none"
                style={{ color: "inherit" }}
              >
                <div
                  className="bg-light card-cockpit-general p-3 h-100 text-center"
                  style={{ borderTop: `4px solid ${card.color}` }}
                >
                  <span style={{ color: card.color }}>
                    <i className={`${card.icon} ri-xl`}></i>
                  </span>
                  <div className="fw-semibold mt-2">{card.label}</div>
                  <div className="fs-4 fw-bold">{card.value}</div>
                </div>
              </a>
            </div>
          ))
        )}
      </div>

      {/* Row with charts — 3 columns */}
      <div className="row g-3">

        {/* <div className="col-lg-4">
          <div className="card card-cockpit-general h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Corrélation Ordinateurs / Agents ESET</h5>
              {loading || loadingStats ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={correlationData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#4e73df" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div> */}

        {/* CENTER — Ninja Pie Chart */}
        <div className="col-lg-4">
          <div className="card card-cockpit-general h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Inventaire Ninja</h5>
              {loadingNinja ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : (
                <>
                  <div style={{ width: "100%", height: 250 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={ninjaChart}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {ninjaChart.map((_, index) => (
                            <Cell
                              key={index}
                              fill={ninjaColors[index % ninjaColors.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul className="list-group list-group-flush mt-2">
                    {ninjaChart.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <span
                            style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              backgroundColor:
                                ninjaColors[index % ninjaColors.length],
                              marginRight: 10,
                            }}
                          ></span>
                          {item.name}
                        </div>
                        <strong>{item.value}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — ESET Pie Chart */}
        <div className="col-lg-4">
          <div className="card card-cockpit-general h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Inventaire ESET</h5>
              {loadingStats ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </div>
              ) : esetChartData.length > 0 ? (
                <>
                  <div style={{ width: "100%", height: 250 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={esetChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {esetChartData.map((_, index) => (
                            <Cell
                              key={`eset-cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul className="list-group list-group-flush mt-2">
                    {esetChartData.map((item, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center">
                          <span
                            style={{
                              display: "inline-block",
                              width: 14,
                              height: 14,
                              borderRadius: 3,
                              backgroundColor: COLORS[index % COLORS.length],
                              marginRight: 10,
                            }}
                          ></span>
                          {item.name}
                        </div>
                        <strong>{item.value}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-muted text-center">Aucun composant trouvé</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
