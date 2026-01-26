const os = require('os'); 
const fs = require('fs');

module.exports = (app) => {
  const controllerFactory = require("../controllers/tarefas");
  const controller = controllerFactory();

  app.route("/api/info") 
    .get((req, res) => { 
      
      try { const cgroup = fs.readFileSync("/proc/self/cgroup", "utf8"); 
        const hostname = os.hostname(); 
        let containerId = "unknown"; 
        containerId = cgroup.split("\n")[0].split("/").pop(); 
        const instanceId = Math.random().toString(36).substring(7); 
        res.json({ hostname, containerId, instanceId }); 
      } catch (err) {
        res.status(500).send({ 
          message: "Erro ao obter informações do contêiner." ,
          error: err.message, // mensagem simples stack: err.stack // opcional: detalhes do stack trace
          stack: err.stack // opcional: detalhes do stack trace
        });
      } 
     
    });

  app.route("/api/tarefas")
    .get(async (req, res, next) => {
      try {
        await controller.findAll(req, res);
      } catch (err) {
        next(err);
      }
    })
    .post(async (req, res, next) => {
      try {
        await controller.create(req, res);
      } catch (err) {
        next(err);
      }
    });

  app.route("/api/tarefas/:uuid")
    .get(async (req, res, next) => {
      try {
        await controller.find(req, res);
      } catch (err) {
        next(err);
      }
    });

  app.route("/api/tarefas/update_priority/:uuid")
    .put(async (req, res, next) => {
      try {
        await controller.update_priority(req, res);
      } catch (err) {
        next(err);
      }
    });

  app.route("/api/tarefas/:uuid")
    .delete(async (req, res, next) => {
      try {
        await controller.delete(req, res);
      } catch (err) {
        next(err);
      }
    });
};
