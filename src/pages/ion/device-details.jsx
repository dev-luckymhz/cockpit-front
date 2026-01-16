import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCustomerById,
  getCustomerSubscriptions,
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
          getCustomerSubscriptions(),
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
        <div className="row">
          {/* Carte gauche : informations client */}
          <div className="col-lg-4">
            <div className="card card-cockpit-general">
              <div className="card-body text-center">
                {/* Avatar / main icon */}
                <i
                  className="ri-user-3-fill text-primary mb-3"
                  style={{ fontSize: 80 }}
                ></i>

                {/* Customer header */}
                <h4 className="mb-1">{customer.name}</h4>
                <p className="text-secondary mb-1">{customer.company}</p>
                <p className="text-muted small">
                  {customer.addressCity} {customer.addressCountry}
                </p>

                {/* Details list */}
                <ul className="list-group list-group-flush mt-4 text-start">
                  {/* <li className="list-group-item d-flex align-items-center">
                    <i className="ri-fingerprint-line text-primary me-2"></i>
                    <strong className="me-2">ID :</strong> {customer.id}
                  </li> */}
                  <li className="list-group-item d-flex align-items-center">
                    <i className="ri-mail-line text-primary me-2"></i>
                    <strong className="me-2">Email :</strong>{" "}
                    {customer.email || "-"}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="ri-phone-line text-primary me-2"></i>
                    <strong className="me-2">Téléphone :</strong>{" "}
                    {customer.phone || "-"}
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="ri-calendar-line text-primary me-2"></i>
                    <strong className="me-2">Date d’ajout :</strong>{" "}
                    {customer.dateAdded}
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

          {/* Carte droite : comptes cloud + timeline + abonnements */}
          <div className="col-lg-8">
            {/* Abonnements */}
            <div className="card card-cockpit-general mb-4">
              <div className="card-body table-responsive">
                <h4 className="mb-3">Abonnements</h4>

                {subscriptions.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    Aucun abonnement trouvé
                  </div>
                ) : (
                  <>
                    <table className="table table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Produit</th>
                          <th>Prix</th>
                          <th>Coût</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions[0].lines.map((sub, i) => {
                          const productLine = sub.lines?.[0];
                          const skuLine = productLine?.lines?.[0];
                          const data = skuLine?.data || {};
                          const productName = productLine?.entity.id || "-";

                          const isMicrosoft = productName
                            .toLowerCase()
                            .includes("microsoft");

                          return (
                            <tr key={sub.entity.id}>
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
                                  {productName}
                                </span>
                              </td>
                              <td>
                                {data.price !== undefined
                                  ? `${Number(data.price).toFixed(2)} ${
                                      sub.entity.price_currency || ""
                                    }`
                                  : "-"}
                              </td>
                              <td>
                                {data.cost !== undefined
                                  ? `${Number(data.cost).toFixed(2)} ${
                                      sub.entity.cost_currency || ""
                                    }`
                                  : "-"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>

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

            {/* Timeline */}

            {/* <div className="card card-cockpit-general">
              <div className="card-body">
                <h4>Historique</h4>
                <ul className="timeline">
                  <li className="active">
                    <h6>Créé</h6>
                    <p className="mb-0 text-muted">{customer.dateAdded}</p>
                  </li>
                  {customer.cloudAccounts?.map((acct) => (
                    <li key={acct.cloudAccountId}>
                      <h6>Compte Cloud ajouté</h6>
                      <p className="mb-0 text-muted">
                        {acct.provider?.name} ({acct.cloudAccountId})
                      </p>
                      <p className="text-muted">{acct.createdAt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}
            
          </div>
        </div>
      </div>
    </section>
  );
}
