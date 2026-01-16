import Swal from "sweetalert2";
import { Modal } from "bootstrap";
import UserModal from "../components/UserModal";
import { getUsers } from "../services/userService";
import { useEffect, useRef, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // ✅ FIX: Added selectedUser

  const modalRef = useRef(null); // ✅ For modal DOM reference

  // Filters
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const res = await getUsers({
        search,
        sortField,
        sortOrder,
      });
      setUsers(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de charger les utilisateurs",
      });
    } finally {
      setTableLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
    const modal = new Modal(document.getElementById("userModal"));
    modal.show();
  };

  const handleGoTo = (user) => {
    console.log("Go to user profile:", user.id);
    Swal.fire("Redirection simulée", `Vers /users/${user.id}`, "info");
  };

  return (
    <div className="container-fluid mt-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item">
            <a href="#">Accueil</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Utilisateurs
          </li>
        </ol>
      </nav>

      {/* Filters */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Recherche par nom ou prénom..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="1">Nom</option>
              <option value="2">Prénom</option>
              <option value="15">Date de dernière modification</option>
            </select>
          </div>
          <div className="col-md-2 mb-2">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="ASC">Ascendant</option>
              <option value="DESC">Descendant</option>
            </select>
          </div>
          <div className="col-md-1 mb-2">
            <button type="submit" className="btn btn-primary w-100">
              Rechercher
            </button>
          </div>
          <div className="col-md-1 mb-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setSearch("");
                setSortField("id");
                setSortOrder("ASC");
                fetchUsers();
              }}
              title="Réinitialiser les filtres"
            >
              <i className="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="card-header">Liste des Utilisateurs</div>
        <div className="card-body p-0">
          {tableLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <table className="table table-striped mb-0">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Prénom</th>
                  <th scope="col">Téléphone</th>
                  <th scope="col">Dernière connexion</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id ?? "Non assigné"}</td>
                      <td>
                        {user.displayName || user.username || "Non assigné"}
                      </td>
                      <td>{user.username?.split(".")[0] || "Non assigné"}</td>
                      <td>{user.phone || "Non assigné"}</td>
                      <td>
                        {user.lastLogin
                          ? user.lastLogin.split("T")[0]
                          : "Non assigné"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          title="Voir"
                          onClick={() => handleView(user)}
                        >
                          <i className="ri-eye-line"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          title="Aller à la fiche"
                          onClick={() => handleGoTo(user)}
                        >
                          <i className="ri-arrow-right-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ✅ Modal rendered only if user is selected */}
      <div ref={modalRef}>
        <UserModal user={selectedUser} />
      </div>
    </div>
  );
}

export default Users;
