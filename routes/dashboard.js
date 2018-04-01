const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

/* Batch Finder API */
router.post('/findbatch', dashboardController.findBatch);

/* Locate Nearby Dealers/Distributors */
router.get('/nearby/:city', dashboardController.findNearBy);

/* Add sales for distributors */
router.get('/sales/:email', dashboardController.getSales);
router.post('/sales', dashboardController.addSales);

router.get('/projects/:email', dashboardController.getProjects);
router.post('/project', dashboardController.addProjects);
router.post('/enquire', dashboardController.sendEnquiry);

/* Get sales, project and point counter */
router.get('/salescounter/:email', dashboardController.countSales);
router.get('/projectcounter/:email', dashboardController.countProjects);
router.get('/pointcounter/:email', dashboardController.getRewardPoints);

router.post('/rewardclaim/', dashboardController.claimRewards);

module.exports = router;
