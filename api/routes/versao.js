const os = require('os');
const fs = require('fs');

module.exports = (app) => {
  const controller = require("../controllers/versao")();

  app.route("/api/versao").get(controller.get);

  // rota de diagnóstico 
  app.route("/api/info")
    .get((req, res) => {
      try {
        // hostname do container 
        const hostname = os.hostname();
        // tenta pegar o container ID 
        let containerId = "unknown";
        try {
          const cgroup = fs.readFileSync("/proc/self/cgroup", "utf8");
          containerId = cgroup.split("\n")[0].split("/").pop();
        } catch (err) {
          containerId = "erro ao ler cgroup";
        }
        // gera um ID aleatório por instância 
        const instanceId = Math.random().toString(36).substring(7);
        res.json({ hostname, containerId, instanceId });
      } catch (err) {
        res.status(500).send({ message: "Erro ao obter informações do contêiner.", error: err.message });
      }
    }
    );

};
