import { useEffect, useState } from "react";
import {
  getCustomerById,
  getCustomerSubscriptionsDB,
} from "../../services/ionService";

const FIELD_LABELS_FR = {
  subscriptionName: "Nom de l’abonnement",
  subscriptionStatus: "Statut",
  subscriptionBillingCycle: "Cycle de facturation",
  subscriptionBillingTerm: "Durée",
  autoRenew: "Renouvellement automatique",
  renewalDate: "Date de renouvellement",
};

const ALLOWED_DETAIL_FIELDS = [
  "subscriptionName",
  "subscriptionStatus",
  "subscriptionBillingTerm",
  "subscriptionBillingCycle",
  "autoRenew",
  "renewalDate",
];

export default function IonCustomerDetail() {
  const [customer, setCustomer] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [custRes, subsRes] = await Promise.all([
          getCustomerById(),
          getCustomerSubscriptionsDB(),
        ]);

        const subs = subsRes.data?.data || [];
        setCustomer(custRes.data?.data?.customer || null);
        setSubscriptions(subs);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusLabel = (status) => {
    switch (status) {
      case "active":
        return { label: "Actif", color: "#1cc88a" };
      case "suspended":
        return { label: "Suspendu", color: "#f6c23e" };
      default:
        return { label: "Inactif", color: "#858796" };
    }
  };

  const cycleLabel = (cycle) => {
    switch (cycle) {
      case "monthly":
        return { label: "Mensuel", color: "#4e73df", icon: "ri-repeat-line" };
      case "annual":
        return { label: "Annuel", color: "#1cc88a", icon: "ri-calendar-line" };
      default:
        return { label: cycle, color: "#858796", icon: "ri-question-line" };
    }
  };

  // Remove deleted + one_time
  const filteredSubscriptions = subscriptions.filter(
    (s) =>
      s.subscriptionStatus !== "deleted" &&
      s.subscriptionBillingCycle !== "one_time"
  );

  const totalLicenses = filteredSubscriptions.reduce(
    (total, sub) => total + (sub.subscriptionTotalLicenses || 0),
    0
  );

  if (loading) return <div className="text-center py-5">Chargement...</div>;
  if (!customer) return <p className="text-center mt-4">Client introuvable.</p>;

  return (
    <section className="my-5">
      <div className="container">

        {/* ABONNEMENTS */}
        <div className="card card-cockpit-general mb-4">
          <div className="card-body">
            <h4 className="mb-3 d-flex justify-content-between align-items-center">
              <span>Abonnements</span>
            </h4>

            <div className="row g-3">
              {filteredSubscriptions.map((sub) => {
                const status = statusLabel(sub.subscriptionStatus);
                const cycle = cycleLabel(sub.subscriptionBillingCycle);
                const isSelected = selectedSub?.id === sub.id;

                return (
                  <div key={sub.id} className="col-sm-6 col-lg-4">
                    <div
                      className={`bg-light card-cockpit-general p-3 h-100 cursor-pointer ${isSelected ? "border border-primary" : ""}`}
                      style={{ borderTop: `4px solid ${cycle.color}` }}
                      onClick={() => setSelectedSub(sub)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2" style={{ minHeight: 48 }}>
                        <div
                          className="fw-semibold text-truncate"
                          title={sub.subscriptionName}
                          style={{
                            maxWidth: "85%",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {sub.subscriptionName}
                        </div>
                        <i className="ri-cloud-line" style={{ color: cycle.color, fontSize: 20 }} />
                      </div>

                      <div className="row text-center small mb-2">
                        <div className="col-6" style={{ color: status.color }}>
                          <i className="ri-shield-check-line me-1"></i>
                          {status.label}
                        </div>
                        <div className="col-6" style={{ color: cycle.color }}>
                          <i className={`${cycle.icon} me-1`}></i>
                          {cycle.label}
                        </div>
                      </div>

                      <div className="row text-center small">
                        <div className="col-12">
                          <i className="ri-key-line me-1"></i>
                          {sub.subscriptionTotalLicenses} licences
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DÉTAIL ABONNEMENT */}
        {selectedSub && (
          <div className="card card-cockpit-general">
            <div className="card-body">
              <h4 className="mb-3">Détails de l’abonnement sélectionné</h4>

              <table className="table table-sm table-striped">
                <tbody>
                  {ALLOWED_DETAIL_FIELDS.map((key) => (
                    <tr key={key}>
                      <th style={{ width: "35%" }}>{FIELD_LABELS_FR[key]}</th>
                      <td>
                        {typeof selectedSub[key] === "boolean"
                          ? selectedSub[key] ? "Oui" : "Non"
                          : selectedSub[key] || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
