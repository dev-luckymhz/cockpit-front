function Parametres() {
  const integrations = [
    {
      name: "Integration Ion",
      icon: "ri-flashlight-line",
      desc: "Connectez Ion pour synchroniser vos données en temps réel.",
      checked: true,
    },
    {
      name: "Integration Eset",
      icon: "ri-shield-line",
      desc: "Intégrez Eset pour la sécurité et le suivi des menaces.",
      checked: true,
    },
    {
      name: "Integration Ninja",
      icon: "ri-ninja-line",
      desc: "Automatisez vos workflows avec Ninja.",
      checked: true,
    },
  ];

  return (
    <div className="container-fluid mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-white px-0">
          <li className="breadcrumb-item">
            <a href="#">Accueil</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Paramètres
          </li>
        </ol>
      </nav>

      <main className="main">
        <div className="responsive-wrapper">
          {/* Content Header */}
          <div className="content-header">
            <div className="content-header-intro">
              <h2>Manuellement Mettre à jour les données de vos API</h2>
              <p>Superchargez votre workflow et connectez vos outils préférés.</p>
            </div>
            <div className="content-header-actions">
              <a href="#" className="button-cockpit">
                <i className="ri-refresh-line"></i>
                <span>Mettre à jour les données</span>
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="content">
            <div className="content-main">
              <div className="card-cockpit-grid">
                {integrations.map((app) => (
                  <article className="card-cockpit" key={app.name}>
                    <div className="card-cockpit-header">
                      <div>
                        <span>
                          <i className={`${app.icon} ri-lg`}></i>
                        </span>
                        <h3>{app.name}</h3>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" defaultChecked={app.checked} />
                        <span></span>
                      </label>
                    </div>
                    <div className="card-cockpit-body">
                      <p>{app.desc}</p>
                    </div>
                    <div className="card-cockpit-footer">
                      <a href="#">View integration</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Parametres;
