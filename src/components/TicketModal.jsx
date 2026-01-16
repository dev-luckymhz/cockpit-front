import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap";
import { getTicketDetails } from "../services/ticketService";

function TicketModal({ ticketId, onClose }) {
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);
  const modalInstanceRef = useRef(null);

  useEffect(() => {
    if (modalRef.current && !modalInstanceRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current, {
        backdrop: "static",
      });

      modalRef.current.addEventListener("hidden.bs.modal", () => {
        onClose();
      });
    }
  }, [onClose]);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails(ticketId);
    }
  }, [ticketId]);

  useEffect(() => {
    if (ticketDetails && modalInstanceRef.current) {
      modalInstanceRef.current.show();
    }
  }, [ticketDetails]);

  const fetchTicketDetails = async (id) => {
    setLoading(true);
    setTicketDetails(null);
    try {
      const res = await getTicketDetails(id);
      setTicketDetails(res.data);
    } catch (error) {
      console.error("Failed to fetch ticket details", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (type) => {
    switch (type) {
      case 1:
        return "Demandeur";
      case 2:
        return "Attribué à";
      case 3:
        return "Observateur";
      default:
        return "Utilisateur";
    }
  };

  const { ticket, users = [], followups = [], links = [] } = ticketDetails || {};

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="ticketModal"
      tabIndex="-1"
      aria-labelledby="ticketModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="ticketModalLabel">
              {ticket ? `Ticket #${ticket.id}` : "Chargement..."}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Fermer"
            ></button>
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : ticket ? (
              <>
                {/* Tabs Nav */}
                <ul className="nav nav-tabs mb-3" id="ticketTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="details-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#details"
                      type="button"
                      role="tab"
                      aria-controls="details"
                      aria-selected="true"
                    >
                      Détails
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="users-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#users"
                      type="button"
                      role="tab"
                      aria-controls="users"
                      aria-selected="false"
                    >
                      Utilisateurs
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="followups-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#followups"
                      type="button"
                      role="tab"
                      aria-controls="followups"
                      aria-selected="false"
                    >
                      Suivis
                    </button>
                  </li>
                </ul>

                {/* Tabs Content */}
                <div className="tab-content" id="ticketTabContent">
                  {/* Details Tab */}
                  <div
                    className="tab-pane fade show active"
                    id="details"
                    role="tabpanel"
                    aria-labelledby="details-tab"
                  >
                    <h5>{ticket.name}</h5>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: decodeHTML(ticket.content),
                      }}
                    />

                    <table className="table table-bordered table-sm mt-3">
                      <tbody>
                        <tr>
                          <th style={{ width: "30%" }}>Date de création</th>
                          <td>{ticket.date_creation}</td>
                        </tr>
                        <tr>
                          <th>Dernière modification</th>
                          <td>{ticket.date_mod}</td>
                        </tr>
                        <tr>
                          <th>Statut</th>
                          <td>{getStatusLabel(ticket.status)}</td>
                        </tr>
                        <tr>
                          <th>Urgence / Impact / Priorité</th>
                          <td>{`${ticket.urgency} / ${ticket.impact} / ${ticket.priority}`}</td>
                        </tr>
                        <tr>
                          <th>Type</th>
                          <td>{ticket.type === 1 ? "Incident" : "Demande"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Users Tab */}
                  <div
                    className="tab-pane fade"
                    id="users"
                    role="tabpanel"
                    aria-labelledby="users-tab"
                  >
                    {users.length > 0 ? (
                      <ul>
                        {users.map((u, idx) => (
                          <li key={idx}>
                            {getUserRole(u.type)} — ID utilisateur: {u.users_id}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucun utilisateur associé.</p>
                    )}
                  </div>

                  {/* Followups Tab */}
                  <div
                    className="tab-pane fade"
                    id="followups"
                    role="tabpanel"
                    aria-labelledby="followups-tab"
                  >
                    {followups.length > 0 ? (
                      <ul className="list-group">
                        {followups.map((f) => (
                          <li key={f.id} className="list-group-item">
                            <div>
                              <strong>{f.date}</strong> — ID utilisateur: {f.users_id}
                            </div>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: decodeHTML(f.content),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Aucun suivi disponible.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-danger">Détails du ticket introuvables.</p>
            )}
          </div>

          <div className="modal-footer">
            {ticket && (
              <>
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() => window.location.assign(`/tickets/${ticket.id}`)}
                >
                  Plus de détails
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    window.open(
                      `https://servicedesk.limelogic.be/front/ticket.form.php?id=${ticket.id}`,
                      "_blank"
                    )
                  }
                >
                  Voir sur GLPI
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusLabel(status) {
  switch (status) {
    case 1:
      return "Nouveau";
    case 2:
      return "Attribué";
    case 3:
      return "Planifié";
    case 4:
      return "En cours";
    case 5:
      return "En attente";
    case 6:
      return "Résolu";
    case 7:
      return "Fermé";
    default:
      return "Inconnu";
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export default TicketModal;
