import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDevice } from "../../services/eset.services";

export default function DeviceDetail() {
  const { id: deviceId } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      setLoading(true);
      try {
        const res = await getDevice(deviceId);
        console.log(res.data)
        setDevice(res.data.device);
      } catch (err) {
        console.error("Error fetching device:", err);
      } finally {
        setLoading(false);
      }
    };
    if (deviceId) fetchDevice();
  }, [deviceId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!device) return <p className="text-center mt-4">Device not found.</p>;

  return (
    <section className="my-5">
      <div className="container">
        <div className="row">
          {/* Device Info Card */}
          <div className="col-lg-4">
            <div className="card card-cockpit-general">
              <div className="card-body text-center">
                {/* OS Icon */}
                <i
                  className="ri-windows-fill text-primary"
                  style={{ fontSize: 80 }}
                ></i>
                <div className="mt-3">
                  <h4>{device.displayName}</h4>
                  <p className="text-secondary mb-1">
                    {device.operatingSystem.displayName}
                  </p>
                  <p className="text-muted font-size-sm">
                    Primary IP: {device.primaryLocalIpAddress}
                  </p>
                </div>
                <ul className="list-group list-group-flush mt-4 text-left">
                  <li className="list-group-item">
                    <strong>UUID:</strong> {device.uuid}
                  </li>
                  <li className="list-group-item text-left">
                    <strong>Public IP:</strong> {device.publicIpAddress}
                  </li>
                  <li className="list-group-item text-left">
                    <strong>Last Sync:</strong>{" "}
                    {new Date(device.lastSyncTime).toLocaleString()}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Deployed Components Table */}
          <div className="col-lg-8">
            <div className="card card-cockpit-general mb-4">
              <div className="card-body table-responsive">
                <h4 className="mb-3">Deployed Components</h4>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {device.deployedComponents.map((comp) => (
                      <tr key={comp.id}>
                        <td>{comp.displayName}</td>
                        <td>{comp.version?.name || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timeline / Last Sync */}
            <div className="card card-cockpit-general">
              <div className="card-body">
                <h4>Timeline</h4>
                <ul className="timeline">
                  <li className="active">
                    <h6>Last Sync</h6>
                    <p className="mb-0 text-muted">
                      {new Date(device.lastSyncTime).toLocaleString()}
                    </p>
                  </li>                  
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
