import { useEffect, useState } from "react";
import { AuthService } from "../../services/authService";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await AuthService.getProfile();
        setUser(data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Prepare data for the groups table
  const groupData = [
    { label: "GLPI", value: user.glpiGroups },
    { label: "ION", value: user.ionGroups },
    { label: "ESET", value: user.esetGroups },
    { label: "Ninja", value: user.ninjaGroups },
  ].filter((g) => g.value && g.value.trim() !== "");

  return (
    <section className="container my-5 d-flex flex-wrap justify-content-start gap-4">
      {/* Profile Info Card */}
      <div className="card p-3" style={{ width: "480px", flex: "0 0 auto" }}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-4">
            <img
              src={`https://ui-avatars.com/api/?name=${
                user.displayName || user.username
              }`}
              alt="avatar"
              className="rounded-circle me-3"
              width={64}
              height={64}
            />
            <div>
              <h5 className="mb-0">{user.displayName || user.username}</h5>
              <small className="text-muted">{user.email}</small>
            </div>
          </div>

          {/* User details in table */}
          <table className="table table-borderless table-sm mb-3">
            <tbody>
              <tr>
                <td className="text-muted" style={{ width: "180px" }}>
                  <i className="ri-id-card-line me-2"></i>Nom d'utilisateur :
                </td>
                <td>{user.username}</td>
              </tr>
              {user.title && (
                <tr>
                  <td className="text-muted">
                    <i className="ri-user-line me-2"></i>Titre :
                  </td>
                  <td>{user.title}</td>
                </tr>
              )}
              {user.department && (
                <tr>
                  <td className="text-muted">
                    <i className="ri-building-line me-2"></i>Département :
                  </td>
                  <td>{user.department}</td>
                </tr>
              )}
              <tr>
                <td className="text-muted">
                  <i className="ri-shield-user-line me-2"></i>Rôle :
                </td>
                <td>{user.role}</td>
              </tr>
              {user.lastLogin && (
                <tr>
                  <td className="text-muted">
                    <i className="ri-time-line me-2"></i>Dernière connexion :
                  </td>
                  <td>{user.lastLogin}</td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            className="btn btn-outline-danger w-100"
            onClick={handleLogout}
          >
            <i className="ri-logout-box-line me-2"></i> Déconnexion
          </button>
        </div>
      </div>

      {/* Groups Table Card */}
      <div className="card p-3" style={{ width: "480px", flex: "0 0 auto" }}>
        <div className="card-body">
          <h5 className="card-title mb-3">Groupes</h5>

          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "180px" }}>Catégorie</th>
                <th>Nom du groupe</th>
              </tr>
            </thead>
            <tbody>
              {groupData.length > 0 ? (
                groupData.map((g, i) => (
                  <tr key={g.label}>
                    <td>{g.label}</td>
                    <td>
                      <span
                        className="badge text-truncate"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                          color: "#fff",
                          minWidth: "120px",
                        }}
                      >
                        {g.value}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    Aucun groupe trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
