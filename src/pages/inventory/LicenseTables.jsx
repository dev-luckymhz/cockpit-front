import { useEffect, useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { getMergedDevices } from "../../services/inventoryServices";

const customStyles = {
  rows: {
    style: {
      minHeight: "80px",
    },
  },
  headCells: {
    style: {
      fontWeight: "600",
      fontSize: "0.9rem",
    },
  },
};

const overviewCards = [
  { name: "Laptops", value: 18, icon: "ri-laptop-line", color: "#4e73df" },
  { name: "Serveurs physiques", value: 3, icon: "ri-server-line", color: "#1cc88a" },
  { name: "Serveurs virtuels", value: 7, icon: "ri-cloud-line", color: "#36b9cc" },
  { name: "Workstations", value: 22, icon: "ri-computer-line", color: "#f6c23e" },
  { name: "Autres", value: 2, icon: "ri-device-line", color: "#858796" },
];

export default function LicenseTables() {
  const [pcData, setPcData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await getMergedDevices();
        const devices = response.data.devices || [];

        const mapped = devices.map((d) => ({
          name: d.systemName,
          status: { label: "Actif", icon: "ri-wifi-line", color: "success" },
          microsoft: d.os?.name ? [d.os.name] : [],
          ninja: { label: "Actif", color: "success" },
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

  const columns = useMemo(
    () => [
      {
        name: "Nom du PC",
        selector: (row) => row.name,
        sortable: true,
        cell: (row) => (
          <span>
            <i className="ri-computer-line text-primary me-1"></i>
            {row.name}
          </span>
        ),
      },
      {
        name: "Statut",
        sortable: true,
        cell: (row) => (
          <span className={`badge bg-${row.status.color}`}>
            <i className={`${row.status.icon} me-1`}></i>
            {row.status.label}
          </span>
        ),
      },
      {
        name: "Microsoft",
        cell: (row) =>
          row.microsoft.length ? (
            <ul className="list-unstyled mb-0">
              {row.microsoft.map((lic, i) => (
                <li key={i}>
                  <i className="ri-microsoft-fill text-info me-1"></i>
                  {lic}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted">
              <i className="ri-close-circle-line me-1"></i>
              Aucune licence
            </span>
          ),
      },
      {
        name: "Ninja",
        cell: (row) => (
          <span className={`badge bg-${row.ninja.color}`}>
            <i className="ri-shield-check-line me-1"></i>
            {row.ninja.label}
          </span>
        ),
      },
      {
        name: "ESET",
        cell: (row) =>
          row.eset.list ? (
            <ul className="list-unstyled mb-0">
              {row.eset.list.map((item, i) => (
                <li key={i}>
                  <i className="ri-bug-line text-success me-1"></i>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <span className={`badge bg-${row.eset.color}`}>
              <i className="ri-bug-line me-1"></i>
              {row.eset.label}
            </span>
          ),
      },
    ],
    []
  );

  return (
    <div className="container py-5">
      {/* Overview Cards */}
      <div className="row g-3 mb-4">
        {overviewCards.map((card, i) => (
          <div key={i} className="col-sm-6 col-md-4 col-lg-2">
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

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={pcData}
        progressPending={loading}
        pagination
        highlightOnHover
        responsive
        striped
        customStyles={customStyles}
        noDataComponent="Aucune donnée"
      />
    </div>
  );
}
