import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { getTickets } from "../services/ticketService";
import TicketModal from "../components/TicketModal"; // ✅ uncomment if needed

export default function Tickets() {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("15"); // ✅ date creation field in GLPI search API
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await getTickets({ search, sortField, sortOrder, page, limit });
      setData(res.data.data);
      setTotalRows(res.data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, limit, sortField, sortOrder]);

  const handleSort = (column, direction) => {
    setSortField(column.sortField);
    setSortOrder(direction.toUpperCase()); // GLPI expects UPPER
  };

  const columns = [
    { name: "ID", selector: row => row.id, sortable: true, sortField: "2" },
    { name: "Titre", selector: row => row.name, sortable: true, sortField: "1" },
    { name: "Statut", selector: row => getStatusLabel(row.status) },
    {
      name: "Date",
      selector: row => row.date?.split(" ")[0],
      sortable: true,
      sortField: "15",
    },
    {
      name: "Action",
      cell: row => (
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setSelectedTicketId(row.id)}
        >
          <i className="ri-eye-line"></i>
        </button>
      ),
    },
  ];

  return (
    <section className="my-4 container">

      {/* ✅ Ticket count card */}
      <div className="card-cockpit-grid mb-4">
        <article className="card-cockpit text-center">
          <div className="card-cockpit-header">
            <div>
              <span><i className="ri-ticket-line ri-lg"></i></span>
              <p>Total tickets</p>
            </div>
            <label className="toggle">{totalRows}</label>
          </div>
        </article>
      </div>

      {/* ✅ Search */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-auto"
          placeholder="Rechercher…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchTickets()}
        />
        <button className="btn btn-primary" onClick={fetchTickets}>
          Rechercher
        </button>
      </div>

      {/* ✅ Table */}
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={(page) => setPage(page)}
        onChangeRowsPerPage={(limit) => setLimit(limit)}
        onSort={handleSort}
        highlightOnHover
      />

      {/* ✅ Ticket modal (enable if exists) */}
      {selectedTicketId && (
        <div>
          <TicketModal ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />
        </div>
      )}

    </section>
  );
}

/* ✅ Status translator */
function getStatusLabel(status) {
  switch (status) {
    case 1: return "Nouveau";
    case 2: return "Assigné";
    case 3: return "Planifié";
    case 4: return "En cours";
    case 5: return "En attente";
    case 6: return "Résolu";
    case 7: return "Fermé";
    default: return "Inconnu";
  }
}
