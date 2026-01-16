import React, { useEffect, useState } from "react";
import {
  getCustomerById,
  getCustomerSubscriptionsDB,
} from "../../services/ionService";

export default function IonCustomerDetail() {
  const [customer, setCustomer] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, subsRes] = await Promise.all([
          getCustomerById(),
          getCustomerSubscriptionsDB(),
        ]);

        setCustomer(custRes.data?.data?.customer || null);
        setSubscriptions(subsRes.data?.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );

  if (!customer) return <p className="text-center mt-4">Client introuvable.</p>;

  return (
    <section className="my-5">
      <div className="container">
        <div className="row mb-3">
          {/* Carte gauche : informations client */}
          <div className="col-lg-4">
            <div className="card card-cockpit-general">
              <div className="card-body text-center">
                <i
                  className="ri-user-3-fill text-primary mb-3"
                  style={{ fontSize: 80 }}
                ></i>
                <h4 className="mb-1">{customer.name}</h4>
                <p className="text-secondary mb-1">{customer.company}</p>
                <p className="text-muted small">
                  {customer.addressCity} {customer.addressCountry}
                </p>

                <ul className="list-group list-group-flush mt-4 text-start">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="ri-phone-line text-primary me-2"></i>
                    <strong className="me-2">Téléphone :</strong>{" "}
                    {customer.phone || "-"}
                  </li>
                  <li className="list-group-item d-flex align-items-start">
                    <i className="ri-map-pin-line text-primary me-2 mt-1"></i>
                    <div>
                      <strong className="me-2">Adresse :</strong>
                      {customer.addressStreet || "-"}, {customer.addressZip}{" "}
                      {customer.addressCity}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Carte droite */}
          <div className="col-lg-8">
            {/* Comptes Cloud */}
            <div className="card card-cockpit-general mb-4">
              <div className="card-body table-responsive">
                <h4 className="mb-3">Comptes Cloud</h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Fournisseur</th>
                      <th>Email</th>
                      <th>ID du compte Cloud</th>
                      <th>Date de création</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.cloudAccounts?.length > 0 ? (
                      customer.cloudAccounts.map((acct) => (
                        <tr key={acct.cloudAccountId}>
                          <td>{acct.provider?.name || "-"}</td>
                          <td>{acct.email || "-"}</td>
                          <td>{acct.cloudAccountId}</td>
                          <td>{acct.createdAt}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          Aucun compte Cloud
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Abonnements */}
          <div className="card card-cockpit-general mb-4">
            <div className="card-body table-responsive">
              <h4 className="mb-3 d-flex justify-content-between align-items-center">
                <span>Abonnements</span>
                <span className="badge bg-primary">
                  Total licences :{" "}
                  {subscriptions.reduce(
                    (total, sub) =>
                      total + (sub.subscriptionTotalLicenses || 0),
                    0
                  )}
                </span>
              </h4>

              {subscriptions.length === 0 ? (
                <div className="text-center text-muted py-4">
                  Aucun abonnement trouvé
                </div>
              ) : (
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Produit</th>
                      <th>Statut</th>
                      <th>Licences</th>
                      <th>Prix</th>
                      <th>Coût</th>
                      <th>Cycle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub, i) => {
                      const isMicrosoft = sub.subscriptionName
                        ?.toLowerCase()
                        .includes("microsoft");

                      return (
                        <tr key={sub.id}>
                          <td>
                            <span
                              className="badge text-white"
                              style={{
                                backgroundColor: isMicrosoft
                                  ? "#4e73df"
                                  : [
                                      "#1cc88a",
                                      "#36b9cc",
                                      "#f6c23e",
                                      "#e74a3b",
                                      "#858796",
                                    ][i % 5],
                              }}
                            >
                              {sub.subscriptionName}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                sub.subscriptionStatus === "active"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {sub.subscriptionStatus}
                            </span>
                          </td>
                          <td>{sub.subscriptionTotalLicenses}</td>
                          <td>
                            {sub.price
                              ? `${Number(sub.price).toFixed(2)} ${
                                  sub.currency
                                }`
                              : "-"}
                          </td>
                          <td>
                            {sub.cost
                              ? `${Number(sub.cost).toFixed(2)} ${sub.currency}`
                              : "-"}
                          </td>
                          <td>{sub.subscriptionBillingCycle}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
