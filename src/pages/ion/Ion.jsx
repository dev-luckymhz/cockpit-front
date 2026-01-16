import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { getCustomers, getCustomerSubscriptionsDB } from "../../services/ionService";

export default function IonDataTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchCustomers = async () => {
    setTableLoading(true);
    try {
      const res = await getCustomers({ search });
      setCustomers(res.data?.data?.customer || []);
      console.log(res.data?.data?.customer)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les clients",
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchCustomers();
      setLoading(false);
    };
    init();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  // Columns for DataTable
  const columns = [
    { name: "Nom", selector: (row) => row.name, sortable: true },
    { name: "Société", selector: (row) => row.company || "-", sortable: true },
    { name: "Email", selector: (row) => row.email || "-", sortable: true },
    { name: "Téléphone", selector: (row) => row.phone || "-", sortable: true },
    { name: "Ville", selector: (row) => row.addressCity || "-", sortable: true },
    { name: "Pays", selector: (row) => row.addressCountry || "-", sortable: true },
    {
      name: "Date d’ajout",
      selector: (row) => (row.dateAdded ? row.dateAdded.split(" ")[0] : "-"),
      sortable: true,
    },
    {
      name: "Action",                                     // new column
      cell: (row) => (
        <Link
          to={`/ion/device/${row.id}/details`}          // assumes row.id is the device/customer id
          className="text-primary"
          title="Voir le détail"
        >
          <i className="ri-eye-line"></i>          {/* remixicon eye */}
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) return <div className="text-center mt-5">Chargement des clients…</div>;

  return (
    <div className="container-fluid mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item"><a href="#">Accueil</a></li>
          <li className="breadcrumb-item active" aria-current="page">Clients Ion</li>
        </ol>
      </nav>

      {/* Search / Filters */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Recherche par nom ou email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-2">
            <button type="submit" className="btn btn-primary w-100">Rechercher</button>
          </div>
          <div className="col-md-2 mb-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearch("");
                fetchCustomers();
              }}
              title="Réinitialiser"
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Customers DataTable */}
      <div className="card card-cockpit-general shadow-sm">
        <div className="card-header fw-semibold">Liste des Clients</div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={customers}
            striped
            dense
            highlightOnHover
            pagination
            progressPending={tableLoading}
            responsive
            noDataComponent="Aucun client trouvé."
          />
        </div>
      </div>
    </div>
  );
}
