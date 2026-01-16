import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "axios";

function UserModal({ user }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/user/${user.id}/details`,
          {
            withCredentials: true,
          }
        );
        setDetails(res.data.data);
      } catch (error) {
        console.error("Failed to load detailed user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [user]);

  const handleRedirectToGLPI = () => {
    if (user?.id) {
      window.open(
        `http://localhost/glpi/front/user.form.php?id=${user.id}`,
        "_blank"
      );
    }
  };

  const renderValue = (value) => {
    if (value === null || value === undefined) return "Non assigné";
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <div key={index}>
          {typeof item === "object"
            ? Object.entries(item).map(([k, v]) => (
                <div key={k}>
                  <strong>{k}:</strong> {v}
                </div>
              ))
            : item.toString()}
        </div>
      ));
    }
    if (typeof value === "object") {
      return <pre className="mb-0">{JSON.stringify(value, null, 2)}</pre>;
    }
    return value.toString();
  };

  return (
    <div
      className="modal fade"
      id="userModal"
      tabIndex="-1"
      aria-labelledby="userModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="userModalLabel">
              Détails de l'utilisateur #{user?.id}
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
              <div className="d-flex justify-content-center align-items-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : details ? (
              <table className="table table-bordered">
                <tbody>
                  {Object.entries(details.user).map(([key, value]) => (
                    <tr key={key}>
                      <th style={{ width: "30%" }}>{key}</th>
                      <td>{renderValue(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-danger">Détails introuvables.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-info"
              onClick={() => {
                if (!user?.id) return;
                window.location.href = `/users/${user.id}`;
              }}
            >
              Plus de détails
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleRedirectToGLPI}
            >
              Voir sur GLPI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

UserModal.propTypes = {
  user: PropTypes.object,
};

export default UserModal;
