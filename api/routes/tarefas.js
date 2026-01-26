const os = require('os'); 
const fs = require('fs');

module.exports = (app) => {
  const controllerFactory = require("../controllers/tarefas");
  const controller = controllerFactory();

  app.route("/api/info") 
    .get((req, res) => { 
      const hostname = os.hostname(); 
      let containerId = "unknown"; 
      try { const cgroup = fs.readFileSync("/proc/self/cgroup", "utf8"); 
        containerId = cgroup.split("\n")[0].split("/").pop(); 
      } catch (err) {} 
      const instanceId = Math.random().toString(36).substring(7); 
      res.json({ hostname, containerId, instanceId }); 
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
