import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getComputers, getPrinters } from "../../services/inventoryServices";

export default function InventoryDataTable() {
  const [computers, setComputers] = useState([]); // non-server computers
  const [servers, setServers] = useState([]); // SRV machines
  const [printers, setPrinters] = useState([]); // printers

  const [loadingComputers, setLoadingComputers] = useState(true);
  const [loadingServers, setLoadingServers] = useState(true);
  const [loadingPrinters, setLoadingPrinters] = useState(true);

  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("computers");

  // --- Fetch Computers & Servers ---
  useEffect(() => {
    const fetchComputers = async () => {
      setLoadingComputers(true);
      setLoadingServers(true);
      try {
        const res = await getComputers();
        console.log(res);

        // Extract the arrays correctly
        setComputers(Array.isArray(res.data?.data) ? res.data.data : []);
        setServers(
          Array.isArray(res.data?.srvComputers) ? res.data.srvComputers : []
        );
      } catch (err) {
        console.error("Failed to fetch computers:", err);
        setComputers([]);
        setServers([]);
      } finally {
        setLoadingComputers(false);
        setLoadingServers(false);
      }
    };
    fetchComputers();
  }, []);

  // --- Fetch Printers ---
  useEffect(() => {
    const fetchPrinters = async () => {
      setLoadingPrinters(true);
      try {
        const res = await getPrinters();
        setPrinters(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch printers:", err);
        setPrinters([]);
      } finally {
        setLoadingPrinters(false);
      }
    };
    fetchPrinters();
  }, []);

  // --- Safe filtering function ---
  const filterData = (data) =>
    (Array.isArray(data) ? data : []).filter(
      (item) =>
        (item.name || "").toLowerCase().includes(filterText.toLowerCase()) ||
        (item.serial || "").toLowerCase().includes(filterText.toLowerCase())
    );

  const filteredComputers = filterData(computers);
  const filteredServers = filterData(servers);
  const filteredPrinters = filterData(printers);

  // --- Columns with GLPI button ---
  const columns = [
    { name: "Nom", selector: (row) => row.name, sortable: true },
    { name: "Serial", selector: (row) => row.serial, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <a
          href={`https://servicedesk.limelogic.be/front/computer.form.php?id=${row.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-sm btn-primary"
        >
          Ouvrir GLPI
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <section className="my-5">
      <div className="container my-3">
        {/* Tabs */}
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "computers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("computers")}
            >
              <i className="ri-computer-line me-1"></i> Ordinateurs
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "servers" ? "active" : ""}`}
              onClick={() => setActiveTab("servers")}
            >
              <i className="ri-server-line me-1"></i> Serveurs
            </button>
          </li>
          {/* <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "printers" ? "active" : ""}`}
              onClick={() => setActiveTab("printers")}
            >
              <i className="ri-printer-line me-1"></i> Imprimantes
            </button>
          </li> */}
        </ul>

        {/* Filter input */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">
            {activeTab === "computers"
              ? "Liste des ordinateurs"
              : activeTab === "servers"
              ? "Liste des serveurs"
              : "Liste des imprimantes"}
          </h4>
          <input
            type="text"
            className="form-control form-control-sm w-auto"
            placeholder="Rechercher…"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        {/* Tab content */}
        <div className="card card-cockpit-general">
          <div className="card-body">
            {/* Computers */}
            {activeTab === "computers" &&
              (loadingComputers ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement…</span>
                  </div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredComputers}
                  pagination
                  striped
                  dense
                  highlightOnHover
                  responsive
                  noHeader
                  noDataComponent={
                    <div className="text-center text-muted py-3">
                      Aucun ordinateur trouvé
                    </div>
                  }
                />
              ))}

            {/* Servers */}
            {activeTab === "servers" &&
              (loadingServers ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement…</span>
                  </div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredServers}
                  pagination
                  striped
                  dense
                  highlightOnHover
                  responsive
                  noHeader
                  noDataComponent={
                    <div className="text-center text-muted py-3">
                      Aucun serveur trouvé
                    </div>
                  }
                />
              ))}

            {/* Printers */}
            {/* {activeTab === "printers" && (
              loadingPrinters ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement…</span>
                  </div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredPrinters}
                  pagination
                  striped
                  dense
                  highlightOnHover
                  responsive
                  noHeader
                  noDataComponent={
                    <div className="text-center text-muted py-3">
                      Aucune imprimante trouvée
                    </div>
                  }
                />
              )
            )} */}
          </div>
        </div>
      </div>
    </section>
  );
}
