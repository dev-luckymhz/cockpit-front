import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getEntities } from "../services/entityService";
import EntitySelector from "../components/EntitySelector";
import { getLicences, getAbonnementStats } from "../services/licenceService";

function Abonnements() {
  const [licences, setLicences] = useState([]);
  const [stats, setStats] = useState({ active: 0, expired: 0, expiringSoon: 0 });
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Entity filter
  const [entityId, setEntityId] = useState("0");
  const [entityName, setEntityName] = useState("");

  const fetchLicences = async () => {
    setLoading(true);
    try {
      const response = await getLicences({ search, sortField, sortOrder, entityId });
      setLicences(response.data.data || []);
      setTotalCount(response.data.totalcount || 0);
    } catch (error) {
      Swal.fire("Erreur", "Impossible de charger les abonnements", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getAbonnementStats();
      setStats({
        active: response.data.active || 0,
        expired: response.data.expired || 0,
        expiringSoon: response.data.expiring_soon || 0,
      });
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  const handleEntityChange = async (name) => {
    setEntityName(name);
    try {
      const res = await getEntities(name);
      const found = res.data?.data.find((entity) => entity.name === name);
      setEntityId(found ? found.id.toString() : "0");
    } catch {
      setEntityId("0");
    }
  };

  // Submit handler for the form (to trigger fetchLicences)
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchLicences();
  };

  // Reset handler
  const handleReset = () => {
    setSearch("");
    setSortField("name");
    setSortOrder("ASC");
    setEntityName("");
    setEntityId("0");
    fetchLicences();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // We no longer want to auto-fetch licences on each input change,
  // but only on form submit or reset, so remove fetchLicences from useEffect dependencies here

  const renderStatusBadge = (expireDate) => {
    const now = new Date();
    const exp = new Date(expireDate);

    if (exp < now) return <span className="badge bg-danger">Expiré</span>;

    const timeDiff = exp.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft <= 30) return <span className="badge bg-warning text-dark">Exp. bientôt</span>;

    return <span className="badge bg-success">Actif</span>;
  };

  return (
    <div className="container-fluid mt-4">
      <h4 className="mb-3">Abonnements</h4>

      {/* Stat Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Actifs</h5>
              <p className="display-6">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h5 className="card-title">Expirant bientôt</h5>
              <p className="display-6">{stats.expiringSoon}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h5 className="card-title">Expirés</h5>
              <p className="display-6">{stats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher un abonnement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="name">Nom</option>
              <option value="expire">Date d'expiration</option>
              <option value="date_creation">Date de création</option>
            </select>
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="ASC">Ascendant</option>
              <option value="DESC">Descendant</option>
            </select>
          </div>
          <div className="col-md-2">
            <EntitySelector value={entityName} onChange={handleEntityChange} />
          </div>
          <div className="col-md-1 d-grid">
            <button type="submit" className="btn btn-primary w-100">
              Rechercher
            </button>
          </div>
          <div className="col-md-1 d-grid">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={handleReset}
              title="Réinitialiser les filtres"
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      </form>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          Liste des Abonnements ({totalCount})
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <table className="table table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Utilisateur</th>
                  <th>Créé le</th>
                  <th>Expire</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {licences.map((licence) => (
                  <tr key={licence.id}>
                    <td>{licence.name}</td>
                    <td>{licence.users_id ? `ID ${licence.users_id}` : "Non assigné"}</td>
                    <td>{licence.date_creation?.slice(0, 10)}</td>
                    <td>{licence.expire?.slice(0, 10)}</td>
                    <td>{renderStatusBadge(licence.expire)}</td>
                  </tr>
                ))}
                {licences.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      Aucun abonnement trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Abonnements;
