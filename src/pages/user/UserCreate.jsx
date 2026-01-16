import React, { useState } from "react";
import { AuthService  } from "../../services/authService";

export default function UserCreate() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
    role: "user",
    ionGroups: "",
    esetGroups: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await AuthService.createUser(form);
      setMessage(res.data.message || "User created successfully!");
      setForm({
        username: "",
        email: "",
        password: "",
        displayName: "",
        role: "user",
        ionGroups: "",
        esetGroups: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred while creating user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
        <section className="my-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card card-cockpit-general shadow">
              <div className="card-body">
                <h3 className="mb-4 text-center">Créer un nouvel utilisateur</h3>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {/* Nom d'utilisateur */}
                  <div className="mb-3">
                    <label className="form-label">Nom d’utilisateur</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="Ex : jdupont"
                      value={form.username}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">
                      Identifiant de connexion (court et sans espaces)
                    </small>
                  </div>

                  {/* Adresse e-mail */}
                  <div className="mb-3">
                    <label className="form-label">Adresse e-mail</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="exemple@domaine.fr"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Mot de passe */}
                  <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Choisissez un mot de passe sécurisé"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Nom affiché */}
                  <div className="mb-3">
                    <label className="form-label">Nom complet</label>
                    <input
                      type="text"
                      name="displayName"
                      className="form-control"
                      placeholder="Ex : Jean Dupont"
                      value={form.displayName}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Rôle */}
                  <div className="mb-3">
                    <label className="form-label">Rôle</label>
                    <select
                      name="role"
                      className="form-select"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="manager">Responsable</option>
                      <option value="admin">Administrateur</option>
                    </select>
                    <small className="text-muted">
                      Détermine les droits d’accès de l’utilisateur
                    </small>
                  </div>

                  {/* Groupe ION */}
                  <div className="mb-3">
                    <label className="form-label">Groupe ION</label>
                    <input
                      type="text"
                      name="ionGroups"
                      className="form-control"
                      placeholder="Ex : Groupe ION principal"
                      value={form.ionGroups}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Groupe ESET */}
                  <div className="mb-3">
                    <label className="form-label">Groupe ESET</label>
                    <input
                      type="text"
                      name="esetGroups"
                      className="form-control"
                      placeholder="Ex : Groupe Sécurité ESET"
                      value={form.esetGroups}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Bouton de création */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Création en cours..." : "Créer l’utilisateur"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
