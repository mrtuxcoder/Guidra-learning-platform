const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth-middleware");

const { generateComponentController} = require('../../controllers/content-controllers/specific-content/generate-component')
const { regenerateComponentController} = require('../../controllers/content-controllers/specific-content/regenerate-component')
const {generateContentController} = require('../../controllers/content-controllers/unified-content/generate-content')
const {regenerateContentController} = require('../../controllers/content-controllers/unified-content/regenerate-content')


// Content teaching
router.post("/teach", authMiddleware, generateContentController);
router.post("/regenerate", authMiddleware, regenerateContentController);
router.post("/component", authMiddleware, generateComponentController);
router.post(
  "/component/regenerate",
  authMiddleware,
  regenerateComponentController
);


module.exports = router;
