import { useState } from "react";
import DataTable from "react-data-table-component";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useNinjaStats from "../../hooks/useNinjaStats";

export default function NinjaOrganisationView() {
  const {
    organisation,
    devices,
    loading,
    cardStats,
    chartData,
    COLORS,
  } = useNinjaStats();

  const [filterText, setFilterText] = useState("");

  if (!organisation) return null;

  const filteredItems = devices.filter((d) =>
    d.dnsName?.toLowerCase().includes(filterText.toLowerCase())
  );

  const getDeviceTypeLabel = (nodeClass) => {
    switch (nodeClass) {
      case "WINDOWS_WORKSTATION":
        return "Poste de travail";
      case "WINDOWS_SERVER":
        return "Serveur Windows";
      default:
        return nodeClass;
    }
  };

  const columns = [
    {
      name: "Actif",
      width: "120px",
      selector: (row) => !row.offline,
      cell: (row) => (
        <span
          style={{
            height: 12,
            width: 12,
            borderRadius: "50%",
            display: "inline-block",
            backgroundColor: row.offline ? "#e74a3b" : "#1cc88a",
          }}
        ></span>
      ),
      sortable: true,
    },
    {
      name: "Nom",
      selector: (row) => row.dnsName,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => getDeviceTypeLabel(row.nodeClass),
      sortable: true,
    },
    {
      name: "Dernier utilisateur connecté",
      selector: (row) => row.lastLogged?.userName || "-",
      cell: (row) =>
        row.nodeClass === "WINDOWS_WORKSTATION"
          ? row.lastLogged?.userName || "-"
          : "-",
    },
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
            {organisation.name}
          </li>
        </ol>
      </nav>

      <section className="my-5">
        <div className="container">
          {/* Overview cards */}
          <div className="row g-3 mb-4">
            {cardStats.map((card, i) => (
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

          <div className="row">
            {/* Devices table */}
            <div className="col-lg-8">
              <div className="card card-cockpit-general">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Appareils</h4>
                    <input
                      type="text"
                      className="form-control form-control-sm w-auto"
                      placeholder="Rechercher…"
                      value={filterText}
                      onChange={(e) => setFilterText(e.target.value)}
                    />
                  </div>

                  {loading ? (
                    <div className="d-flex justify-content-center py-5">
                      <div className="spinner-border text-primary"></div>
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
                      noHeader
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Stats pie chart */}
            <div className="col-lg-4">
              <div className="card card-cockpit-general mt-4">
                <div className="card-body">
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Clean custom legend */}
                  <ul className="list-group list-group-flush mt-3">
                    {chartData.map((item, index) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
